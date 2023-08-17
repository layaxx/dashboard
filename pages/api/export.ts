import { BlitzLogger } from "blitz"
import { getSession } from "@blitzjs/auth"
import { NextApiRequest, NextApiResponse } from "next"
import { api } from "app/blitz-server"
import db from "db"

const logger = BlitzLogger({ name: "/api/export" })

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
  const session = await getSession(request, response)

  if (
    !session.userId &&
    (!request.query.token || !(process.env["API_TOKEN"] === request.query.token))
  ) {
    logger.warn("denied Access")
    response.statusCode = 403
    response.statusMessage = "Please log in to use this API route"
    response.end()
    return
  }

  const feeds = await db.feed.findMany()
  const feedEntries = await db.feedentry.findMany({ where: { isArchived: false } })

  response.statusCode = 200
  response.setHeader("Content-Type", "application/json")
  response.end(JSON.stringify({ feeds, feedEntries }, undefined, 2))
}
export default api(handler)
