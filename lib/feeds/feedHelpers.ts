import dayjs from "dayjs"
import { FeedEntry } from "feed-reader"
import xss, { whiteList } from "xss"
import { Feed, Prisma } from "db"
import summaryLength from "lib/config/feeds/summaryLength"

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

const XSSOptions = {
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

export const convertItem = (item: FeedEntry, feed: Feed): Prisma.FeedentryUncheckedCreateInput => {
  const id = item.guid || item.id || item.link
  console.log("id", id)
  if (!id) {
    console.error("No ID was provided", item)
    throw new Error("Cannot convert Item without ID")
  }
  return {
    id,
    text: getContentFromParsedItem(item),
    title: item.title ?? "No Title provided",
    link: getLinkFromParsedItem(item, feed.url),
    summary: getSummaryFromParsedItem(item),
    feedId: feed.id,
    createdAt: dayjs(item.published).toISOString(),
  }
}
