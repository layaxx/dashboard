import { Suspense } from "react"
import { Head, BlitzPage } from "blitz"
import Loader from "app/core/components/Loader"
import DashboardLayout from "app/core/layouts/DashboardLayout"
import { FeedsList } from "app/feeds/components/FeedsList"
import { ItemList } from "app/feeds/components/reading/ItemList"
import { FEED_MODE } from "types"

const FeedsReadingPage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>Feeds - Reading</title>
      </Head>
      <DashboardLayout
        feeds={
          <Suspense fallback={<Loader />}>
            <FeedsList mode={FEED_MODE.BOOKMARKS} />
          </Suspense>
        }
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
