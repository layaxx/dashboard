import { useState } from "react"
import { setQueryData, useMutation } from "@blitzjs/rpc"
import { Feedentry, Feedoption, ImageHandling } from "@prisma/client"
import clsx from "clsx"
import parse, { HTMLReactParserOptions, Element } from "html-react-parser"
import ItemControls from "./ItemControls"
import ItemInformation from "./ItemInformation"
import { feedListOmit } from "../FeedList"
import readItem from "app/feeds/mutations/readItem"
import getFeeds from "app/feeds/queries/getFeeds"

type ItemProps = {
  item: Feedentry
  settings: Pick<Feedoption, "expand" | "imageHandling">
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
          feedListOmit,
          (argument) => {
            return {
              ...argument,
              feeds:
                argument?.feeds.map((feed) => {
                  if (feed.id === item.feedId) {
                    feed.unreadCount = isRead ? feed.unreadCount - 1 : feed.unreadCount + 1
                  }
                  return feed
                }) ?? [],
            }
          },
          { refetch: false },
        ).catch(() => setHasBeenRead(!isRead)),
      )
    }
  }

  const read = genericReadStateChange(true)
  const unread = genericReadStateChange(false)

  const options: HTMLReactParserOptions = {
    replace: (domNode) => {
      if (
        settings.imageHandling !== ImageHandling.NONE &&
        domNode instanceof Element &&
        domNode.name === "img"
      ) {
        if (settings.imageHandling === ImageHandling.SUPPRESS) {
          return <></>
        } else if (settings.imageHandling === ImageHandling.LIMIT_HEIGHT_10) {
          domNode.attribs.className = "h-40 my-0"
          return domNode
        }
      }
      if (domNode instanceof Element && domNode.attribs.href && domNode.name === "a") {
        domNode.attribs = { target: "_blank", rel: "noopener", href: domNode.attribs.href }
        if (domNode.attribs.href?.startsWith("/") && !domNode.attribs.href?.startsWith("//")) {
          let basePath = ""
          try {
            basePath = new URL(item.link).origin
          } catch {
            console.error("Failed to get base path")
          }
          console.warn(`Prepending base path "${basePath}" to "${domNode.attribs.href}"`)
          domNode.attribs.href = basePath + domNode.attribs.href
        }
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
    <div key={item.id} className={clsx("border-b-2", "dark:border-slate-600")}>
      <div
        className={clsx(
          "bg-slate-100",
          "hover:bg-slate-200",
          "dark:hover:bg-slate-700",
          "dark:bg-slate-800",
          "cursor-pointer",
          "flex",
          "font-medium",
          "lg:px-10",
          "px-2",
          "rounded-sm",
          "sticky",
          hasBeenRead && ["text-gray-600", "dark:text-gray-400"],
          "text-lg",
          "top-0",
        )}
      >
        <div
          className={clsx("flex", "flex-col-reverse", "lg:flex-row", "overflow-hidden", "w-full")}
          onClick={() => {
            setIsExpanded((previous) => !previous)
            if (!hasBeenRead) read()
          }}
        >
          <div className={clsx("grow", "pb-2", "pr-2", "lg:py-4", "truncate")} title={item.title}>
            {item.title}
          </div>
          <div
            className={clsx(
              "lg:border-l-2",
              "dark:lg:border-slate-600",
              "flex",
              "lg:flex-col",
              "font-normal",
              "my-auto",
              "lg:pt-0",
              "pt-1",
              "lg:px-2",
              "shrink-0",
              "text-gray-400",
              "text-right",
              "text-sm",
              "lg:w-16",
            )}
          >
            <ItemInformation item={item} />
          </div>
        </div>
        <div
          className={clsx(
            "border-l-2",
            "dark:border-slate-600",
            "flex",
            "py-4",
            "shrink-0",
            "text-gray-400",
          )}
        >
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
            "dark:prose-invert",
            "prose-slate",
            "lg:px-10",
            "px-2",
          )}
        >
          {content}
        </article>
      )}
    </div>
  )
}

export default Item
