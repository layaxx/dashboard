import { Suspense } from "react"
import { BlitzPage, useParam } from "@blitzjs/next"
import Head from "next/head"
import Loader from "app/core/components/Loader"
import Layout from "app/core/layouts/Layout"
import SettingsForm from "app/feeds/components/settings/Form"

const FeedsSettingsPage: BlitzPage = () => {
  const id = useParam("id")

  return (
    <>
      <Head>
        <title>Feeds - Settings</title>
      </Head>
      <Suspense fallback={<Loader />}>
        <SettingsForm id={Number(id)} />
      </Suspense>
    </>
  )
}

FeedsSettingsPage.authenticate = true
FeedsSettingsPage.getLayout = (page) => <Layout heading="RSS Settings Page">{page}</Layout>

export default FeedsSettingsPage
