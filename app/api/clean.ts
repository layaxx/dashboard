import { BlitzApiRequest, BlitzApiResponse, getSession } from "blitz"
import dayjs from "dayjs"
import db from "db"

const handler = async (request: BlitzApiRequest, response: BlitzApiResponse) => {
  const session = await getSession(request, response)

  if (!session.userId) {
    if (process.env.API_TOKEN && request.headers["api-token"] === process.env.API_TOKEN) {
      console.log("Access to /api/clean granted due to valid api token")
    } else {
      console.log("denied Access")
      response.statusCode = 403
      response.statusMessage = "Please log in to use this API route"
      return response.end()
    }
  }

  // Delete all but 25 most recent status entries
  const statusToBeDeleted = await db.status.findMany({ orderBy: { createdAt: "desc" }, skip: 25 })
  const { count: countStatusDeleted } = await db.status.deleteMany({
    where: { id: { in: statusToBeDeleted.map((status) => status.id) } },
  })

  // delete all archived feedentries that have not been modified in the last 30 days
  const deleteEntriesOlderThanXDays = 30
  const timeThreshold = dayjs().subtract(deleteEntriesOlderThanXDays, "days").toISOString()
  const entriesToBeDeleted = await db.feedentry.findMany({
    where: { isArchived: true, updatedAt: { lt: timeThreshold } },
  })
  const { count: countEntriesDeleted } = await db.feedentry.deleteMany({
    where: { id: { in: entriesToBeDeleted.map((entry) => entry.id) } },
  })

  // TODO: This may lead to entries being reimported after deletion if they still are present in the RSS feed

  response.statusCode = 200
  response.setHeader("Content-Type", "application/json")
  response.end(JSON.stringify({ countEntriesDeleted, countStatusDeleted }, undefined, 2))
}
export default handler
