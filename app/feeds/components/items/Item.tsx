import { useState } from "react"
import { setQueryData, useMutation } from "blitz"
import { Feedentry, Feedoption } from "@prisma/client"
import clsx from "clsx"
import ItemControls from "./ItemControls"
import ItemInformation from "./ItemInformation"
import readItem from "app/feeds/mutations/readItem"
import getFeeds from "app/feeds/queries/getFeeds"

type ItemProps = { item: Feedentry; settings: Feedoption }

const Item = ({ item, settings }: ItemProps) => {
  const defaultExpanded = settings.expand

  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const [hasBeenRead, setHasBeenRead] = useState(false)

  const [updateReadState] = useMutation(readItem)

  const genericReadStateChange = (isRead: boolean) => {
    return () => {
      setHasBeenRead(isRead) // Optimistic UI
      updateReadState({ id: item.id, read: isRead }).then(() =>
        setQueryData(
          getFeeds,
          undefined,
          (argument) => ({
            ...argument,
            feeds:
              argument?.feeds.map((feed) => {
                if (feed.id === item.feedId) {
                  feed.unreadCount = isRead ? feed.unreadCount - 1 : feed.unreadCount + 1
                }
                return feed
              }) || [],
          }),
          { refetch: false }
        ).catch(() => setHasBeenRead(!isRead))
      )
    }
  }

  const read = genericReadStateChange(true)
  const unread = genericReadStateChange(false)

  return (
    <div key={item.id} className="border-b-2">
      <div
        className={clsx(
          "bg-slate-100",
          "hover:bg-slate-200",
          "cursor-pointer",
          "flex",
          "font-medium",
          "px-2",
          "rounded-sm",
          "sticky",
          hasBeenRead && "text-gray-600",
          "text-lg",
          "top-0"
        )}
      >
        <span
          className={clsx("grow", "py-4", "truncate")}
          onClick={() => {
            setIsExpanded((previous) => !previous)
            if (!hasBeenRead) read()
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
            "my-auto",
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
          <ItemControls item={item} read={read} unread={unread} hasBeenRead={hasBeenRead} />
        </span>
      </div>

      {isExpanded && (
        <article
          className={clsx(
            "prose-p:font-serif",
            "font-serif",
            "max-w-prose",
            "pb-5",
            "prose",
            "px-2"
          )}
          dangerouslySetInnerHTML={{ __html: item.text }}
        />
      )}
    </div>
  )
}

export default Item
