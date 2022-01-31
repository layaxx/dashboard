import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useParam, BlitzPage, useMutation, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import deleteFeed from "app/feeds/mutations/deleteFeed"
import getFeed from "app/feeds/queries/getFeed"

export const Feed = () => {
  const router = useRouter()
  const feedId = useParam("feedId", "number")
  const [deleteFeedMutation] = useMutation(deleteFeed)
  const [feed] = useQuery(getFeed, { id: feedId })

  return (
    <>
      <Head>
        <title>Feed {feed.id}</title>
      </Head>

      <div>
        <h1>Feed {feed.id}</h1>
        <pre>{JSON.stringify(feed, null, 2)}</pre>

        <Link href={Routes.EditFeedPage({ feedId: feed.id })}>
          <a>Edit</a>
        </Link>

        <button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deleteFeedMutation({ id: feed.id })
              router.push(Routes.FeedsPage())
            }
          }}
          style={{ marginLeft: "0.5rem" }}
        >
          Delete
        </button>
      </div>
    </>
  )
}

const ShowFeedPage: BlitzPage = () => {
  return (
    <div>
      <p>
        <Link href={Routes.FeedsPage()}>
          <a>Feeds</a>
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <Feed />
      </Suspense>
    </div>
  )
}

ShowFeedPage.authenticate = true
ShowFeedPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowFeedPage
