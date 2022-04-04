import { useQuery } from "blitz"
import { useRouter } from "next/dist/client/router"
import getFeeds from "../queries/getFeeds"
import FeedListItem from "./FeedListItem"
import { LOCALSTORAGE_FEEDID, useSharedState } from "app/core/hooks/store"
import { FEED_MODE } from "types"

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

export const FeedList = ({ mode }: Props) => {
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
              .map((feed: FeedAPIResponse) => feed.unreadCount)
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
            .filter(
              (feed: FeedAPIResponse) =>
                feed.unreadCount || feed.id === activeFeedID || showAllFeeds
            )
            .map(({ id, title, unreadCount }: FeedAPIResponse) => {
              const isActive = mode === FEED_MODE.RSS && activeFeedID === id
              return (
                <FeedListItem
                  title={title}
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
