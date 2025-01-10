import React from "react"
import { BlitzPage } from "@blitzjs/next"
import Head from "next/head"
import { gSSP } from "app/blitz-server"
import CustomErrorComponent from "app/core/components/CustomErrorComponent"
import Layout from "app/core/layouts/Layout"
import FeedsSettingsPageContent from "app/feeds/components/settings/FeedsSettingsPageContent"
import { defaultOptions } from "app/feeds/feedoptions"
import getFeed from "app/feeds/queries/getFeed"
import { FeedWithEventsAndCount } from "lib/feeds/types"

type Props = {
  feed?: FeedWithEventsAndCount
}

const FeedsSettingsPage: BlitzPage<Props> = ({ feed }) => {
  return (
    <>
      <Head>
        <title>Feeds - Settings</title>
      </Head>

      {feed ? (
        <FeedsSettingsPageContent feed={feed} />
      ) : (
        <CustomErrorComponent statusCode={404} message="This feed does not exist." />
      )}
    </>
  )
}

export const getServerSideProps = gSSP<Props>(async ({ ctx, params }) => {
  try {
    const feed = await getFeed({ id: Number(params?.id), includeLoadEvents: true }, ctx)

    if (feed && !feed.options) {
      feed.options = {
        ...defaultOptions,
        id: -1,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    }
    return {
      props: {
        feed: feed as FeedWithEventsAndCount,
      },
    }
  } catch {
    console.error(params)
  }

  return {
    props: {
      feed: undefined,
    },
  }
})

FeedsSettingsPage.authenticate = true
FeedsSettingsPage.getLayout = (page) => <Layout heading="RSS Settings Page">{page}</Layout>

export default FeedsSettingsPage
