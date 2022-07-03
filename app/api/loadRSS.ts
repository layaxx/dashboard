import { BlitzApiRequest, BlitzApiResponse, getSession } from "blitz"
import dayjs from "dayjs"
import { performance } from "perf_hooks"
import db from "db"
import { loadFeed } from "lib/feeds/loadRSSHelpers"
import { Result } from "lib/feeds/types"

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

  const before = performance.now()

  const force: boolean = Boolean(request.query["force"])

  const feeds = await db.feed.findMany()

  const results: Result[] = await Promise.all(
    feeds.map(async (feed) => ({
      name: feed.name,
      id: feed.id,
      changes: await loadFeed(feed, force),
    }))
  )

  const { updated, created } = results.reduce(
    (previous, { changes }) => {
      return {
        updated: previous.updated + changes.updated,
        created: previous.created + changes.created,
      }
    },
    { updated: 0, created: 0 }
  )

  const after = performance.now()

  const errors = results
    .map((result) => (result.changes && result.changes.error) ?? false)
    .filter(Boolean) as string[]

  await db.status.create({
    data: {
      loadTime: dayjs().toISOString(),
      loadDuration: after - before,
      errors,
      updateCount: updated,
      insertCount: created,
    },
  })

  response.statusCode = 200
  response.setHeader("Content-Type", "application/json")
  response.end(JSON.stringify({ results, timeElapsed: after - before, errors }, undefined, 2))
}
export default handler
