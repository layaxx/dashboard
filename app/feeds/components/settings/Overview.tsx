"use client"
import { useEffect, useRef } from "react"
import { useQuery } from "@blitzjs/rpc"
import FeedReordering from "./FeedReordering"
import SettingsItem from "./Item"
import getFeeds from "app/feeds/queries/getFeeds"

const SettingsOverview = () => {
  const [{ feeds }, { refetch, dataUpdatedAt }] = useQuery(getFeeds, undefined, {
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  })

  const hasScrolled = useRef(false)
  useEffect(() => {
    if (location.hash && !hasScrolled.current) {
      const element = document.querySelector(location.hash)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
        hasScrolled.current = true
      }
    }
  })

  return (
    <>
      <div className="w-full">
        {Array.isArray(feeds) &&
          feeds.map((feed) => <SettingsItem {...feed} key={feed.id} refetch={refetch} />)}
      </div>
      <FeedReordering feeds={feeds} refetch={refetch} key={dataUpdatedAt} />
    </>
  )
}

export default SettingsOverview
