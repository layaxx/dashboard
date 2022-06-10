import { Suspense } from "react"
import { Head, BlitzPage } from "blitz"
import Loader from "app/core/components/Loader"
import Layout from "app/core/layouts/Layout"
import SettingsOverview from "app/feeds/components/settings/Overview"

const FeedsSettingsOverviewPage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>Feeds - Settings</title>
      </Head>
      <Layout heading="RSS Settings Page">
        <Suspense fallback={<Loader />}>
          <SettingsOverview />
        </Suspense>
      </Layout>
    </>
  )
}

FeedsSettingsOverviewPage.authenticate = true

export default FeedsSettingsOverviewPage
