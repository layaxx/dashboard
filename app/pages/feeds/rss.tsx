import { Suspense } from "react"
import { Head, BlitzPage } from "blitz"
import Loader from "app/core/components/Loader"
import { FEED_MODE } from "app/core/hooks/feedSlice"
import DashboardLayout from "app/core/layouts/DashboardLayout"
import { FeedsList } from "app/feeds/components/FeedsList"
import { ItemsList } from "app/feeds/components/ItemsList"

const FeedsRSSPage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>Feeds - RSS</title>
      </Head>
      <DashboardLayout
        feeds={
          <Suspense fallback={<Loader />}>
            <FeedsList mode={FEED_MODE.RSS} />
          </Suspense>
        }
        items={
          <Suspense fallback={<Loader />}>
            <ItemsList />
          </Suspense>
        }
      />
    </>
  )
}

FeedsRSSPage.authenticate = true

export default FeedsRSSPage
