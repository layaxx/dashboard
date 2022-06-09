import { Suspense } from "react"
import { Head, BlitzPage } from "blitz"
import Loader from "app/core/components/Loader"
import Layout from "app/core/layouts/Layout"
import StatusOverview from "app/feeds/components/status/Overview"

const FeedsStatusPage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>Feeds - RSS</title>
      </Head>
      <Layout heading="RSS Status Page">
        <Suspense fallback={<Loader />}>
          <StatusOverview />
        </Suspense>
      </Layout>
    </>
  )
}

FeedsStatusPage.authenticate = true

export default FeedsStatusPage
