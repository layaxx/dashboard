import { useState } from "react"
import { useMutation } from "blitz"
import { Feedoption } from "@prisma/client"
import clsx from "clsx"
import { ItemAPIResponse } from "../ItemsList"
import ItemControls from "./ItemControls"
import ItemInformation from "./ItemInformation"
import readItem from "app/feeds/mutations/readItem"

type ItemProps = { item: ItemAPIResponse; settings: Feedoption }

const Item = ({ item, settings }: ItemProps) => {
  const defaultExpanded = settings.expand

  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const [hasBeenRead, setHasBeenRead] = useState(false)

  const [updateReadState] = useMutation(readItem)

  const toggleUnreadStatus = () => {
    setHasBeenRead((previous) => !previous) // Optimistic UI
    updateReadState({ id: item.id, read: !hasBeenRead }).catch(() =>
      setHasBeenRead((previous) => !previous)
    )
  }

  return (
    <div key={item.id}>
      <div
        className={clsx(
          "hover:bg-neutral-200",
          "cursor-pointer",
          "flex",
          hasBeenRead ? "font-normal" : "font-medium",
          "px-2",
          "rounded-sm",
          "text-lg"
        )}
      >
        <span
          className={clsx("grow", "py-4", "truncate")}
          onClick={() => {
            setIsExpanded((previous) => !previous)
            if (!hasBeenRead) toggleUnreadStatus()
          }}
          title={item.title}
        >
          {item.title}
        </span>
        <span
          className={clsx(
            "border-l-2",
            "flex",
            "flex-col",
            "font-normal",
            "pt-2",
            "px-2",
            "shrink-0",
            "text-gray-400",
            "text-sm"
          )}
        >
          <ItemInformation item={item} />
        </span>
        <span className={clsx("border-l-2", "flex", "py-4", "shrink-0", "text-gray-400")}>
          <ItemControls item={item} toggle={toggleUnreadStatus} hasBeenRead={hasBeenRead} />
        </span>
      </div>

      {isExpanded && (
        <article
          className={clsx("max-w-none", "pb-5", "prose")}
          dangerouslySetInnerHTML={{ __html: item.body }}
        />
      )}
    </div>
  )
}

export default Item
