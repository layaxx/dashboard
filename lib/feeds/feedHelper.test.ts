/* eslint-disable no-magic-numbers */
import { faker } from "@faker-js/faker"
import { FeedEntry } from "feed-reader"
import {
  convertItem,
  getContentFromParsedItem,
  getLinkFromParsedItem,
  getSummaryFromParsedItem,
  idAsLinkIfSensible,
} from "./feedHelpers"
import summaryLength from "lib/config/feeds/summaryLength"

describe("feedHelper#idAsLinkIfSensible works as expected", () => {
  test("returns undefined for undefined", () => {
    expect(idAsLinkIfSensible(undefined)).toBeUndefined()
  })

  test.each(["invalidurl", "invalidurl.com", "./feed.xml"])(
    "returns undefined for invalid URLs",
    (invalidURL) => {
      expect(idAsLinkIfSensible(invalidURL)).toBeUndefined()
    },
  )

  test.each([
    "http://example.com/",
    "https://example.com/feed",
    "https://test.eu/feed.xml",
    "https://sub.test.eu/feed.xml?attr",
  ])("returns input vor valid URLs", (validURL) => {
    expect(idAsLinkIfSensible(validURL)).toBe(validURL)
  })
})

describe("feedHelper#getLinkFromParsedItem works as expected", () => {
  const link = faker.internet.url()
  const fallback = faker.internet.url()

  test("prefer item.link if available", () => {
    expect(getLinkFromParsedItem({ link }, fallback)).toBe(link)
  })

  test("use fallback otherwise", () => {
    expect(getLinkFromParsedItem({}, fallback)).toBe(fallback)
  })
})

describe("feedHelper#getContentFromParsedItem works as expected", () => {
  const itemSharedProperties = {
    categories: faker.lorem.paragraph(),
    guid: faker.internet.url(),
    creator: faker.internet.userName(),
    isoDate: new Date().toISOString(),
    link: faker.internet.url(),
    pubDate: faker.date.past().toISOString(),
    contentSnippet: faker.lorem.paragraph(),
  }

  const title = faker.lorem.words(3)
  const content = faker.lorem.paragraphs(3)

  test("prefers content if encoded content unavailable", () => {
    expect(getContentFromParsedItem({ ...itemSharedProperties, title, content })).toBe(content)
  })

  test("prefers title if no content available", () => {
    expect(getContentFromParsedItem({ ...itemSharedProperties, title })).toBe(title)
  })

  test("fallback if neither content nor title available", () => {
    expect(getContentFromParsedItem({ ...itemSharedProperties })).toBe(
      "Neither Title nor content provided",
    )
  })
})

describe("feedHelper#getSummaryFromParsedItem works as expected", () => {
  const itemSharedProperties = {
    categories: faker.lorem.paragraph(),
    guid: faker.internet.url(),
    creator: faker.internet.userName(),
    isoDate: new Date().toISOString(),
    link: faker.internet.url(),
    pubDate: faker.date.past().toISOString(),
    title: faker.lorem.words(3),
  }

  const description = faker.lorem.paragraph()
  const content = faker.lorem.paragraphs(3)

  test("prefers encoded contentSnippet if available", () => {
    expect(
      getSummaryFromParsedItem({
        ...itemSharedProperties,
        content,
        description,
      }),
    ).toBe(description)
  })

  test("takes first part of content as fallback", () => {
    expect(getSummaryFromParsedItem({ ...itemSharedProperties, content })).toBe(
      content.slice(0, summaryLength) + "...",
    )
  })
})

describe("feedHelper#convertItem works as expected", () => {
  const content = faker.lorem.paragraph(),
    description = faker.lorem.sentence(),
    link = faker.internet.url(),
    published = faker.date.past().toISOString()

  const feed = { id: 77, url: faker.internet.url() }

  test("throws if neither guid nor id nor link are provided", () => {
    expect(() => convertItem({ content, description, published } as FeedEntry, feed)).toThrowError()
  })

  test("defines all required properties", () => {
    const result = convertItem(
      { content, description, link, published, title: faker.lorem.words(2) },
      feed,
    )

    expect(result).toBeDefined()
    expect(result.id).toBeDefined()
    expect(result.text).toBeDefined()
    expect(result.title).toBeDefined()
    expect(result.link).toBeDefined()
    expect(result.summary).toBeDefined()
    expect(result.feedId).toBe(feed.id)
    expect(result.createdAt).toBeDefined()
  })
})
