import { Suspense } from "react"
import { BlitzPage, Routes } from "@blitzjs/next"
import Head from "next/head"
import DashboardLayout from "app/core/layouts/DashboardLayout"
import { FeedListContainer } from "app/feeds/components/FeedListContainer"
import ItemSkeleton from "app/feeds/components/items/ItemSkeleton"
import { ItemList } from "app/feeds/components/reading/ItemList"
import { FEED_MODE } from "types"

const FeedsReadingPage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>Feeds - Reading</title>
      </Head>
      <DashboardLayout
        feeds={<FeedListContainer mode={FEED_MODE.BOOKMARKS} />}
        items={
          <Suspense
            fallback={Array.from({ length: 5 }, (_, index) => index).map((index) => (
              <ItemSkeleton key={index} />
            ))}
          >
            <ItemList />
          </Suspense>
        }
      />
    </>
  )
}

FeedsReadingPage.authenticate = { redirectTo: Routes.LoginPage() }

export default FeedsReadingPage
