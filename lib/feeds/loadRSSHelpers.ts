import dayjs from "dayjs"
import Parser from "rss-to-js"
import { LoadFeedResult } from "./types"
import db, { Feed } from "db"
import summaryLength from "lib/config/feeds/summaryLength"

export function idAsLinkIfSensible(id: string | undefined): string | undefined {
  try {
    new URL(id ?? "not a valid url")
    return id
  } catch {
    return undefined
  }
}

export const handleItem = async (
  item: Parser.Item,
  feed: Feed
): Promise<{ updated: number; created: number; ignored: number }> => {
  if (!item.guid) {
    console.error("No ID was provided", item)
  }
  const databaseResponse = await db.feedentry.findUnique({ where: { id: item.guid } })
  if (!databaseResponse) {
    await db.feedentry.create({
      data: {
        id: item.guid!,
        text: getContentFromParsedItem(item),
        title: item.title ?? "No Title provided",
        link: getLinkFromParsedItem(item, feed.url),
        summary: getSummaryFromParsedItem(item),
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

export const loadFeed = async (feed: Feed, forceReload: boolean): Promise<LoadFeedResult> => {
  const defaultReturnValue = { updated: 0, created: 0, ignored: 0, error: undefined }

  const minutesSinceLastLoad = dayjs().diff(dayjs(feed.lastLoad), "minutes")
  console.log("Minutes since last load", minutesSinceLastLoad)
  if (!forceReload && feed.loadIntervall > minutesSinceLastLoad) {
    console.log("Skipping", feed.name)
    return defaultReturnValue
  }

  let content
  try {
    content = await fetch(feed.url).then((response) => response.text())
  } catch {
    console.error("Encountered an error while fetching " + feed.url)
    return { ...defaultReturnValue, error: "Failed to fetch from url " + feed.url }
  }

  const rssParser = new Parser()
  const parsedFeed = await rssParser.parseString(content)

  let results
  try {
    results = await Promise.all(parsedFeed?.items?.map((item) => handleItem(item, feed)) ?? [])
  } catch {
    console.error("Encountered an error while processing items for " + feed.url)
    return { ...defaultReturnValue, error: "Failed to process items for url " + feed.url }
  }

  await db.feed.update({
    data: { lastLoad: dayjs().toISOString() },
    where: { id: feed.id },
  })

  return {
    ...results.reduce(
      (previous, current) => ({
        updated: previous.updated + current.updated,
        created: previous.created + current.created,
        ignored: previous.ignored + current.ignored,
      }),
      defaultReturnValue
    ),
    error: undefined,
  }
}

function getContentFromParsedItem(item: Parser.Item): string {
  if (item["content:encoded"]) {
    return item["content:encoded"]
  }
  if (item.content) {
    return item.content
  }
  if (item.title) {
    return item.title
  }
  return "Neither Title nor content provided"
}

function getLinkFromParsedItem(item: Parser.Item, fallback: string): string {
  if (item.link) {
    return item.link
  } else if (item.guid && idAsLinkIfSensible(item.guid)) {
    return item.guid
  }
  return fallback
}

function getSummaryFromParsedItem(item: Parser.Item): string {
  if (item.contentSnippet) {
    return item.contentSnippet
  }

  return getContentFromParsedItem(item).slice(0, summaryLength) + "..." // TODO: content could be html
}
