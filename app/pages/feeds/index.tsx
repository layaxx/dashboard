import { Suspense, useState } from "react"
import { Head, BlitzPage } from "blitz"
import Loader from "app/core/components/Loader"
import DashboardLayout from "app/core/layouts/DashboardLayout"
import { FeedAPIResponse, FeedsList } from "app/feeds/components/FeedsList"
import { ItemsList } from "app/feeds/components/ItemsList"

const FeedsPage: BlitzPage = () => {
  const feedState = useState<FeedAPIResponse["id"] | undefined>()

  return (
    <>
      <Head>
        <title>Feeds</title>
      </Head>
      <DashboardLayout
        feeds={
          <Suspense fallback={<Loader />}>
            <FeedsList feedState={feedState} />
          </Suspense>
        }
        items={
          <Suspense fallback={<Loader />}>
            <ItemsList feedState={feedState[0]} />
          </Suspense>
        }
      />
    </>
  )
}

FeedsPage.authenticate = true

export default FeedsPage
