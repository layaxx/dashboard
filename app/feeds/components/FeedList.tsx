import { FC } from "react"
import { useQuery } from "@blitzjs/rpc"
import { useRouter } from "next/router"
import getFeeds from "../queries/getFeeds"
import FeedListItem from "./FeedListItem"
import { LOCALSTORAGE_FEEDID, useSharedState } from "app/core/hooks/store"
import { ALL_FEEDS_ID, RECENTLY_READ_ID } from "lib/config/feeds/feedIDs"
import { FEED_MODE } from "types"

type Props = {
  mode: FEED_MODE
}

export const FeedList: FC<Props> = ({ mode }) => {
  const secondsInMinute = 60
  const milliSecondsInSecond = 1000
  const [{ feeds, recentlyReadCount }] = useQuery(getFeeds, undefined, {
    refetchInterval: milliSecondsInSecond * secondsInMinute,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
  })

  const showAllFeeds = false

  const [{ activeFeedID }, setState] = useSharedState()

  const router = useRouter()
  return (
    <>
      {feeds && (
        <>
          <FeedListItem
            title={"All Feeds"}
            unreadCount={feeds.reduce(
              (accumulator: number, current) => accumulator + current.unreadCount,
              0
            )}
            isActive={mode === FEED_MODE.RSS && activeFeedID === ALL_FEEDS_ID}
            onClick={() => {
              if (mode === FEED_MODE.BOOKMARKS) {
                router.push("/feeds/rss")
              }
              setState((previous) => ({ ...previous, activeFeedID: ALL_FEEDS_ID }))
            }}
          />

          <FeedListItem
            title={"Recently Read"}
            unreadCount={recentlyReadCount}
            isActive={mode === FEED_MODE.RSS && activeFeedID === RECENTLY_READ_ID}
            onClick={() => {
              if (mode === FEED_MODE.BOOKMARKS) {
                router.push("/feeds/rss")
              }
              setState((previous) => ({ ...previous, activeFeedID: RECENTLY_READ_ID }))
            }}
          />

          {feeds
            .filter((feed) => feed.unreadCount || feed.id === activeFeedID || showAllFeeds)
            .map(({ id, unreadCount, name }) => {
              const isActive = mode === FEED_MODE.RSS && activeFeedID === id
              return (
                <FeedListItem
                  title={name}
                  unreadCount={unreadCount}
                  onClick={() => {
                    if (mode === FEED_MODE.BOOKMARKS) {
                      router.push("/feeds/rss")
                    }
                    if (isActive) {
                      // TODO: console.log("should invalidate")
                    }
                    localStorage.setItem(LOCALSTORAGE_FEEDID, JSON.stringify(id))
                    setState((previous) => ({ ...previous, activeFeedID: id }))
                  }}
                  key={id}
                  isActive={isActive}
                />
              )
            })}
        </>
      )}
    </>
  )
}
