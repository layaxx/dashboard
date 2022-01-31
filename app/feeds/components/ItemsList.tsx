import { useRef, useState } from "react"
import { useQuery } from "blitz"
import getItems from "../queries/getItems"
import getUpdatedItems from "../queries/getUpdatedItems"
import Item from "./items/Item"

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

type Props = { feedState: number | null }

export const ItemsList = ({ feedState }: Props) => {
  const isFirstLoad = useRef(true)

  const [result] = useQuery(
    getItems,
    { id: feedState || -1 },
    {
      enabled: isFirstLoad.current,
      onSuccess: ({ items }) => {
        isFirstLoad.current = false
        console.log("INITIAL QUERY RAN, RESULTING in ", items.length, "NEW ITEMS.")
      },
    }
  )

  const [itemState, setItemState] = useState<ItemAPIResponse[]>(result?.items ?? [])

  useQuery(
    getUpdatedItems,
    {
      id: feedState || -1,
      lastModified: 1 + Math.max(...itemState.map((item) => item.lastModified)),
    },
    {
      enabled: !isFirstLoad.current,
      onSuccess: ({ items }) => {
        items = items.filter(
          (item: ItemAPIResponse) =>
            item.unread && itemState.map(({ id }) => id).indexOf(item.id) === -1
        )

        setItemState((prev) => [...prev, ...items])
        console.log("UPDATE QUERY RAN, RESULTING in ", items.length, "NEW ITEMS.")
      },
      refetchInterval: 1000 * 60,
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
    }
  )

  return (
    <div>
      {itemState.map((item: ItemAPIResponse) => (
        <Item item={item} key={item.id} />
      ))}
    </div>
  )
}
