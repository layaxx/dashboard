"use client"
import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import { useQuery } from "@blitzjs/rpc"
import Link from "next/link"
import { useRouter } from "next/router"
import { FeedList } from "./FeedList"
import FeedListItem from "./FeedListItem"
import FeedListSkeleton from "./FeedListSkeleton"
import countReadlistentries from "../readlistentries/queries/countReadlistentries"
import { FEED_MODE } from "types"

type Props = {
  mode: FEED_MODE
}

export const FeedListContainer = ({ mode }: Props) => {
  const [readListCount] = useQuery(countReadlistentries, {}, { suspense: false })

  const router = useRouter()

  return (
    <ul>
      <Suspense fallback={<FeedListSkeleton />}>
        <FeedList mode={mode} />
      </Suspense>
      <Link href={Routes.FeedsReadingPage()} passHref>
        <FeedListItem
          title={"Reading List"}
          unreadCount={readListCount ?? 0}
          isActive={mode === FEED_MODE.BOOKMARKS}
          onClick={() => {
            router.push(Routes.FeedsReadingPage())
          }}
        />
      </Link>
    </ul>
  )
}
