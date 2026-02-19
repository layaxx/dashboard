import { BlitzLogger } from "blitz"
import { getSession } from "@blitzjs/auth"
import { SecurePassword } from "@blitzjs/auth/secure-password"
import dayjs from "dayjs"
import { NextApiRequest, NextApiResponse } from "next"
import { api } from "app/blitz-server"
import db from "db"

const logger = BlitzLogger({ name: "/api/demo/seed" })

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
  const session = await getSession(request, response)

  if (process.env.NEXT_PUBLIC_IS_DEMO_MODE !== "true") {
    logger.warn("/api/demo/seed called but demo mode is not active")
    response.statusCode = 403
    response.statusMessage = "Demo mode is not active"
    response.end()
    return
  }

  if (!session.userId) {
    if (process.env.API_TOKEN && request.headers["api-token"] === process.env.API_TOKEN) {
      logger.info("Access to /api/demo/seed granted due to valid api token")
    } else {
      logger.warn("Access to /api/demo/seed denied")
      response.statusCode = 403
      response.statusMessage = "Please log in to use this API route"
      response.end()
      return
    }
  }

  try {
    await db.feedLoadEvent.deleteMany()
    await db.feedentry.deleteMany()
    await db.feedoption.deleteMany()
    await db.feed.deleteMany()
    await db.readlistentry.deleteMany()
    await db.statusClean.deleteMany()
    await db.statusLoad.deleteMany()
    await db.user.deleteMany()

    await db.user.create({
      data: {
        email: "blitz@localhost.localdomain",
        name: "Local Account",
        role: "ADMIN",
        hashedPassword: await SecurePassword.hash("password"),
      },
    })

    await db.user.create({
      data: {
        email: "demo@example.com",
        name: "Demo Account",
        role: "USER",
        hashedPassword: await SecurePassword.hash("demo"),
      },
    })

    const urls = [
      { url: "https://www.heise.de/security/rss/news.rdf", name: "Heise Security" },
      { url: "https://netzpolitik.org/feed", name: "Netzpolitik.org" },
    ]

    const feedData = urls.map((feed, index) => ({
      name: feed.name,
      position: index,
      loadIntervall: 360, // 6 hours
      url: feed.url,
      lastLoad: dayjs()
        .subtract(Math.floor(Math.random() * 30), "day")
        .toDate(),
    }))
    await db.feed.createManyAndReturn({ data: feedData })

    const readListLinks = [
      "https://news.ycombinator.com/",
      "https://y-lang.eu/",
      "https://github.com/layaxx/dashboard",
      "https://github.com/layaxx/",
    ]

    await db.readlistentry.createMany({
      data: readListLinks.map((url) => ({ url })),
    })

    await db.statusClean.createMany({
      data: Array.from({ length: 10 }, (_, index) => ({
        time: dayjs().subtract(index, "day").toDate(),
        duration: Math.floor(Math.random() * 1000) + 50,
      })),
    })

    const minutesBetweenLoads = 15
    await db.statusLoad.createMany({
      data: Array.from({ length: 25 }, (_, index) => ({
        loadTime: dayjs()
          .subtract(index * minutesBetweenLoads, "minutes")
          .toDate(),
        loadDuration: Math.floor(Math.random() * 100),
        insertCount: Math.random() < 0.5 ? Math.floor(Math.random() * 11) : 0,
        updateCount: Math.random() < 0.5 ? Math.floor(Math.random() * 6) : 0,
        errors:
          Math.random() < 0.75
            ? []
            : Array.from(
                { length: Math.floor(Math.random() * 3) + 1 },
                () => "[Seed Data] Sample error message"
              ),
      })),
    })

    response.statusCode = 200
    response.end(`Seeded demo data successfully`)
  } catch (error) {
    console.error(error)
    response.statusCode = 500
    response.end(`An error occurred during seeding demo data`)
  }
}
export default api(handler)
