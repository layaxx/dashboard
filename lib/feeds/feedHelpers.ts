import dayjs from "dayjs"
import Parser from "rss-to-js"
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

export function getContentFromParsedItem(item: Parser.Item): string {
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

export function getLinkFromParsedItem(item: Parser.Item, fallback: string): string {
  if (item.link) {
    return item.link
  } else if (item.guid && idAsLinkIfSensible(item.guid)) {
    return item.guid
  }
  return fallback
}

export function getSummaryFromParsedItem(item: Parser.Item): string {
  if (item.contentSnippet) {
    return item.contentSnippet
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

export const convertItem = (
  item: Parser.Item,
  feed: Feed
): Prisma.FeedentryUncheckedCreateInput => {
  const id = item.guid ?? item.id ?? item.link
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
    createdAt: dayjs(item.pubDate).toISOString(),
  }
}
