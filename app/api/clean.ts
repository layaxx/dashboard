import { BlitzApiRequest, BlitzApiResponse, getSession } from "blitz"
import dayjs from "dayjs"
import { performance } from "perf_hooks"
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

  const timeStampBefore = performance.now()

  // Delete all but 25 most recent statusLoad entries
  const statusLoadToBeDeleted = await db.statusLoad.findMany({
    orderBy: { createdAt: "desc" },
    skip: 25,
  })
  const { count: countStatusLoadDeleted } = await db.statusLoad.deleteMany({
    where: { id: { in: statusLoadToBeDeleted.map((status) => status.id) } },
  })

  // Delete all but 25 most recent statusClean entries
  const statusCleanToBeDeleted = await db.statusClean.findMany({
    orderBy: { createdAt: "desc" },
    skip: 25,
  })
  const { count: countStatusCleanDeleted } = await db.statusClean.deleteMany({
    where: { id: { in: statusCleanToBeDeleted.map((status) => status.id) } },
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

  const timeStampAfter = performance.now()

  const duration = timeStampAfter - timeStampBefore

  await db.statusClean.create({
    data: {
      time: dayjs().toISOString(),
      duration,
    },
  })

  response.statusCode = 200
  response.setHeader("Content-Type", "application/json")
  response.end(
    JSON.stringify(
      {
        countEntriesDeleted,
        countStatusLoadDeleted,
        countStatusCleanDeleted,
        duration,
      },
      undefined,
      2
    )
  )
}
export default handler
