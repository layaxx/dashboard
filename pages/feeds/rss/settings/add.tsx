import { BlitzPage } from "@blitzjs/next"
import Head from "next/head"
import Layout from "app/core/layouts/Layout"
import AddFeedForm from "app/feeds/components/settings/Form"

const FeedsAddPage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>Feeds - Add Feed</title>
      </Head>
      <AddFeedForm />
    </>
  )
}

FeedsAddPage.authenticate = true
FeedsAddPage.getLayout = (page) => <Layout heading="Add a new Feed">{page}</Layout>

export default FeedsAddPage
