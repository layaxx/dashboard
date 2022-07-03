import { BlitzApiRequest, BlitzApiResponse, getSession } from "blitz"
import db from "db"

const handler = async (request: BlitzApiRequest, response: BlitzApiResponse) => {
  const session = await getSession(request, response)

  if (
    !session.userId &&
    (!request.query.token || !(process.env["API_TOKEN"] === request.query.token))
  ) {
    console.log("denied Access")
    response.statusCode = 403
    response.statusMessage = "Please log in to use this API route"
    return response.end()
  }

  const feeds = await db.feed.findMany()
  const feedEntries = await db.feedentry.findMany({ where: { isArchived: false } })

  response.statusCode = 200
  response.setHeader("Content-Type", "application/json")
  response.end(JSON.stringify({ feeds, feedEntries }, undefined, 2))
}
export default handler
