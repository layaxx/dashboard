"use client"
import { FC } from "react"
import { Routes } from "@blitzjs/next"
import { useQuery } from "@blitzjs/rpc"
import { useRouter } from "next/router"
import FeedListItem from "./FeedListItem"
import getFeeds from "../queries/getFeeds"
import { LOCALSTORAGE_FEEDID, useSharedState } from "app/core/hooks/store"
import { ALL_FEEDS_ID, RECENTLY_READ_ID } from "lib/config/feeds/feedIDs"
import { FEED_MODE } from "types"

type Props = {
  mode: FEED_MODE
}

export const FeedList: FC<Props> = ({ mode }) => {
  const secondsInMinute = 60
  const milliSecondsInSecond = 1000
  const [{ feeds }] = useQuery(
    getFeeds,
    {},
    {
      refetchInterval: milliSecondsInSecond * secondsInMinute,
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
    }
  )

  const showAllFeeds = false

  const [{ activeFeedID, refetchItems, closeAside }, setState] = useSharedState()

  const referenceID = "feed-list-item-0"

  const closeIfNecessary = () => {
    const asideIsFullscreen =
      window &&
      (document.querySelector("#" + referenceID)?.clientWidth ?? 0) / window.innerWidth > 0.9
    if (asideIsFullscreen) closeAside()
  }

  const router = useRouter()
  return (
    <>
      {feeds && (
        <>
          <FeedListItem
            title={"Recently Read"}
            id={referenceID}
            isActive={mode === FEED_MODE.RSS && activeFeedID === RECENTLY_READ_ID}
            onClick={() => {
              if (mode === FEED_MODE.BOOKMARKS) {
                router.push(Routes.FeedsRSSPage())
              }
              setState((previous) => ({ ...previous, activeFeedID: RECENTLY_READ_ID }))
              closeIfNecessary()
            }}
          />

          <FeedListItem
            title={"All Feeds"}
            unreadCount={feeds.reduce(
              (accumulator: number, current) => accumulator + current.unreadCount,
              0
            )}
            isActive={mode === FEED_MODE.RSS && activeFeedID === ALL_FEEDS_ID}
            onClick={() => {
              if (mode === FEED_MODE.BOOKMARKS) {
                router.push(Routes.FeedsRSSPage())
              }
              setState((previous) => ({ ...previous, activeFeedID: ALL_FEEDS_ID }))
              closeIfNecessary()
            }}
          />

          {feeds
            .filter((feed) => feed.unreadCount || feed.id === activeFeedID || showAllFeeds)
            .map(({ id, unreadCount, name, isActive }) => {
              const isSelected = mode === FEED_MODE.RSS && activeFeedID === id
              const title = isActive ? name : "[inactive] " + name
              return (
                <FeedListItem
                  title={title}
                  unreadCount={unreadCount}
                  onClick={() => {
                    if (mode !== FEED_MODE.RSS) {
                      router.push(Routes.FeedsRSSPage())
                    }
                    if (isSelected) {
                      refetchItems()
                    } else {
                      localStorage.setItem(LOCALSTORAGE_FEEDID, JSON.stringify(id))
                      setState((previous) => ({ ...previous, activeFeedID: id }))
                      closeIfNecessary()
                    }
                  }}
                  key={id}
                  isActive={isSelected}
                />
              )
            })}
        </>
      )}
    </>
  )
}
