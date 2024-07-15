import { Suspense } from "react"
import { BlitzPage, Routes } from "@blitzjs/next"
import { PlusIcon } from "@heroicons/react/24/outline"
import Head from "next/head"
import Button from "app/core/components/Button"
import Loader from "app/core/components/Loader"
import Layout from "app/core/layouts/Layout"
import SettingsOverview from "app/feeds/components/settings/Overview"

const FeedsSettingsOverviewPage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>Feeds - Settings</title>
      </Head>

      <Button href={Routes.FeedsAddPage()} icon={<PlusIcon />}>
        Add new Feed
      </Button>

      <div className="w-full">
        <Suspense
          fallback={
            <div className="mt-4">
              <Loader />
            </div>
          }
        >
          <SettingsOverview />
        </Suspense>
      </div>
    </>
  )
}

FeedsSettingsOverviewPage.authenticate = true
FeedsSettingsOverviewPage.getLayout = (page) => <Layout heading="RSS Settings Page">{page}</Layout>

export default FeedsSettingsOverviewPage
