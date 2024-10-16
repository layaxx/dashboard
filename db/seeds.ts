import { SecurePassword } from "@blitzjs/auth/secure-password"
import { faker } from "@faker-js/faker"
import dayjs from "dayjs"
import db from "db"

const getFeedNamePrefix = (index: number) => "Feed " + (index + 1) + ": "

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

  const numberOfFeeds = 5
  const numberOfEntriesPerFeed = 40

  const feedData = Array.from({ length: numberOfFeeds }, (_, index) => {
    return {
      name: getFeedNamePrefix(index) + faker.internet.userName(),
      position: index,
      loadIntervall: 15,
      url: faker.internet.url({ appendSlash: false }).replaceAll(/(\.\w+)$/g, ".invalid"), // prevent accidental requests to real servers
      lastLoad: faker.date.past(),
    }
  })
  const feeds = await db.feed.createManyAndReturn({ data: feedData })

  const entriesData = feeds.flatMap((feed, feedIndex) => {
    return Array.from({ length: numberOfEntriesPerFeed }, (_, index) => ({
      id: String(feedIndex * numberOfEntriesPerFeed + index), // ensure unique id
      link: faker.internet.url(),
      summary: faker.lorem.paragraph(),
      title: getFeedNamePrefix(feedIndex) + "Entry " + index + ": " + faker.lorem.words(2),
      text: faker.lorem.paragraphs(
        { min: 1, max: 100 },
        faker.datatype.boolean() ? "<br/>\n" : "\n",
      ),
      feedId: feed.id,
      createdAt: dayjs()
        .subtract(numberOfEntriesPerFeed - index, "day")
        .toDate(),
    }))
  })
  await db.feedentry.createMany({ data: entriesData })

  await db.readlistentry.createMany({
    data: Array.from({ length: numberOfFeeds }, () => ({ url: faker.internet.url() })),
  })
}

export default seed
