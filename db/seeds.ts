import { SecurePassword } from "@blitzjs/auth/secure-password"
import { faker } from "@faker-js/faker"
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
    lastLoad: faker.date.past(),
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
      duration: faker.number.float({ min: 100, max: 1000 }),
    })),
  })

  const minutesBetweenLoads = 5
  await db.statusLoad.createMany({
    data: Array.from({ length: 15 }, (_, index) => ({
      loadTime: dayjs()
        .subtract(index * minutesBetweenLoads, "minutes")
        .toDate(),
      loadDuration: faker.number.int({ min: 0, max: 100 }),
      insertCount: faker.datatype.boolean() ? faker.number.int({ min: 0, max: 10 }) : 0,
      updateCount: faker.datatype.boolean() ? faker.number.int({ min: 0, max: 5 }) : 0,
      errors: faker.datatype.boolean({ probability: 0.75 })
        ? []
        : Array.from(
            { length: faker.number.int({ min: 1, max: 3 }) },
            () => "[Seed Data]: " + faker.lorem.sentence()
          ),
    })),
  })
}

export default seed
