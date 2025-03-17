/* eslint-disable max-lines */
import { Ctx } from "@blitzjs/next"
import dayjs from "dayjs"
import { getTitleAndTTLFromFeed, loadFeed } from "./loadRSSHelpers"
import {
  bitsAboutMoney,
  bitsAboutMoneyItem,
  dataColada,
  dataColadaItem,
  davidGerard,
  davidGerardItem,
  fefesBlog,
  fefesBlogItem,
  heiseAtom,
  heiseAtomItem,
  heiseRDF,
  heiseRDFItem,
  mediumBlog,
  mediumItem,
  netzpolitikOrg,
  netzpolitikOrgItem,
  signalBlog,
  signalItem,
  substack,
  substackItem,
  web3IsGoingGreat,
  web3IsGoingGreatItem,
} from "./rss.integration.data"
import { cleanXSS } from "lib/feeds/feedHelpers"
import { prismaMock } from "test/globalSetup"

const mockCreateManyFeedEntries = jest.fn()

jest.mock("app/feeds/mutations/createManyFeedEntries", () => ({
  __esModule: true,
  default: (...props: unknown[]) => mockCreateManyFeedEntries(...props),
}))

const mockUpdateFeedentry = jest.fn()

jest.mock("app/feeds/mutations/updateFeedentry", () => ({
  __esModule: true,
  default: (...props: unknown[]) => mockUpdateFeedentry(...props),
}))

const mockInvokeWithCtx = jest.fn()

jest.mock("@blitzjs/rpc", () => ({
  __esModule: true,
  invokeWithCtx: (...props: unknown[]) => mockInvokeWithCtx(...props),
}))

const mockFetch = jest.fn()

const makeMock = (returnString: string, expires?: string) => {
  mockFetch.mockImplementation(async () => {
    const status = 200
    const ok = true
    // eslint-disable-next-line unicorn/consistent-function-scoping
    const text = async () => returnString

    const responseHeaders = new Map()
    if (expires) {
      responseHeaders.set("expires", expires)
    }
    return {
      headers: responseHeaders,
      status,
      ok,
      text,
    }
  })
}

jest.mock("node-fetch", () => ({
  __esModule: true,
  default: (...props: unknown[]) => mockFetch(...props),
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

test.skip.each([])("getIDSFromFeeds works as expected", () => {})

describe("getTitleAndTTLFromFeed works as expected", () => {
  const data = [
    ["netzpolitik.org", netzpolitikOrg, {}],
    ["Signal Blog", signalBlog, {}],
    ["Forecasting", substack, {}],
    ["Stories by Lilith Wittmann on Medium", mediumBlog, {}],
    ["Fefes Blog", fefesBlog, {}],
    ["heise online Top-News", heiseAtom, {}],
    ["heise security News", heiseRDF, {}],
    ["Web3 is Going Just Great", web3IsGoingGreat, {}],
    ["Attack of the 50 Foot Blockchain", davidGerard, {}],
    ["Bits about Money", bitsAboutMoney, { ttl: 60 }],
    ["Data Colada", dataColada, {}],
  ] as const

  beforeEach(() => {
    mockFetch.mockReset()
  })

  test.each(data)("title is correct (%s)", async (title, xmlString) => {
    makeMock(xmlString)

    const [actualTitle, _ttl] = await getTitleAndTTLFromFeed("https://not-necessary.invalid")

    expect(actualTitle).toEqual(title)
  })

  test.each(data)("ttl matches feed if exists (%s)", async (_title, xmlString, expected) => {
    makeMock(xmlString)

    const [_title_, actualTTL] = await getTitleAndTTLFromFeed("https://not-necessary.invalid")

    expect(actualTTL).toEqual("ttl" in expected ? expected.ttl : undefined)
  })

  test.each(data)(
    "ttl matches expires header if exists and no explicit ttl given",
    async (_title, xmlString, expected) => {
      makeMock(xmlString, dayjs().add(35, "minutes").toISOString())

      const [_title_, actualTTL] = await getTitleAndTTLFromFeed("https://not-necessary.invalid")

      if ("ttl" in expected) {
        expect(actualTTL).toEqual(expected.ttl)
      } else {
        expect(actualTTL).toBeGreaterThan(30)
        expect(actualTTL).toBeLessThan(40)
      }
    }
  )
})

describe("loadFeed works as expected", () => {
  const data = [
    ["netzpolitik.org", netzpolitikOrg, netzpolitikOrgItem],
    ["Signal Blog", signalBlog, signalItem],
    ["Forecasting", substack, substackItem],
    ["Stories by Lilith Wittmann on Medium", mediumBlog, mediumItem],
    ["Fefes Blog", fefesBlog, fefesBlogItem],
    ["heise online Top-News", heiseAtom, heiseAtomItem],
    ["heise security News", heiseRDF, heiseRDFItem],
    ["Web3 is Going Just Great", web3IsGoingGreat, web3IsGoingGreatItem],
    ["Attack of the 50 Foot Blockchain", davidGerard, davidGerardItem],
    ["Bits about Money", bitsAboutMoney, bitsAboutMoneyItem],
    ["Data Colada", dataColada, dataColadaItem],
  ] as const

  const input = [
    {
      url: "https://not-necessary.invalid",
      name: "testfeed",
      id: 171_717,
      consecutiveFailedLoads: 0,
      etag: "irrelevant",
      isActive: true,
      lastLoad: new Date(),
      createdAt: new Date(),
      position: 1,
      loadIntervall: 1,
      updatedAt: new Date(),
    },
    true,
    {} as Ctx,
  ] as const

  beforeEach(() => {
    mockFetch.mockReset()
    mockInvokeWithCtx.mockReset()
    mockCreateManyFeedEntries.mockReset()
    mockUpdateFeedentry.mockReset()

    prismaMock.feedentry.findMany.mockResolvedValue([])
    mockInvokeWithCtx.mockResolvedValue([{}])
  })

  test.each(data)("title is correct (%s)", async (_feedTitle, xmlString, expected) => {
    makeMock(xmlString)

    await loadFeed(...input)

    expect(mockInvokeWithCtx.mock.lastCall[1].data[0].title).toEqual(expected.title)
  })

  test.each(data)("link is correct (%s)", async (_feedTitle, xmlString, expected) => {
    makeMock(xmlString)

    await loadFeed(...input)

    expect(mockInvokeWithCtx.mock.lastCall[1].data[0].link).toEqual(expected.link)
  })

  test.each(data)("id is correct (%s)", async (_feedTitle, xmlString, expected) => {
    makeMock(xmlString)

    await loadFeed(...input)

    expect(mockInvokeWithCtx.mock.lastCall[1].data[0].id).toEqual(expected.id)
  })

  test.each(data)("summary is correct (%s)", async (_feedTitle, xmlString, expected) => {
    makeMock(xmlString)

    await loadFeed(...input)

    expect(mockInvokeWithCtx.mock.lastCall[1].data[0].summary).toEqual(expected.summary)
  })

  test.each(data)("text is correct (%s)", async (_feedTitle, xmlString, expected) => {
    makeMock(xmlString)

    await loadFeed(...input)

    const actual = cleanXSS(mockInvokeWithCtx.mock.lastCall[1].data[0].text)

    expect(actual).toEqual(expected.text)
  })
})
