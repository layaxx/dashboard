import { Suspense } from "react"
import { Head, BlitzPage } from "blitz"
import Loader from "app/core/components/Loader"
import DashboardLayout from "app/core/layouts/DashboardLayout"
import { FeedListContainer } from "app/feeds/components/FeedListContainer"
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
