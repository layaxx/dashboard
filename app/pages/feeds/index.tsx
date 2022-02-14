import { Suspense } from "react"
import { Head, BlitzPage } from "blitz"
import Loader from "app/core/components/Loader"
import DashboardLayout from "app/core/layouts/DashboardLayout"
import { FeedsList } from "app/feeds/components/FeedsList"
import { ItemsList } from "app/feeds/components/ItemsList"

const FeedsPage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>Feeds</title>
      </Head>
      <DashboardLayout
        feeds={
          <Suspense fallback={<Loader />}>
            <FeedsList />
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

FeedsPage.authenticate = true

export default FeedsPage
