import { BlitzLogger } from "blitz"
import { AuthenticatedSessionContext, getSession } from "@blitzjs/auth"
import { Ctx, Routes } from "@blitzjs/next"
import dayjs from "dayjs"
import { NextApiResponse, NextApiHandler } from "next"
import { performance } from "perf_hooks"
import { api } from "app/blitz-server"
import db, { FeedLoadEvent } from "db"
import { LoadFeedStatus, Result } from "lib/feeds/types"
import { HTTP_FORBIDDEN, HTTP_OK } from "lib/serverOnly/consts"
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
      logger.warn("denied Access to /api/loadRSS")
      response.status(HTTP_FORBIDDEN).send("Please log in to use this API route")
      return
    }
  }

  const timeStampBeforeLoad = performance.now()

  const force = Boolean(request.query["force"])
  const feeds = await db.feed.findMany(force ? undefined : { where: { isActive: true } })

  const results: Result[] = await Promise.all(
    feeds.map(async (feed) => ({
      feed,
      result: await loadFeed(feed, force, {
        session,
      } as Ctx),
    })),
  )

  const timeStampAfterLoad = performance.now()

  const events: Pick<FeedLoadEvent, "feedId" | "errors" | "createdIds" | "updatedIds">[] = []
  const consecutiveFailLimit = 10
  let updateCount = 0
  let insertCount = 0
  for (const { result, feed } of results.filter(
    ({ result }) => result.status !== LoadFeedStatus.SKIPPED,
  )) {
    events.push({
      feedId: feed.id,
      createdIds: result.changes?.createdIds ?? [],
      updatedIds: result.changes?.updatedIds ?? [],
      errors:
        result.status === LoadFeedStatus.ERROR
          ? [
              JSON.stringify({
                statusMessage: result.statusMessage,
                errorMessage: result.errorMessage,
              }),
            ]
          : [],
    })

    updateCount += result.changes?.updatedIds.length ?? 0
    insertCount += result.changes?.createdIds.length ?? 0

    if (result.status === LoadFeedStatus.ERROR) {
      const willBeDeactivated =
        feed.isActive && feed.consecutiveFailedLoads + 1 >= consecutiveFailLimit

      if (willBeDeactivated) {
        logger.warn(`Deactivating feed ${feed.name} due to too many consecutive failed loads`)
        await db.feedentry.create({
          data: {
            feedId: feed.id,
            id: `disable-${feed.id}-${new Date().getMilliseconds()}`,
            title: "Feed Disabled",
            text: "Feed disabled due to too many consecutive failed loads",
            summary: "Feed disabled due to too many consecutive failed loads",
            link: Routes.FeedsStatusPage().pathname,
          },
        })
      }

      await db.feed.update({
        where: { id: feed.id },
        data: {
          consecutiveFailedLoads: { increment: 1 },
          isActive: feed.isActive && !willBeDeactivated,
        },
      })
    }
  }

  await db.feedLoadEvent.createMany({
    data: events,
  })

  const errors = events
    .filter((event) => event.errors.length > 0 && event.errors[0])
    .map((error) => String(error.errors[0]))
  await db.statusLoad.create({
    data: {
      loadTime: dayjs().toISOString(),
      loadDuration: timeStampAfterLoad - timeStampBeforeLoad,
      errors,
      updateCount,
      insertCount,
    },
  })

  logger.info("finished RSS reload:", {
    timeElapsed: timeStampAfterLoad - timeStampBeforeLoad,
    errors,
    results,
  })

  response
    .status(HTTP_OK)
    .json({ results, timeElapsed: timeStampAfterLoad - timeStampBeforeLoad, errors })
}
export default api(handler)
