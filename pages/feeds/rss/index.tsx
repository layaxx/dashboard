import { Suspense } from "react"
import { BlitzPage, Routes } from "@blitzjs/next"
import Head from "next/head"
import DashboardLayout from "app/core/layouts/DashboardLayout"
import { FeedListContainer } from "app/feeds/components/FeedListContainer"
import ItemSkeleton from "app/feeds/components/items/ItemSkeleton"
import { ItemsList } from "app/feeds/components/ItemsList"
import { FEED_MODE } from "types"

const FeedsRSSPage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>Feeds - RSS</title>
      </Head>
      <DashboardLayout
        feeds={<FeedListContainer mode={FEED_MODE.RSS} />}
        items={
          <Suspense
            fallback={Array.from({ length: 5 }, (_, index) => (
              <ItemSkeleton key={index} />
            ))}
          >
            <ItemsList />
          </Suspense>
        }
      />
    </>
  )
}

FeedsRSSPage.authenticate = { redirectTo: Routes.LoginPage() }

export default FeedsRSSPage
