import Parser from "rss-to-js"
import xss, { whiteList } from "xss"
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
