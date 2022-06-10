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
      <Layout heading="RSS Settings Page">
        <Suspense fallback={<Loader />}>
          <SettingsForm id={id} />
        </Suspense>
      </Layout>
    </>
  )
}

FeedsSettingsPage.authenticate = true

export default FeedsSettingsPage
