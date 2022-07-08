import { Fragment } from "react"
import { useQuery, useInfiniteQuery, ErrorComponent } from "blitz"
import getFeedentries from "../queries/getFeedentries"
import getRecentlyReadFeedentries from "../queries/getRecentlyReadFeedentries"
import Item from "./items/Item"
import Button from "app/core/components/Button"
import Loader from "app/core/components/Loader"
import { useSharedState } from "app/core/hooks/store"
import getFeedoption from "app/feedoptions/queries/getFeedoption"
import { ALL_FEEDS_ID, RECENTLY_READ_ID } from "lib/config/feeds/feedIDs"

export const ItemsList = () => {
  const [{ activeFeedID }] = useSharedState()

  const baseBatchSize = 20

  const defaultOptions = {
    createdAt: new Date(),
    expand: false,
    id: -1,
    oldestFirst: true,
    updatedAt: new Date(),
  }

  const [settings] = useQuery(
    getFeedoption,
    { id: activeFeedID! },
    { enabled: !!activeFeedID, placeholderData: defaultOptions }
  )

  const [pages, { fetchNextPage, hasNextPage, isFetchingNextPage }] = useInfiniteQuery(
    getFeedentries,
    (fetchNextPageVariable) => {
      return (
        fetchNextPageVariable ?? {
          take: baseBatchSize,
          skip: 0,
          where: { feedId: activeFeedID === ALL_FEEDS_ID ? undefined : activeFeedID },
        }
      )
    },
    {
      refetchInterval: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      useErrorBoundary: true,
      notifyOnChangeProps: "tracked",
      getNextPageParam: ({ nextPage }) => nextPage,
      enabled: activeFeedID !== RECENTLY_READ_ID,
    }
  )

  const [recentlyReadResult] = useQuery(
    getRecentlyReadFeedentries,
    {},
    { enabled: activeFeedID === RECENTLY_READ_ID }
  )

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
              <Item item={item} key={item.id} settings={settings || defaultOptions} />
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
