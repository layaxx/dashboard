import dayjs from "dayjs"
import type { FeedEntry } from "feed-reader"
import xss, { IFilterXSSOptions, whiteList } from "xss"
import summaryLength from "lib/config/feeds/summaryLength"

export const MINIMUM_LOAD_INTERVAL_MINUTES = 5

export function idAsLinkIfSensible(id: string | undefined): string | undefined {
  try {
    new URL(id ?? "not a valid url")
    return id
  } catch {
    return undefined
  }
}

export function getContentFromParsedItem(item: Partial<FeedEntry>): string {
  if (item.content) {
    return item.content
  }
  if (item.description) {
    return item.description
  }
  if (item.title) {
    return item.title
  }
  return "Neither Title nor content provided"
}

export function getLinkFromParsedItem(item: Partial<FeedEntry>, fallback: string): string {
  if (item.link) {
    return item.link
  }
  return fallback
}

export function getSummaryFromParsedItem(item: Partial<FeedEntry>): string {
  if (item.description) {
    return item.description
  }

  return getContentFromParsedItem(item).slice(0, summaryLength) + "..." // TODO: content could be html
}

const XSSOptions: IFilterXSSOptions = {
  whiteList: {
    a: ["href", "title", "target"],
    picture: [],
    source: ["type", "srcset", "sizes"],
    ...whiteList,
  },
}

export function cleanXSS(string: string) {
  return xss(string, XSSOptions)
}

export const convertItem = (item: FeedEntry, feed: { id: number; url: string }) => {
  const id = item.guid || item.id || item.link

  if (!id) {
    console.error("No ID was provided", item)
    throw new Error("Cannot convert Item without ID")
  }
  const text = getContentFromParsedItem(item)
  const link = getLinkFromParsedItem(item, feed.url)
  const summary = getSummaryFromParsedItem(item)
  const createdAt = dayjs(item.published || undefined).toISOString()
  return {
    id,
    text,
    title: item.title ?? "No Title provided",
    link,
    summary,
    feedId: feed.id,
    createdAt,
  }
}
