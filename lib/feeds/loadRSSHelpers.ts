import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import Parser from "rss-to-js"
import { LoadFeedResult, LoadFeedStatus } from "./types"
import db, { Feed } from "db"
import summaryLength from "lib/config/feeds/summaryLength"

dayjs.extend(utc)

export function idAsLinkIfSensible(id: string | undefined): string | undefined {
  try {
    new URL(id ?? "not a valid url")
    return id
  } catch {
    return undefined
  }
}

type HandleItemResult = { updated: number; created: number; ignored: number }

export const handleItem = async (item: Parser.Item, feed: Feed): Promise<HandleItemResult> => {
  const id = item.guid ?? item.id ?? item.link
  if (!id) {
    console.error("No ID was provided", item)
  }
  const databaseResponse = await db.feedentry.findUnique({ where: { id } })
  if (!databaseResponse) {
    await db.feedentry.create({
      data: {
        id,
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
    console.log("Skipping due to loadIntervall", feed.name)
    return { status: LoadFeedStatus.SKIPPED, statusMessage: "Skipped due to feed.loadIntervall." }
  }

  let content, headers, statusCode, ok
  try {
    ;({ content, headers, statusCode, ok } = await fetchFromURL(feed.url, forceReload, feed))
    const HTTP_NOT_MODIFIED = 304
    if (statusCode === HTTP_NOT_MODIFIED) {
      return { status: LoadFeedStatus.SKIPPED, statusMessage: "Skipped due to Server Response." }
    }
    if (!ok) {
      throw new Error("Response was not ok")
    }
  } catch {
    console.error("Encountered an error while fetching " + feed.url)
    return { status: LoadFeedStatus.ERROR, statusMessage: "Failed to fetch from url " + feed.url }
  }

  let results: HandleItemResult[] = []
  if (!content) {
    console.warn("Received no content from " + feed.url, statusCode)
  } else {
    let parsedFeed
    try {
      parsedFeed = await new Parser().parseString(content)
    } catch {
      console.error("Encountered an error while parsing " + feed.url, headers)
      return { status: LoadFeedStatus.ERROR, statusMessage: "Failed to parse " + feed.url }
    }

    try {
      results = await Promise.all(parsedFeed?.items?.map((item) => handleItem(item, feed)) ?? [])
    } catch {
      console.error("Encountered an error while processing items for " + feed.url)
      return {
        status: LoadFeedStatus.ERROR,
        statusMessage: "Failed to process items for url " + feed.url,
      }
    }
  }

  await db.feed.update({
    data: { lastLoad: dayjs().toISOString(), etag: headers.get("etag") },
    where: { id: feed.id },
  })

  return {
    changes: results.reduce(
      (previous, current) => ({
        updated: previous.updated + current.updated,
        created: previous.created + current.created,
        ignored: previous.ignored + current.ignored,
      }),
      defaultReturnValue
    ),
    status: LoadFeedStatus.UPDATED,
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

async function fetchFromURL(
  url: string,
  force: boolean,
  feed?: Feed
): Promise<{ content: string | undefined; headers: Headers; statusCode: number; ok: boolean }> {
  const headersRequest = new Headers({
    Accept: "text/xml",
    "user-agent": "dashboard-rss-reader/1.0",
  })
  if (!force) {
    if (feed && feed.etag) {
      headersRequest.append("If-None-Match", feed.etag)
    } else if (feed) {
      headersRequest.append(
        "If-Modified-Since",
        dayjs(feed.lastLoad).utc().format("ddd, DD MM YYYY HH:mm:ss [GMT]")
      )
    }
  }

  const response = await fetch(url, {
    headers: headersRequest,
  })
  const content = await response.text()
  const { headers } = response
  const { status: statusCode, ok } = response
  return { content, headers, statusCode, ok }
}

export async function getTitleAndTTLFromFeed(
  url: string
): Promise<[string | undefined, string | undefined]> {
  let content: string | undefined, ok: boolean, headers: Headers
  try {
    ;({ content, ok, headers } = await fetchFromURL(url, true))
    if (!content || !ok) {
      throw new Error("Failed to get content from " + url)
    }
  } catch (error) {
    console.error(error)
    throw new Error("Failed to fetch feed.")
  }

  let parsedFeed
  try {
    parsedFeed = await new Parser().parseString(content)
  } catch (error) {
    console.error(error)
    throw new Error("Failed to parse feed.")
  }

  return [parsedFeed.title, parsedFeed.ttl ?? headers.get("expires") ?? undefined]
}
