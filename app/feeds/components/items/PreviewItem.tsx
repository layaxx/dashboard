import { ReactElement, useState } from "react"
import { XMarkIcon } from "@heroicons/react/24/outline"
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid"
import clsx from "clsx"
import parse, { HTMLReactParserOptions, Element } from "html-react-parser"
import ItemInformation from "./ItemInformation"
import type { Feedentry, Feedoption } from "db"

type ItemProps = { item: Feedentry; settings: Pick<Feedoption, "expand">; removeEntry: () => void }

const PreviewItem = ({ item, settings, removeEntry }: ItemProps) => {
  const defaultExpanded = settings.expand

  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const [hasBeenRead, setHasBeenRead] = useState(false)

  const read = () => setHasBeenRead(true)

  const options: HTMLReactParserOptions = {
    replace: (domNode) => {
      if (domNode instanceof Element && domNode.attribs.href && domNode.name === "a") {
        domNode.attribs = { target: "_blank", rel: "noopener", href: domNode.attribs.href }
        return domNode
      }
    },
  }

  let content: string | ReactElement | ReactElement[]
  try {
    content = parse(item.text, options)
  } catch {
    content = <p>Failed to parse Text</p>
  }

  const sharedClassName = "hover:text-primary px-1 w-8"

  return (
    <div key={item.id} className={clsx("border-b-2", "dark:border-slate-600")}>
      <div
        className={clsx(
          "hover:bg-slate-100",
          "dark:bg-slate-700",
          "dark:hover:bg-slate-800",
          "bg-white",
          "cursor-pointer",
          "flex",
          "font-medium",
          "px-2",
          "rounded-sm",
          "sticky",
          hasBeenRead && ["text-gray-500", "dark:text-gray-500"],
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
            "dark:border-slate-600",
            "flex",
            "flex-col",
            "font-normal",
            "my-auto",
            "px-2",
            "shrink-0",
            "dark:text-gray-300",
            "text-gray-400",
            "text-right",
            "text-sm",
            "w-16"
          )}
        >
          <ItemInformation item={item} />
        </span>
        <span
          className={clsx(
            "border-l-2",
            "dark:border-slate-600",
            "flex",
            "py-4",
            "shrink-0",
            "dark:text-gray-300",
            "text-gray-400"
          )}
        >
          <span className={sharedClassName} onClick={() => removeEntry()}>
            <XMarkIcon />
          </span>
          <a
            href={item.link}
            title={item.title}
            referrerPolicy="no-referrer"
            rel="noopener noreferrer"
            target="_blank"
            className={sharedClassName}
            onClick={() => read()}
          >
            <ArrowTopRightOnSquareIcon />
          </a>
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
            "px-2",
            "dark:text-slate-300"
          )}
        >
          {content}
        </article>
      )}
    </div>
  )
}

export default PreviewItem
