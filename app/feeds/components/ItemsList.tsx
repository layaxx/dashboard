import { useQuery } from "blitz"
import getItems from "../queries/getItems"
import Item from "./items/Item"
import { useAppSelector } from "app/core/hooks/redux"
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
  const activeFeedID = useAppSelector((state) => state.feed.value)

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

  const [{ items }] = useQuery(
    getItems,
    {
      id: activeFeedID || -1,
    },
    {
      refetchInterval: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  )

  return (
    <div>
      {items.map((item: ItemAPIResponse) => (
        <Item item={item} key={item.id} settings={settings || defaultOptions} />
      ))}
    </div>
  )
}
