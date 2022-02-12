import { Dispatch, SetStateAction } from "react"
import { useQuery } from "blitz"
import clsx from "clsx"
import getFeeds from "../queries/getFeeds"

export type FeedAPIResponse = {
  id: number
  url: string
  title: string
  faviconLink: string
  added: number
  folderId: number
  unreadCount: number
  ordering: number
  link: string
  pinned: boolean
  updateErrorCount: number
  lastUpdateError: string
}

type Props = { feedState: [number | undefined, Dispatch<SetStateAction<number | undefined>>] }

export const FeedsList = ({ feedState }: Props) => {
  // eslint-disable-next-line unicorn/no-useless-undefined
  const [{ feeds }] = useQuery(getFeeds, undefined, {
    refetchInterval: 1000 * 60,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
  })

  const [activeFeed, setActiveFeed] = feedState

  const showAllFeeds = false

  return (
    <ul>
      {feeds &&
        feeds
          .filter((feed: FeedAPIResponse) => feed.unreadCount || showAllFeeds)
          .map((feed: FeedAPIResponse) => (
            <li
              key={feed.id}
              className={clsx(
                "hover:bg-slate-200",
                "cursor-pointer",
                "flex",
                "py-1",
                activeFeed === feed.id && ["pl-2", "border-l-4", "border-primary"]
              )}
              onClick={() => setActiveFeed(feed.id)}
            >
              <span className="grow">{feed.title}</span>{" "}
              <span className={clsx("bg-primary", "font-bold", "px-3", "rounded-xl", "text-white")}>
                {feed.unreadCount}
              </span>
            </li>
          ))}
    </ul>
  )
}
