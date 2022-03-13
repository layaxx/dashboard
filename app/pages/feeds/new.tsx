import { Link, useMutation, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import { FeedForm, FORM_ERROR } from "app/feeds/components/FeedForm"
import createFeed from "app/feeds/mutations/createFeed"

const NewFeedPage: BlitzPage = () => {
  const [createFeedMutation] = useMutation(createFeed)

  return (
    <div>
      <h1>Create New Feed</h1>

      <FeedForm
        submitText="Create Feed"
        // TODO use a zod schema for form validation
        //  - Tip: extract mutation's schema into a shared `validations.ts` file and
        //         then import and use it here
        // schema={CreateFeed}
        // initialValues={{}}
        onSubmit={async (values) => {
          try {
            await createFeedMutation(values)
          } catch (error: any) {
            console.error(error)
            return {
              [FORM_ERROR]: error.toString(),
            }
          }
        }}
      />

      <p>
        <Link href={Routes.FeedsRSSPage()}>
          <a>Feeds</a>
        </Link>
      </p>
    </div>
  )
}

NewFeedPage.authenticate = true
NewFeedPage.getLayout = (page) => <Layout title={"Create New Feed"}>{page}</Layout>

export default NewFeedPage
