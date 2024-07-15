import { Feedentry } from "@prisma/client"
import clsx from "clsx"
import dayjs from "dayjs"
import { useReadTime } from "use-read-time"

type Props = { item: Feedentry }

const ItemInformation = ({ item }: Props) => {
  const wpm = 180
  const { readTime } = useReadTime({ text: item.text, wpm })

  return (
    <>
      <span className={clsx("lg:mr-0", "mr-4")}>{dayjs(item.createdAt).format("DD.MM")}</span>
      <span>{readTime} min</span>
    </>
  )
}

export default ItemInformation
