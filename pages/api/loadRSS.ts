import { BlitzLogger } from "blitz"
import { AuthenticatedSessionContext, getSession } from "@blitzjs/auth"
import { Ctx, Routes } from "@blitzjs/next"
import dayjs from "dayjs"
import { NextApiResponse, NextApiHandler } from "next"
import { performance } from "perf_hooks"
import { api } from "app/blitz-server"
import db from "db"
import { LoadFeedStatus, Result } from "lib/feeds/types"
import { loadFeed } from "lib/serverOnly/loadRSSHelpers"

const logger = BlitzLogger({ name: "/api/loadRSS" })

export interface ResponseWithSession extends NextApiResponse<any> {
  blitzCtx?: { session: { $authorize: Function; $isAuthorized: Function } }
}

const handler: NextApiHandler = async (request, response: ResponseWithSession) => {
  let session = await getSession(request, response)

  if (!session.userId) {
    if (process.env.API_TOKEN && request.headers["api-token"] === process.env.API_TOKEN) {
      logger.info("Access to /api/loadRSS granted due to valid api token")

      session = {
        $authorize: () => {},
        $thisIsAuthorized: () => true,
        $isAuthorized: () => true,
      } as AuthenticatedSessionContext
    } else {
      logger.warn("denied Access")
      response.statusCode = 403
      response.statusMessage = "Please log in to use this API route"
      response.end()
      return
    }
  }

  const timeStampBefore = performance.now()

  const force = Boolean(request.query["force"])

  const feeds = await db.feed.findMany(force ? undefined : { where: { isActive: true } })

  const results: Result[] = await Promise.all(
    feeds.map(async (feed) => ({
      ...feed,
      ...(await loadFeed(feed, force, {
        session,
      } as Ctx)),
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

  const errors: string[] = []

  const consecutiveFailLimit = 10
  for (const result of results) {
    if (result.status === LoadFeedStatus.ERROR) {
      const willBeDeactivated =
        result.isActive && result.consecutiveFailedLoads + 1 >= consecutiveFailLimit
      if (willBeDeactivated) {
        logger.warn(`Deactivating feed ${result.name} due to too many consecutive failed loads`)
        db.feedentry.create({
          data: {
            feedId: result.id,
            id: String(new Date().getMilliseconds()),
            title: "Feed Disabled",
            text: "Feed disabled due to too many consecutive failed loads",
            summary: "Feed disabled due to too many consecutive failed loads",
            link: String(Routes.FeedsStatusPage()),
          },
        })
      }

      await db.feed.update({
        where: { id: result.id },
        data: {
          consecutiveFailedLoads: { increment: 1 },
          isActive: result.isActive && !willBeDeactivated,
        },
      })
      errors.push(
        JSON.stringify({
          errorMessage: result.errorMessage,
          statusMessage: result.statusMessage,
        })
      )
    }
  }

  results
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

  logger.info("finished RSS reload:", {
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
