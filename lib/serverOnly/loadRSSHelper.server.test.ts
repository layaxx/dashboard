/* eslint-disable max-lines */
import { Ctx } from "@blitzjs/next"
import { faker } from "@faker-js/faker"
import dayjs from "dayjs"
import { fetchFromURL, getTitleAndTTLFromFeed, loadFeed } from "./loadRSSHelpers"
import { Feed } from "db"
import { LoadFeedStatus } from "lib/feeds/types"

const mockFetch = jest.fn()

jest.mock("node-fetch", () => ({
  __esModule: true,
  default: (...props: any) => mockFetch(...props),
  Headers: class Headers {
    headers = new Map()

    append(key: string, value: string) {
      this.headers.set(key, value)
    }

    constructor(map: Record<string, string>) {
      Object.keys(map).forEach((key) => this.append(key, map[key] as string))
    }
  },
}))

beforeEach(() => {
  mockFetch.mockReset()
  mockFetch.mockImplementation(async () => {
    const status = 200
    const ok = true
    // eslint-disable-next-line unicorn/consistent-function-scoping
    const text = async () => "text"

    const responseHeaders = new Map()
    responseHeaders.set("expires", faker.date.future().toISOString())
    return {
      headers: responseHeaders,
      status,
      ok,
      text,
    }
  })
})

describe("loadRSSHelpers#fetchFromURL works as expected", () => {
  test("use node-fetch", async () => {
    const url = "https://example.com"
    const response = await fetchFromURL(url, false)

    expect(response.ok).toBeTruthy()
    expect(response.content).toBeDefined()

    expect(mockFetch).toHaveBeenCalled()
    const [[urlReceived, arguments_]] = mockFetch.mock.calls

    expect(urlReceived).toBe(url)
    expect(arguments_.headers).toBeDefined()
    expect(arguments_.headers.headers.get("user-agent")).toBeDefined()
    expect(arguments_.headers.headers.get("If-None-Match")).toBeUndefined()
  })

  test("use etag header if possible", async () => {
    const url = "https://exampleDomain.com"
    const etag = "SomeRandomValue=="

    const response = await fetchFromURL(url, false, { etag } as Feed)

    expect(response.ok).toBeTruthy()
    expect(response.content).toBeDefined()

    expect(mockFetch).toHaveBeenCalled()
    const [[urlReceived, arguments_]] = mockFetch.mock.calls

    expect(urlReceived).toBe(url)
    expect(arguments_.headers).toBeDefined()
    expect(arguments_.headers.headers.get("If-None-Match")).toBe(etag)
  })

  test("use lastLoad header if no etag available", async () => {
    const url = "https://exampleDomain.com/feed.xml"

    const response = await fetchFromURL(url, false, {
      etag: undefined,
      lastLoad: "2022-07-13T18:17:18.304Z",
    } as unknown as Feed)

    expect(response.ok).toBeTruthy()
    expect(response.content).toBeDefined()

    expect(mockFetch).toHaveBeenCalled()
    const [[urlReceived, arguments_]] = mockFetch.mock.calls

    expect(urlReceived).toBe(url)
    expect(arguments_.headers).toBeDefined()
    expect(arguments_.headers.headers.get("If-None-Match")).toBeUndefined()
    expect(arguments_.headers.headers.get("If-Modified-Since")).toBe("Wed, 13 07 2022 18:17:18 GMT")
  })

  test("use no cache headers for force refresh", async () => {
    const url = "https://sub.exampleDomain.com/feed.xml"

    const response = await fetchFromURL(url, true, {
      etag: "ValidEtagIGuess=",
      lastLoad: "2022-07-13T18:17:18.304Z",
    } as unknown as Feed)

    expect(response.ok).toBeTruthy()
    expect(response.content).toBeDefined()

    expect(mockFetch).toHaveBeenCalled()
    const [[urlReceived, arguments_]] = mockFetch.mock.calls

    expect(urlReceived).toBe(url)
    expect(arguments_.headers).toBeDefined()
    expect(arguments_.headers.headers.get("If-None-Match")).toBeUndefined()
    expect(arguments_.headers.headers.get("If-Modified-Since")).toBeUndefined()
  })
})

const mockParser = jest.fn()

jest.mock("feed-reader", () => ({
  __esModule: true,
  parseString(input: string) {
    return mockParser(input)
  },
  setReaderOptions: jest.fn(),
  setParserOptions: jest.fn(),
}))

describe("loadRSSHelpers#getTitleAndTTLFromFeed works as expected", () => {
  test("works for both values present", async () => {
    mockParser.mockReturnValue({ title: "title", ttl: "40" })

    const [receivedTitle, receivedTTL] = await getTitleAndTTLFromFeed("url")

    // eslint-disable-next-line no-magic-numbers
    expect(receivedTTL).toBe(40)
    expect(receivedTitle).toBe("title")
  })

  test("works for expires header", async () => {
    mockParser.mockReturnValue({ title: "title" })

    const [receivedTitle, receivedTTL] = await getTitleAndTTLFromFeed("url")

    expect(receivedTTL).toBeGreaterThanOrEqual(0)
    expect(receivedTitle).toBe("title")
  })

  test("works for no title", async () => {
    mockParser.mockReturnValue({})

    const [receivedTitle, receivedTTL] = await getTitleAndTTLFromFeed("url")

    expect(receivedTTL).toBeGreaterThanOrEqual(0)
    expect(receivedTitle).toBeUndefined()
  })
})

describe("loadRRSHelpers#loadFeed works as expected", () => {
  test("throws error for missing ctx", () => {
    return expect(loadFeed({} as Feed, false, undefined as unknown as Ctx)).rejects.toEqual(
      new Error("Missing ctx info"),
    )
  })

  test("returns status error for failed request", () => {
    mockFetch.mockImplementation(async () => {
      const status = 666
      const ok = false
      // eslint-disable-next-line unicorn/consistent-function-scoping
      const text = async () => "text"

      const responseHeaders = new Map()
      responseHeaders.set("expires", faker.date.future().toISOString())
      return {
        headers: responseHeaders,
        status,
        ok,
        text,
      }
    })

    return expect(
      loadFeed({} as Feed, false, {
        session: { $authorize: () => true, $isAuthorized: () => true },
      } as unknown as Ctx),
    ).resolves.toMatchObject({ status: LoadFeedStatus.ERROR })
  })

  test("returns skipped status for 304 responses", () => {
    mockFetch.mockImplementation(async () => {
      const status = 304
      const ok = true
      // eslint-disable-next-line unicorn/consistent-function-scoping
      const text = async () => "text"

      const responseHeaders = new Map()
      responseHeaders.set("expires", faker.date.future().toISOString())
      return {
        headers: responseHeaders,
        status,
        ok,
        text,
      }
    })

    return expect(
      loadFeed({} as Feed, false, {
        session: { $authorize: () => true, $isAuthorized: () => true },
      } as unknown as Ctx),
    ).resolves.toMatchObject({ status: LoadFeedStatus.SKIPPED })
  })

  test("returns skipped status for recently updated feeds", () => {
    return expect(
      loadFeed(
        { lastLoad: dayjs().subtract(1, "minute").toDate(), loadIntervall: 1000 } as Feed,
        false,
        {
          session: { $authorize: () => true, $isAuthorized: () => true },
        } as unknown as Ctx,
      ),
    ).resolves.toMatchObject({ status: LoadFeedStatus.SKIPPED })
  })

  test("returns status error for failed parsing", () => {
    // eslint-disable-next-line unicorn/no-null
    mockParser.mockImplementation(() => null)

    return expect(
      loadFeed({} as Feed, false, {
        session: { $authorize: () => true, $isAuthorized: () => true },
      } as unknown as Ctx),
    ).resolves.toMatchObject({ status: LoadFeedStatus.ERROR })
  })

  test("returns status error for items without id", () => {
    mockParser.mockImplementation(() => ({
      entries: [
        {
          content: faker.lorem.paragraph(),
          title: faker.lorem.word(),
        },
      ],
    }))

    return expect(
      loadFeed({} as Feed, false, {
        session: { $authorize: () => true, $isAuthorized: () => true },
      } as unknown as Ctx),
    ).resolves.toMatchObject({ status: LoadFeedStatus.ERROR })
  })
})
