import { AuthenticatedSessionContext, getSession } from "@blitzjs/auth"
import { AuthenticatedMiddlewareCtx } from "@blitzjs/rpc"
import dayjs from "dayjs"
import { NextApiResponse, NextApiHandler } from "next"
import { performance } from "perf_hooks"
import { api } from "app/blitz-server"
import db from "db"
import { LoadFeedStatus, Result } from "lib/feeds/types"
import { loadFeed } from "lib/serverOnly/loadRSSHelpers"

export interface ResponseWithSession extends NextApiResponse<any> {
  blitzCtx?: { session: { $authorize: Function; $isAuthorized: Function } }
}

const handler: NextApiHandler = async (request, response: ResponseWithSession) => {
  let session = await getSession(request, response)

  if (!session.userId) {
    if (process.env.API_TOKEN && request.headers["api-token"] === process.env.API_TOKEN) {
      console.log("Access to /api/clean granted due to valid api token")

      session = {
        $authorize: () => {},
        $thisIsAuthorized: () => true,
        $isAuthorized: () => true,
      } as AuthenticatedSessionContext
    } else {
      console.log("denied Access")
      response.statusCode = 403
      response.statusMessage = "Please log in to use this API route"
      response.end()
      return
    }
  }

  const timeStampBefore = performance.now()

  const force = Boolean(request.query["force"])

  const feeds = await db.feed.findMany()

  const results: Result[] = await Promise.all(
    feeds.map(async (feed) => ({
      name: feed.name,
      id: feed.id,
      ...(await loadFeed(feed, force, {
        session,
      } as AuthenticatedMiddlewareCtx)),
    }))
  )

  const { updated, created } = results
    .filter((result) => result.changes)
    .reduce(
      ({ updated, created }, current) => {
        return {
          updated: updated + (current.changes?.updated ?? 0),
          created: created + (current.changes?.created ?? 0),
        }
      },
      { updated: 0, created: 0 }
    )

  const timeStampAfter = performance.now()

  const errors = results
    .map(
      (result) =>
        (result.status === LoadFeedStatus.ERROR &&
          JSON.stringify({
            errorMessage: result.errorMessage,
            statusMessage: result.statusMessage,
          })) ??
        false
    )
    .filter(Boolean) as string[]

  await db.statusLoad.create({
    data: {
      loadTime: dayjs().toISOString(),
      loadDuration: timeStampAfter - timeStampBefore,
      errors,
      updateCount: updated,
      insertCount: created,
    },
  })

  console.log("finished RSS reload:", {
    timeElapsed: timeStampAfter - timeStampBefore,
    errors,
    results,
  })

  response.statusCode = 200
  response.setHeader("Content-Type", "application/json")
  response.json({ results, timeElapsed: timeStampAfter - timeStampBefore, errors })
  response.end()
}
export default api(handler)
