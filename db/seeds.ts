import { SecurePassword } from "@blitzjs/auth/secure-password"
import dayjs from "dayjs"
import db from "db"

const seed = async () => {
  await db.$reset()

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

  const minutesBetweenLoads = 5
  await db.statusLoad.createMany({
    data: Array.from({ length: 15 }, (_, index) => ({
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
}

export default seed
