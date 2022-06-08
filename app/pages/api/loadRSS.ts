import { BlitzApiRequest, BlitzApiResponse, getSession } from "blitz"
import dayjs from "dayjs"
import { FeedItem } from "domutils"
import { parseFeed } from "htmlparser2"
import fetch from "node-fetch"
import db, { Feed } from "db"

const loadFeed = async (feed: Feed, forceReload: boolean) => {
  const minutesSinceLastLoad = dayjs().diff(dayjs(feed.lastLoad), "minutes")
  console.log("Minutes since last load", minutesSinceLastLoad)
  if (!forceReload && feed.loadIntervall > minutesSinceLastLoad) {
    console.log("Skipping", feed.name)
    return false
  }

  const content = await fetch(feed.url).then((response) => response.text())

  const fetchedFeed = parseFeed(content, { xmlMode: true })

  const results = await Promise.all(fetchedFeed?.items.map((item) => handleItem(item, feed)) ?? [])

  await db.feed.update({
    data: { lastLoad: dayjs().toISOString() },
    where: { id: feed.id },
  })

  return results.reduce(
    (previous, current) => ({
      updated: (previous.updated ?? 0) + (current.updated ?? 0),
      created: (previous.created ?? 0) + (current.created ?? 0),
      ignored: (previous.ignored ?? 0) + (current.ignored ?? 0),
    }),
    { updated: 0, created: 0, ignored: 0 }
  )
}

const handleItem = async (
  item: FeedItem,
  feed: Feed
): Promise<{ updated: number; created: number; ignored: number }> => {
  if (!item.id) {
    console.error("No ID was provided", item)
  }
  const databaseResponse = await db.feedentry.findUnique({ where: { id: item.id } })
  if (!databaseResponse) {
    await db.feedentry.create({
      data: {
        id: item.id!,
        text:
          (item.title ?? "No Title provided") +
          "\n" +
          (item.description ?? "No Description provided"),
        title: item.title ?? "No Title provided",
        link: item.link ?? idAsLinkIfSensible(item.id) ?? feed.url,
        feedId: feed.id,
        createdAt: dayjs(item.pubDate).toISOString(),
      },
    })

    return { created: 1, updated: 0, ignored: 0 }
  } else if (item.description && !(item.description === databaseResponse.text)) {
    await db.feedentry.update({
      data: { text: item.description },
      where: { id: item.id },
    })

    return { updated: 1, created: 0, ignored: 0 }
  } else {
    return { updated: 0, created: 0, ignored: 1 }
  }
}

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

  const force: boolean = Boolean(request.query["force"])

  const feeds = await db.feed.findMany()

  const results = await Promise.all(
    feeds.map(async (feed) => ({
      name: feed.name,
      id: feed.id,
      changes: await loadFeed(feed, force),
    }))
  )

  response.statusCode = 200
  response.setHeader("Content-Type", "application/json")
  response.end(JSON.stringify({ results }, undefined, 2))
}
export default handler

function idAsLinkIfSensible(id: string | undefined): string | undefined {
  try {
    new URL(id ?? "not a valid url")
    return id
  } catch {
    return undefined
  }
}
