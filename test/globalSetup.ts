import dotenv from "dotenv"
import database from "../db"

module.exports = async () => {
  dotenv.config()

  await database.$reset()

  await database.user.create({
    data: { email: "testing@localhost.localdomain", name: "Testing", role: "ADMIN" },
  })

  await database.feed.create({
    data: { name: "saf", url: "asdfasd", position: 3, lastLoad: new Date() },
  })
}
