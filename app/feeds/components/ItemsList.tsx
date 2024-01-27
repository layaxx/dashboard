"use client"
import { Fragment, useEffect, useRef } from "react"
import { ErrorComponent } from "@blitzjs/next"
import { useQuery, useInfiniteQuery } from "@blitzjs/rpc"
import Item from "./items/Item"
import getRecentlyReadEntries from "../queries/getRecentlyReadEntries"
import Button from "app/core/components/Button"
import Loader from "app/core/components/Loader"
import { useSharedState } from "app/core/hooks/store"
import getFeedoption from "app/feedoptions/queries/getFeedoption"
import getFeedentries from "app/feeds/queries/getFeedentries"
import { ALL_FEEDS_ID, RECENTLY_READ_ID } from "lib/config/feeds/feedIDs"

export const ItemsList = () => {
  const [{ activeFeedID }] = useSharedState()

  const skipOffset = useRef(0)

  const baseBatchSize = 20

  const defaultOptions = {
    createdAt: new Date(),
    expand: false,
    id: -1,
    oldestFirst: true,
    updatedAt: new Date(),
  }

  const [_, setState] = useSharedState()

  const [settings] = useQuery(
    getFeedoption,
    { id: activeFeedID! },
    { enabled: !!activeFeedID, placeholderData: defaultOptions }
  )

  const [pages, { fetchNextPage, hasNextPage, isFetchingNextPage, refetch }] = useInfiniteQuery(
    getFeedentries,
    (fetchNextPageVariable) => {
      return {
        take: fetchNextPageVariable?.take ?? baseBatchSize,
        skip: fetchNextPageVariable?.skip ? fetchNextPageVariable?.skip - skipOffset.current : 0,
        where: {
          feedId: activeFeedID === ALL_FEEDS_ID ? undefined : activeFeedID,
        },
      }
    },
    {
      refetchInterval: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      useErrorBoundary: true,
      getNextPageParam: ({ nextPage }) => nextPage,
      enabled: activeFeedID !== RECENTLY_READ_ID,
      onSuccess: () => {
        skipOffset.current = 0
      },
    }
  )

  const [recentlyReadResult] = useQuery(
    getRecentlyReadEntries,
    {},
    {
      enabled: activeFeedID === RECENTLY_READ_ID,
      useErrorBoundary: true,
    }
  )

  useEffect(() => {
    if (activeFeedID !== RECENTLY_READ_ID) {
      setState((previous) => ({ ...previous, refetchItems: refetch }))
    }
  }, [activeFeedID, refetch, setState])

  if (activeFeedID === RECENTLY_READ_ID && recentlyReadResult && recentlyReadResult.feedentries) {
    return (
      <div style={{ marginBottom: "10rem" }}>
        {recentlyReadResult.feedentries.map((item) => (
          <Item item={item} key={item.id} settings={settings || defaultOptions} />
        ))}
      </div>
    )
  }

  return pages ? (
    <>
      {pages.length > 0 &&
        pages.map((page, index) => (
          <Fragment key={index}>
            {page.feedentries.map((item) => (
              <Item
                item={item}
                key={item.id}
                settings={settings || defaultOptions}
                skipOffset={skipOffset}
              />
            ))}
          </Fragment>
        ))}

      <Button
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage || !!isFetchingNextPage}
        style={{ marginTop: "2rem", marginBottom: "10rem" }}
      >
        {isFetchingNextPage && <Loader />}
        {!isFetchingNextPage && (hasNextPage ? "Load More" : "Nothing more to load")}
      </Button>
    </>
  ) : (
    <ErrorComponent statusCode={500} title={"Error in ItemsList"} />
  )
}
