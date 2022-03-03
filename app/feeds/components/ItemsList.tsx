import { useQuery, useInfiniteQuery } from "blitz"
import getItems from "../queries/getItems"
import Item from "./items/Item"
import Button from "app/core/components/Button"
import { useSharedState } from "app/core/hooks/store"
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

  const [response, { fetchNextPage }] = useInfiniteQuery(
    getItems,
    (parameter) => {
      return {
        id: activeFeedID || -1,
        oldestFirst: defaultOptions.oldestFirst,
        batchSize: parameter || baseBatchSize,
      }
    },
    {
      refetchInterval: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      useErrorBoundary: true,
      notifyOnChangeProps: "tracked",
      getPreviousPageParam: ({ items }) => Math.min(items.length - baseBatchSize, 0) ?? false,
      getNextPageParam: ({ items }) => items.length + baseBatchSize ?? false,
    }
  )

  return (
    <>
      {response.length > 0 &&
        response[response.length - 1]?.items.map((item: ItemAPIResponse) => (
          <Item item={item} key={item.id} settings={settings || defaultOptions} />
        ))}

      <Button onClick={() => fetchNextPage()} style={{ marginTop: "2rem", marginBottom: "10rem" }}>
        Load more
      </Button>
    </>
  )
}
