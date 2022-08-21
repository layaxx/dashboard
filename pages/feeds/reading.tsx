import { Suspense } from "react"
import { BlitzPage } from "@blitzjs/next"
import Head from "next/head"
import Loader from "app/core/components/Loader"
import DashboardLayout from "app/core/layouts/DashboardLayout"
import { FeedListContainer } from "app/feeds/components/FeedListContainer"
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
          <Suspense fallback={<Loader />}>
            <ItemList />
          </Suspense>
        }
      />
    </>
  )
}

FeedsReadingPage.authenticate = true

export default FeedsReadingPage
