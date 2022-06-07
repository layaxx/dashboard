import { Fragment } from "react"
import { useQuery, useInfiniteQuery } from "blitz"
import Item from "./items/Item"
import Button from "app/core/components/Button"
import Loader from "app/core/components/Loader"
import { useSharedState } from "app/core/hooks/store"
import getFeedentries from "app/feedentries/queries/getFeedentries"
import getFeedoption from "app/feedoptions/queries/getFeedoption"

export type ItemAPIResponse = {
  id: number
  guid: string
  guidHash: string
  url: string
  title: string
  author: string
  pubDate: number
  body: string
  feedId: number
  unread: boolean
  starred: boolean
  rtl: boolean
  lastModified: number
  fingerprint: string
}

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
          where: { feedId: activeFeedID === -1 ? undefined : activeFeedID },
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
    }
  )

  return (
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
  )
}
