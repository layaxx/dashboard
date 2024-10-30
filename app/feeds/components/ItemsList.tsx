"use client"
import { useRef } from "react"
import { ErrorComponent } from "@blitzjs/next"
import { useQuery, useInfiniteQuery } from "@blitzjs/rpc"
import clsx from "clsx"
import Item from "./items/Item"
import getRecentlyReadEntries from "../queries/getRecentlyReadEntries"
import Button from "app/core/components/Button"
import Loader from "app/core/components/Loader"
import notify from "app/core/hooks/notify"
import { useSharedState } from "app/core/hooks/store"
import { defaultOptions } from "app/feedoptions"
import getFeedoption from "app/feedoptions/queries/getFeedoption"
import getFeedentries from "app/feeds/queries/getFeedentries"
import { FeedEntryOrdering } from "db"
import { ALL_FEEDS_ID, RECENTLY_READ_ID } from "lib/config/feeds/feedIDs"

export const ItemsList = () => {
  const [{ activeFeedID }] = useSharedState()
  const skipOffset = useRef(0)

  const baseBatchSize = 20

  const [settings] = useQuery(
    getFeedoption,
    { id: activeFeedID! },
    {
      enabled: !!activeFeedID && ![ALL_FEEDS_ID, RECENTLY_READ_ID].includes(activeFeedID),
      placeholderData: defaultOptions,
    },
  )

  const orderBy: { createdAt: "asc" | "desc" } = {
    createdAt: settings?.ordering === FeedEntryOrdering.OLDEST_FIRST ? "asc" : "desc",
  }

  const [pages, { fetchNextPage, hasNextPage, isFetchingNextPage }] = useInfiniteQuery(
    getFeedentries,
    (fetchNextPageVariable) => ({
      take: fetchNextPageVariable?.take ?? baseBatchSize,
      orderBy,
      skip: fetchNextPageVariable?.skip ? fetchNextPageVariable?.skip - skipOffset.current : 0,
      where: {
        feedId: activeFeedID === ALL_FEEDS_ID ? undefined : activeFeedID,
      },
    }),
    {
      refetchInterval: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      enabled: activeFeedID !== RECENTLY_READ_ID,
      getNextPageParam: ({ nextPage }) => nextPage,
      onSuccess() {
        skipOffset.current = 0
      },
      onError(error) {
        console.error(error)
        notify("Error fetching items", { status: "error" })
      },
    },
  )

  const [recentlyReadResult] = useQuery(
    getRecentlyReadEntries,
    {},
    {
      refetchInterval: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      enabled: activeFeedID === RECENTLY_READ_ID,
      onError(error) {
        console.error(error)
        notify("Error fetching items", { status: "error" })
      },
    },
  )

  if (activeFeedID === RECENTLY_READ_ID && recentlyReadResult?.feedentries) {
    return (
      <div className="mb-40">
        {recentlyReadResult.feedentries.map((item) => (
          <Item item={item} key={item.id} settings={settings || defaultOptions} />
        ))}
      </div>
    )
  }

  return pages ? (
    <div>
      {pages.length > 0 &&
        pages.flatMap(({ feedentries }) =>
          feedentries.map((item) => (
            <Item
              item={item}
              key={item.id}
              settings={settings || defaultOptions}
              skipOffset={skipOffset}
            />
          )),
        )}

      <Button
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage || isFetchingNextPage}
        className={clsx("mb-40", "md:ml-10", "ml-2", "mt-8")}
      >
        {isFetchingNextPage && <Loader />}
        {!isFetchingNextPage && (hasNextPage ? "Load More" : "Nothing more to load")}
      </Button>
    </div>
  ) : (
    <ErrorComponent statusCode={500} title={"Error in ItemsList"} />
  )
}
