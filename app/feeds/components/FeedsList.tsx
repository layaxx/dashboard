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

type Props = { feedState: [number | null, Dispatch<SetStateAction<number | null>>] }

export const FeedsList = ({ feedState }: Props) => {
  const [{ feeds }] = useQuery(getFeeds, {})

  const [activeFeed, setActiveFeed] = feedState

  const showAllFeeds = false

  return (
    <ul>
      {feeds
        .filter((feed: FeedAPIResponse) => feed.unreadCount || showAllFeeds)
        .map((feed: FeedAPIResponse) => (
          <li
            key={feed.id}
            className={clsx(
              activeFeed === feed.id && "border-l-4 pl-2 border-primary",
              "flex py-1 hover:bg-slate-200"
            )}
            onClick={() => setActiveFeed(feed.id)}
          >
            <span className="grow">{feed.title}</span>{" "}
            <span className="rounded-xl px-3 bg-primary font-bold text-white">
              {feed.unreadCount}
            </span>
          </li>
        ))}
    </ul>
  )
}
