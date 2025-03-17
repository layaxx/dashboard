import { BlitzLogger } from "blitz"
import { getSession } from "@blitzjs/auth"
import dayjs from "dayjs"
import { NextApiRequest, NextApiResponse } from "next"
import { performance } from "perf_hooks"
import { api } from "app/blitz-server"
import db from "db"
import { getIDSFromFeeds } from "lib/serverOnly/loadRSSHelpers"

const maximumEntriesToBeDeleted = 30_000

const logger = BlitzLogger({ name: "/api/clean" })

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
  const session = await getSession(request, response)

  if (!session.userId) {
    if (process.env.API_TOKEN && request.headers["api-token"] === process.env.API_TOKEN) {
      logger.info("Access to /api/clean granted due to valid api token")
    } else {
      logger.warn("Access to /api/clean denied")
      response.statusCode = 403
      response.statusMessage = "Please log in to use this API route"
      response.end()
      return
    }
  }

  const timeStampBefore = performance.now()

  // Delete all but 25 most recent statusLoad entries
  const statusLoadToBeDeleted = await db.statusLoad.findMany({
    orderBy: { createdAt: "desc" },
    skip: 25,
  })
  statusLoadToBeDeleted.length = Math.min(statusLoadToBeDeleted.length, maximumEntriesToBeDeleted)
  const { count: countStatusLoadDeleted } = await db.statusLoad.deleteMany({
    where: { id: { in: statusLoadToBeDeleted.map((status) => status.id) } },
  })

  // Delete all but 25 most recent statusClean entries
  const statusCleanToBeDeleted = await db.statusClean.findMany({
    orderBy: { createdAt: "desc" },
    skip: 25,
  })
  statusCleanToBeDeleted.length = Math.min(statusCleanToBeDeleted.length, maximumEntriesToBeDeleted)
  const { count: countStatusCleanDeleted } = await db.statusClean.deleteMany({
    where: { id: { in: statusCleanToBeDeleted.map((status) => status.id) } },
  })

  // delete all archived feedentries that have not been modified in the last 30 days
  const deleteEntriesOlderThanXDays = 30
  const timeThreshold = dayjs().subtract(deleteEntriesOlderThanXDays, "days").toISOString()

  const entriesToBeDeleted = await db.feedentry.findMany({
    where: { isArchived: true, updatedAt: { lt: timeThreshold } },
    include: { feed: { select: { url: true } } },
  })

  const urlsToBeChecked = new Set(entriesToBeDeleted.map(({ feed }) => feed.url))

  // eslint-disable-next-line unicorn/prefer-spread
  const stillOnlineIDs = await getIDSFromFeeds(Array.from(urlsToBeChecked))

  const entryIDsToBeDeleted = entriesToBeDeleted
    .filter(
      (entry) =>
        !stillOnlineIDs.get(entry.feed.url) || !stillOnlineIDs.get(entry.feed.url)!.has(entry.id)
    )
    .map((entry) => entry.id)
  entryIDsToBeDeleted.length = Math.min(entryIDsToBeDeleted.length, maximumEntriesToBeDeleted)

  const { count: countEntriesDeleted } = await db.feedentry.deleteMany({
    where: {
      id: {
        in: entryIDsToBeDeleted,
      },
    },
  })

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
export default api(handler)
