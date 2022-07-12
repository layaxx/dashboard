import { SecurePassword } from "blitz"
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
  const numberOfEntriesPerFeed = 10

  for (let index = 0; index < numberOfFeeds; index++) {
    const { id } = await db.feed.create({
      data: {
        name: faker.internet.userName(),
        position: index,
        loadIntervall: 15,
        url: faker.internet.url(),
        lastLoad: faker.date.past(),
      },
    })

    for (let indexEntry = 0; indexEntry < numberOfEntriesPerFeed; indexEntry++) {
      await db.feedentry.create({
        data: {
          id: faker.unique(faker.datatype.string),
          link: faker.internet.url(),
          summary: faker.lorem.paragraph(),
          title: faker.lorem.sentence(),
          text: faker.lorem.paragraphs(3),
          feedId: id,
        },
      })
    }

    await db.readlistentry.create({ data: { url: faker.internet.url() } })
  }
}

export default seed
