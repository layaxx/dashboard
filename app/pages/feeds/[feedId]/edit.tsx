import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useMutation, useParam, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import { FeedForm, FORM_ERROR } from "app/feeds/components/FeedForm"
import updateFeed from "app/feeds/mutations/updateFeed"
import getFeed from "app/feeds/queries/getFeed"

export const EditFeed = () => {
  const router = useRouter()
  const feedId = useParam("feedId", "number")
  const [feed, { setQueryData }] = useQuery(
    getFeed,
    { id: feedId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Number.POSITIVE_INFINITY,
    }
  )
  const [updateFeedMutation] = useMutation(updateFeed)

  return (
    <>
      <Head>
        <title>Edit Feed {feed.id}</title>
      </Head>

      <div>
        <h1>Edit Feed {feed.id}</h1>
        <pre>{JSON.stringify(feed, undefined, 2)}</pre>

        <FeedForm
          submitText="Update Feed"
          // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          // schema={UpdateFeed}
          initialValues={feed}
          onSubmit={async (values) => {
            try {
              const updated = await updateFeedMutation({
                id: feed.id,
                ...values,
              })
              await setQueryData(updated)
              router.push(Routes.ShowFeedPage({ feedId: updated.id }))
            } catch (error: any) {
              console.error(error)
              return {
                [FORM_ERROR]: error.toString(),
              }
            }
          }}
        />
      </div>
    </>
  )
}

const EditFeedPage: BlitzPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditFeed />
      </Suspense>

      <p>
        <Link href={Routes.FeedsRSSPage()}>
          <a>Feeds</a>
        </Link>
      </p>
    </div>
  )
}

EditFeedPage.authenticate = true
EditFeedPage.getLayout = (page) => <Layout>{page}</Layout>

export default EditFeedPage
