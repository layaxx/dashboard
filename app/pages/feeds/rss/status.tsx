import { Suspense } from "react"
import { Head, BlitzPage } from "blitz"
import Loader from "app/core/components/Loader"
import Layout from "app/core/layouts/Layout"
import StatusOverview from "app/feeds/components/status/Overview"

const FeedsStatusPage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>Feeds - Status</title>
      </Head>
      <Suspense fallback={<Loader />}>
        <StatusOverview />
      </Suspense>
    </>
  )
}

FeedsStatusPage.authenticate = true
FeedsStatusPage.getLayout = (page) => <Layout heading="RSS Status Page">{page}</Layout>

export default FeedsStatusPage
