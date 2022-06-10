import { Suspense } from "react"
import { Head, BlitzPage } from "blitz"
import Loader from "app/core/components/Loader"
import Layout from "app/core/layouts/Layout"
import SettingsForm from "app/feeds/components/settings/Form"

const FeedsAddPage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>Feeds - Add Feed</title>
      </Head>
      <Layout heading="RSS Settings Page">
        <Suspense fallback={<Loader />}>
          <SettingsForm isCreate />
        </Suspense>
      </Layout>
    </>
  )
}

FeedsAddPage.authenticate = true

export default FeedsAddPage
