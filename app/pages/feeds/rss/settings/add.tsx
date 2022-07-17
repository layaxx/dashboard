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
      <Suspense fallback={<Loader />}>
        <SettingsForm isCreate />
      </Suspense>
    </>
  )
}

FeedsAddPage.authenticate = true
FeedsAddPage.getLayout = (page) => <Layout heading="RSS Settings Page">{page}</Layout>

export default FeedsAddPage
