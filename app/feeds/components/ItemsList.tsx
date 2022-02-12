import { useQuery } from "blitz"
import getItems from "../queries/getItems"
import Item from "./items/Item"
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

type Props = { feedState: number | undefined }

export const ItemsList = ({ feedState }: Props) => {
  const defaultOptions = {
    createdAt: new Date(),
    expand: false,
    id: -1,
    oldestFirst: true,
    updatedAt: new Date(),
  }

  const [settings] = useQuery(
    getFeedoption,
    { id: feedState! },
    { enabled: !!feedState, placeholderData: defaultOptions }
  )

  const [{ items }] = useQuery(
    getItems,
    {
      id: feedState || -1,
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
