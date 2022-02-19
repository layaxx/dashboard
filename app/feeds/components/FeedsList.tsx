import { useState } from "react"
import { Link, Routes, useQuery } from "blitz"
import { PlusIcon } from "@heroicons/react/solid"
import clsx from "clsx"
import { useRouter } from "next/dist/client/router"
import getFeeds from "../queries/getFeeds"
import countReadlistentries from "../readlistentries/queries/countReadlistentries"
import FeedListItem from "./FeedListItem"
import AddFeedModal from "app/core/components/Dashboard/AddFeedModal"
import { FEED_MODE, getActiveFeedID, setActiveFeed } from "app/core/hooks/feedSlice"
import { useAppDispatch, useAppSelector } from "app/core/hooks/redux"

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

type Props = {
  mode: FEED_MODE
}

export const FeedsList = ({ mode }: Props) => {
  const [{ feeds }] = useQuery(getFeeds, undefined, {
    refetchInterval: 1000 * 60,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
  })

  const [readListCount] = useQuery(countReadlistentries, {})

  const showAllFeeds = false

  const [showAddModal, setShowAddModal] = useState(false)

  const dispatch = useAppDispatch()
  const activeID = useAppSelector(getActiveFeedID)

  const router = useRouter()
  return (
    <ul>
      {feeds &&
        feeds
          .filter((feed: FeedAPIResponse) => feed.unreadCount || showAllFeeds)
          .map(({ id, title, unreadCount }: FeedAPIResponse) => (
            <FeedListItem
              title={title}
              unreadCount={unreadCount}
              onClick={() => {
                mode === FEED_MODE.BOOKMARKS && router.push("/feeds/rss")
                dispatch(setActiveFeed(id))
              }}
              key={id}
              isActive={mode === FEED_MODE.RSS && activeID === id}
            />
          ))}
      <Link href={Routes.FeedsReadingPage()}>
        <a>
          <FeedListItem
            title={"Reading List"}
            unreadCount={readListCount}
            isActive={mode === FEED_MODE.BOOKMARKS}
            onClick={() => {}}
          />
        </a>
      </Link>
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
