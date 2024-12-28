import { BlitzLogger } from "blitz"
import { getSession } from "@blitzjs/auth"
import { FeedData, parseString, setParserOptions, setReaderOptions } from "feed-reader"
import { NextApiResponse, NextApiHandler } from "next"
import { api } from "app/blitz-server"
import { Feedentry } from "db"
import summaryLength from "lib/config/feeds/summaryLength"
import { cleanXSS, convertItem } from "lib/feeds/feedHelpers"
import { fetchFromURL } from "lib/serverOnly/loadRSSHelpers"

const logger = BlitzLogger({ name: "/api/loadRSS" })

type ResponseType = { items: Feedentry[] }

export interface ResponseWithSession<T> extends NextApiResponse<T> {
  blitzCtx?: { session: { $authorize: () => void; $isAuthorized: () => boolean } }
}

const handler: NextApiHandler = async (request, response: ResponseWithSession<ResponseType>) => {
  const session = await getSession(request, response)

  if (!session.userId) {
    logger.warn("denied Access")
    response.statusCode = 403
    response.statusMessage = "Please log in to use this API route"
    response.end()
    return
  }

  const url = String(request.query["url"])

  try {
    new URL(url)
  } catch {
    logger.error("Not a valid URL: " + url)
    response.statusCode = 400
    response.statusMessage = "Please provide a valid URL"
    response.end()
    return
  }

  const { content, ok } = await fetchFromURL(url, true)

  if (!ok || !content) {
    const message = (ok ? "Received no content from " : "Received non-OK status from ") + url
    logger.error(message)
    response.statusCode = 500
    response.statusMessage = message
    response.end()
    return
  }

  setReaderOptions({ includeFullContent: true, descriptionMaxLen: summaryLength })
  setParserOptions({ trimValues: false })

  let parsedFeed: FeedData | null
  try {
    parsedFeed = parseString(content)
    if (!parsedFeed) {
      throw new Error("Failed to parse feed")
    }
  } catch {
    const message = "Encountered an error while parsing " + url
    logger.error(message)
    response.statusCode = 500
    response.statusMessage = message
    response.end()
    return
  }

  let items: Feedentry[] = []
  try {
    items = (parsedFeed.entries?.map((item) => convertItem(item, { url, id: -1 })) ?? []).map(
      ({ id, link, summary, text, title, feedId }) => ({
        id,
        link,
        summary: cleanXSS(summary),
        text: cleanXSS(text),
        title: cleanXSS(title),
        feedId,
        isArchived: false,
        updatedAt: new Date(),
        createdAt: new Date(),
        preXSSHash: "",
      }),
    )
  } catch {
    const message = "Failed to process items for url " + url

    logger.error(message)
    response.statusCode = 500
    response.statusMessage = message
    response.end()
    return
  }

  response.statusCode = 200
  response.setHeader("Content-Type", "application/json")
  response.json({ items })
  response.end()
}
export default api(handler)
