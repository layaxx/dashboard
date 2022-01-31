import { useState } from "react"
import { useMutation } from "blitz"
import clsx from "clsx"
import { ItemAPIResponse } from "../ItemsList"
import ItemControls from "./ItemControls"
import ItemInformation from "./ItemInformation"
import readItem from "app/feeds/mutations/readItem"

type ItemProps = { item: ItemAPIResponse }

const Item = ({ item }: ItemProps) => {
  const defaultExpanded = false

  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const [hasBeenRead, setHasBeenRead] = useState(false)

  const [updateReadState] = useMutation(readItem)

  const toggleUnreadStatus = () => {
    setHasBeenRead((prev) => !prev) // Optimistic UI
    updateReadState({ read: !hasBeenRead, id: item.id }).catch(() =>
      setHasBeenRead((prev) => !prev)
    )
  }

  return (
    <div key={item.id}>
      <div
        className={clsx(
          "px-2",
          "font-medium",
          "text-lg",
          "hover:bg-neutral-200",
          "rounded-sm",
          "flex",
          "cursor-pointer",
          hasBeenRead && "font-normal"
        )}
      >
        <span
          className="truncate grow py-4"
          onClick={() => {
            setIsExpanded((prev) => !prev)
            if (!hasBeenRead) toggleUnreadStatus()
          }}
          title={item.title}
        >
          {item.title}
        </span>
        <span className="text-gray-400 font-normal text-sm shrink-0 border-l-2 pt-2 px-2 flex flex-col">
          <ItemInformation item={item} />
        </span>
        <span className="flex text-gray-400 shrink-0 border-l-2 py-4">
          <ItemControls item={item} toggle={toggleUnreadStatus} hasBeenRead={hasBeenRead} />
        </span>
      </div>

      {isExpanded && <div dangerouslySetInnerHTML={{ __html: item.body }}></div>}
    </div>
  )
}

export default Item
