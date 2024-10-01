import React from "react"
import { BlitzPage } from "@blitzjs/next"
import Head from "next/head"
import { gSSP } from "app/blitz-server"
import Layout from "app/core/layouts/Layout"
import SettingsForm from "app/feeds/components/settings/Form"
import getFeed from "app/feeds/queries/getFeed"
import { Feed } from "db"

const FeedsSettingsPage: BlitzPage<{ feed: Feed }> = ({ feed }) => {
  return (
    <>
      <Head>
        <title>Feeds - Settings</title>
      </Head>

      <SettingsForm feed={feed} />
    </>
  )
}

export const getServerSideProps = gSSP<{ feed?: Feed }>(async ({ ctx, params }) => {
  let feed: Feed
  try {
    feed = await getFeed({ id: Number(params?.id) }, ctx)
  } catch (error) {
    console.error(error)
    return {
      props: {},
    }
  }

  return {
    props: {
      feed,
    },
  }
})

FeedsSettingsPage.authenticate = true
FeedsSettingsPage.getLayout = (page) => <Layout heading="RSS Settings Page">{page}</Layout>

export default FeedsSettingsPage
