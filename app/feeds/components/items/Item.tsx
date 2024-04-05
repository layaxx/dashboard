import { useState } from "react"
import { setQueryData, useMutation } from "@blitzjs/rpc"
import { Feedentry, Feedoption } from "@prisma/client"
import clsx from "clsx"
import parse, { HTMLReactParserOptions, Element } from "html-react-parser"
import ItemControls from "./ItemControls"
import ItemInformation from "./ItemInformation"
import readItem from "app/feeds/mutations/readItem"
import getFeeds from "app/feeds/queries/getFeeds"

type ItemProps = {
  item: Feedentry
  settings: Feedoption
  skipOffset?: React.MutableRefObject<number>
}

const Item = ({ item, settings, skipOffset }: ItemProps) => {
  const defaultExpanded = settings.expand

  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const [hasBeenRead, setHasBeenRead] = useState(item.isArchived)

  const [updateReadState] = useMutation(readItem)

  const genericReadStateChange = (isRead: boolean) => {
    return () => {
      if (skipOffset) skipOffset.current += isRead ? 1 : -1
      setHasBeenRead(isRead) // Optimistic UI
      updateReadState({ id: item.id, read: isRead }).then(() =>
        setQueryData(
          getFeeds,
          {},
          (argument) => ({
            ...argument,
            recentlyReadCount: argument?.recentlyReadCount ?? 0,
            feeds:
              argument?.feeds.map((feed) => {
                if (feed.id === item.feedId) {
                  feed.unreadCount = isRead ? feed.unreadCount - 1 : feed.unreadCount + 1
                }
                return feed
              }) ?? [],
          }),
          { refetch: false }
        ).catch(() => setHasBeenRead(!isRead))
      )
    }
  }

  const read = genericReadStateChange(true)
  const unread = genericReadStateChange(false)

  const options: HTMLReactParserOptions = {
    replace: (domNode) => {
      if (domNode instanceof Element && domNode.attribs.href && domNode.name === "a") {
        domNode.attribs = { target: "_blank", rel: "noopener", href: domNode.attribs.href }
        return domNode
      }
    },
  }

  let content: string | JSX.Element | JSX.Element[]
  try {
    content = parse(item.text, options)
  } catch {
    content = <p>Failed to parse Text</p>
  }

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
        <div className={clsx("flex", "flex-col-reverse", "md:flex-row", "w-full")}>
          <div
            className={clsx("grow", "pb-2", "md:py-4", "truncate")}
            onClick={() => {
              setIsExpanded((previous) => !previous)
              if (!hasBeenRead) read()
            }}
            title={item.title}
          >
            {item.title}
          </div>
          <div
            className={clsx(
              "md:border-l-2",
              "flex",
              "md:flex-col",
              "font-normal",
              "my-auto",
              "md:pt-0",
              "pt-1",
              "md:px-2",
              "shrink-0",
              "text-gray-400",
              "text-right",
              "text-sm",
              "md:w-16"
            )}
          >
            <ItemInformation item={item} />
          </div>
        </div>
        <div className={clsx("border-l-2", "flex", "py-4", "shrink-0", "text-gray-400")}>
          <ItemControls item={item} read={read} unread={unread} hasBeenRead={hasBeenRead} />
        </div>
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
        >
          {content}
        </article>
      )}
    </div>
  )
}

export default Item
