import { BlitzApiRequest, BlitzApiResponse } from "blitz"
import dayjs from "dayjs"
import { FeedItem } from "domutils"
import { parseFeed } from "htmlparser2"
import fetch from "node-fetch"
import db, { Feed } from "db"

const loadFeed = async (feed: Feed) => {
  console.log("Minutes since last load", dayjs().diff(dayjs(feed.lastLoad), "minutes"))

  const content = await fetch(feed.url).then((response) => response.text())

  const fetchedFeed = parseFeed(content, { xmlMode: true })

  const results = await Promise.all(fetchedFeed?.items.map((item) => handleItem(item, feed)) ?? [])

  await db.feed.update({
    data: { lastLoad: dayjs().toISOString() },
    where: { id: feed.id },
  })

  console.log({ lastLoad: dayjs().format("YYYY-MM-DD"), id: feed.id })

  return results.reduce(
    (previous, current) => ({
      updated: (previous.updated ?? 0) + (current.updated ?? 0),
      created: (previous.created ?? 0) + (current.created ?? 0),
    }),
    { updated: 0, created: 0 }
  )
}

const handleItem = async (
  item: FeedItem,
  feed: Feed
): Promise<{ updated: number; created: number }> => {
  if (!item.id) {
    console.error("No ID was provided", item)
  }
  const databaseResponse = await db.feedentry.findUnique({ where: { id: item.id } })
  if (!databaseResponse) {
    await db.feedentry.create({
      data: {
        id: item.id!,
        text: item.description ?? "No Description provided",
        title: item.title ?? "No Title provided",
        link: item.link ?? idAsLinkIfSensible(item.id) ?? feed.url,
        feedId: feed.id,
      },
    })

    return { created: 1, updated: 0 }
  } else if (!(item.description === databaseResponse.text)) {
    await db.feedentry.update({
      data: { text: item.description },
      where: { id: item.id },
    })

    return { updated: 1, created: 0 }
  } else {
    return { updated: 0, created: 0 }
  }
}

const handler = async (request: BlitzApiRequest, response: BlitzApiResponse) => {
  //await loadFeed()

  if (request.headers.host !== "localhost:3000") {
    // FIXME: This is obviously very rudimentary
    response.statusCode = 403
    return response.end()
  }

  const feeds = await db.feed.findMany()

  const results = await Promise.all(
    feeds.map(async (feed) => ({ name: feed.name, changes: await loadFeed(feed) }))
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
