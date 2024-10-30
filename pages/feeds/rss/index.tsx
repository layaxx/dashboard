import { Suspense } from "react"
import { BlitzPage, Routes } from "@blitzjs/next"
import clsx from "clsx"
import Head from "next/head"
import QueryErrorBoundary from "app/core/components/QueryErrorBoundary"
import DashboardLayout from "app/core/layouts/DashboardLayout"
import { FeedListContainer } from "app/feeds/components/FeedListContainer"
import ItemSkeleton from "app/feeds/components/items/ItemSkeleton"
import { ItemsList } from "app/feeds/components/ItemsList"
import { FEED_MODE } from "types"

const FeedsRSSPage: BlitzPage = () => {
  const items = (
    <QueryErrorBoundary
      paragraphProps={{ className: clsx("break-words", "font-bold", "mb-4", "text-xl") }}
      containerProps={{ className: "m-4" }}
    >
      <Suspense
        fallback={Array.from({ length: 5 }, (_, index) => (
          <ItemSkeleton key={index} />
        ))}
      >
        <ItemsList />
      </Suspense>
    </QueryErrorBoundary>
  )

  return (
    <>
      <Head>
        <title>Feeds - RSS</title>
      </Head>
      <DashboardLayout feeds={<FeedListContainer mode={FEED_MODE.RSS} />} items={items} />
    </>
  )
}

FeedsRSSPage.authenticate = { redirectTo: Routes.LoginPage() }

export default FeedsRSSPage
