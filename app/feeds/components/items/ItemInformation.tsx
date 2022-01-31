import dayjs from "dayjs"
import { useReadTime } from "use-read-time"
import { ItemAPIResponse } from "../ItemsList"

type Props = { item: ItemAPIResponse }

const ItemInformation = ({ item }: Props) => {
  const wpm = 180
  const { readTime } = useReadTime({ text: item.body, wpm })

  return (
    <>
      <span>{dayjs.unix(item.pubDate).format("DD.MM")}</span>
      <span>{readTime} min</span>
    </>
  )
}

export default ItemInformation
