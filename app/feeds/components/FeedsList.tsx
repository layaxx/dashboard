import { useState } from "react"
import { useQuery } from "blitz"
import { PlusIcon } from "@heroicons/react/solid"
import clsx from "clsx"
import getFeeds from "../queries/getFeeds"
import AddFeedModal from "app/core/components/Dashboard/AddFeedModal"
import { activeFeedID, setActiveFeed } from "app/core/hooks/feedSlice"
import { useAppSelector, useAppDispatch } from "app/core/hooks/redux"

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

export const FeedsList = () => {
  // eslint-disable-next-line unicorn/no-useless-undefined
  const [{ feeds }] = useQuery(getFeeds, undefined, {
    refetchInterval: 1000 * 60,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
  })

  const activeFeed = useAppSelector(activeFeedID)
  const dispatch = useAppDispatch()

  const showAllFeeds = false

  const [showAddModal, setShowAddModal] = useState(false)

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
              onClick={() => dispatch(setActiveFeed(feed.id))}
            >
              <span className="grow">{feed.title}</span>{" "}
              <span className={clsx("bg-primary", "font-bold", "px-3", "rounded-xl", "text-white")}>
                {feed.unreadCount}
              </span>
            </li>
          ))}

      <li
        className={clsx("cursor-pointer", "inline-flex", "mt-4")}
        onClick={() => setShowAddModal(true)}
      >
        <PlusIcon className="w-5" /> Add new Feed
        {showAddModal && <AddFeedModal setIsOpen={setShowAddModal} />}
      </li>
    </ul>
  )
}
