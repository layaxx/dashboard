"use client"
import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import { useQuery } from "@blitzjs/rpc"
import clsx from "clsx"
import Link from "next/link"
import { useRouter } from "next/router"
import { FeedList } from "./FeedList"
import FeedListItem from "./FeedListItem"
import FeedListSkeleton from "./FeedListSkeleton"
import countReadlistentries from "../readlistentries/queries/countReadlistentries"
import QueryErrorBoundary from "app/core/components/QueryErrorBoundary"
import { useSharedState } from "app/core/hooks/store"
import { FEED_MODE } from "types"

type Props = {
  mode: FEED_MODE
}

export const FeedListContainer = ({ mode }: Props) => {
  const [readListCount] = useQuery(countReadlistentries, {}, { suspense: false })
  const router = useRouter()

  const referenceID = "feed-list-container"

  const [{ closeAside }] = useSharedState()
  const closeIfNecessary = (isCrossPage = false) => {
    const threshold = 0.9

    const asideIsFullscreen =
      globalThis.innerWidth &&
      (document.querySelector("#" + referenceID)?.clientWidth ?? 0) / window.innerWidth > threshold
    if (asideIsFullscreen) {
      if (isCrossPage) {
        localStorage.setItem("hideNavbar", "true")
      } else {
        closeAside()
      }
    }
  }

  return (
    <ul id={referenceID}>
      <QueryErrorBoundary
        buttonProps={{ size: "sm" }}
        paragraphProps={{ className: clsx("break-words", "font-bold", "mb-2", "text-lg") }}
        containerProps={{ className: "m-2" }}
      >
        <Suspense fallback={<FeedListSkeleton />}>
          <FeedList mode={mode} closeIfNecessary={closeIfNecessary} />
        </Suspense>
      </QueryErrorBoundary>

      <Link href={Routes.FeedsReadingPage()} passHref>
        <FeedListItem
          title={"Reading List"}
          unreadCount={readListCount ?? 0}
          isActive={mode === FEED_MODE.BOOKMARKS}
          onClick={() => {
            closeIfNecessary(mode !== FEED_MODE.BOOKMARKS)
            router.push(Routes.FeedsReadingPage())
          }}
        />
      </Link>
    </ul>
  )
}
