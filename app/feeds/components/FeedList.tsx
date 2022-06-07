import { FC } from "react"
import { useQuery } from "blitz"
import { useRouter } from "next/dist/client/router"
import getFeeds from "../queries/getFeeds"
import FeedListItem from "./FeedListItem"
import { LOCALSTORAGE_FEEDID, useSharedState } from "app/core/hooks/store"
import { FEED_MODE } from "types"

type Props = {
  mode: FEED_MODE
}

export const FeedList: FC<Props> = ({ mode }) => {
  const secondsInMinute = 60
  const milliSecondsInSecond = 1000
  const [{ feeds }] = useQuery(getFeeds, undefined, {
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
            unreadCount={feeds
              .map((feed) => feed.unreadCount)
              .reduce((accumulator: number, current: number) => accumulator + current, 0)}
            isActive={mode === FEED_MODE.RSS && activeFeedID === -1}
            onClick={() => {
              if (mode === FEED_MODE.BOOKMARKS) {
                router.push("/feeds/rss")
              }
              setState((previous) => ({ ...previous, activeFeedID: -1 }))
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
