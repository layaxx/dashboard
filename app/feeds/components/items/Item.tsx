import { useState } from "react"
import { setQueryData, useMutation } from "blitz"
import { Feedoption } from "@prisma/client"
import clsx from "clsx"
import { FeedAPIResponse } from "../FeedList"
import { ItemAPIResponse } from "../ItemsList"
import ItemControls from "./ItemControls"
import ItemInformation from "./ItemInformation"
import readItem from "app/feeds/mutations/readItem"
import getFeeds from "app/feeds/queries/getFeeds"

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
    setQueryData(
      getFeeds,
      undefined,
      (argument) => ({
        feeds:
          argument?.feeds?.map((feed: FeedAPIResponse) =>
            feed.id !== item.feedId
              ? feed
              : { ...feed, unreadCount: feed.unreadCount + (hasBeenRead ? 1 : -1) }
          ) || [],
      }),
      { refetch: false }
    )
  }

  return (
    <div key={item.id}>
      <div
        className={clsx(
          "hover:bg-neutral-200",
          isExpanded && "border-b-2",
          hasBeenRead ? "font-normal" : "font-medium",
          "cursor-pointer",
          "flex",
          "px-2",
          "rounded-sm",
          "sticky",
          "text-lg",
          "top-0"
        )}
        style={{ backgroundColor: "rgb(244, 247, 252)" }}
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
            "text-right",
            "text-sm",
            "w-16"
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
          className={clsx("prose-p:font-serif", "max-w-prose", "pb-5", "prose", "prose-lg")}
          dangerouslySetInnerHTML={{ __html: item.body }}
        />
      )}
    </div>
  )
}

export default Item
