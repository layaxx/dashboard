import { Suspense } from "react"
import { BlitzPage } from "@blitzjs/next"
import Head from "next/head"
import Loader from "app/core/components/Loader"
import Layout from "app/core/layouts/Layout"
import SettingsOverview from "app/feeds/components/settings/Overview"

const FeedsSettingsOverviewPage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>Feeds - Settings</title>
      </Head>
      <Suspense fallback={<Loader />}>
        <SettingsOverview />
      </Suspense>
    </>
  )
}

FeedsSettingsOverviewPage.authenticate = true
FeedsSettingsOverviewPage.getLayout = (page) => <Layout heading="RSS Settings Page">{page}</Layout>

export default FeedsSettingsOverviewPage
