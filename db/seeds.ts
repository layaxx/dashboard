import { SecurePassword } from "@blitzjs/auth/secure-password"
import { faker } from "@faker-js/faker"
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

  const numberOfFeeds = 5
  const numberOfEntriesPerFeed = 40

  for (let index = 0; index < numberOfFeeds; index++) {
    const feedNamePrefix = "Feed " + index + ": "

    const { id } = await db.feed.create({
      data: {
        name: feedNamePrefix + faker.internet.userName(),
        position: index,
        loadIntervall: 15,
        url: faker.internet.url().replaceAll(/(\.\w+)$/g, ".invalid"), // prevent accidental requests to real servers
        lastLoad: faker.date.past(),
      },
    })

    for (let indexEntry = 0; indexEntry < numberOfEntriesPerFeed; indexEntry++) {
      await db.feedentry.create({
        data: {
          id: faker.string.alphanumeric(5) + indexEntry, // ensure unique id
          link: faker.internet.url(),
          summary: faker.lorem.paragraph(),
          title: feedNamePrefix + "Entry " + indexEntry + ": " + faker.lorem.words(2),
          text: faker.lorem.paragraphs(3), // eslint-disable-line no-magic-numbers
          feedId: id,
        },
      })
    }

    await db.readlistentry.create({ data: { url: faker.internet.url() } })
  }
}

export default seed
