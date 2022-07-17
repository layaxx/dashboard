import { Suspense } from "react"
import { Head, BlitzPage, useParams } from "blitz"
import Loader from "app/core/components/Loader"
import Layout from "app/core/layouts/Layout"
import SettingsForm from "app/feeds/components/settings/Form"

const FeedsSettingsPage: BlitzPage = () => {
  const { id } = useParams("number")

  return (
    <>
      <Head>
        <title>Feeds - Settings</title>
      </Head>
      <Suspense fallback={<Loader />}>
        <SettingsForm id={id} />
      </Suspense>
    </>
  )
}

FeedsSettingsPage.authenticate = true
FeedsSettingsPage.getLayout = (page) => <Layout heading="RSS Settings Page">{page}</Layout>

export default FeedsSettingsPage
