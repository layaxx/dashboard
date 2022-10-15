import { Suspense } from "react"
import { BlitzPage } from "@blitzjs/next"
import Head from "next/head"
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
          <Suspense
            fallback={
              <div className="mt-2">
                <Loader />
              </div>
            }
          >
            <ItemsList />
          </Suspense>
        }
      />
    </>
  )
}

FeedsRSSPage.authenticate = true

export default FeedsRSSPage
