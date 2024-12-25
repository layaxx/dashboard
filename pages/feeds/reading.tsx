import { Suspense } from "react"
import { BlitzPage, Routes } from "@blitzjs/next"
import { invalidateQuery, useMutation } from "@blitzjs/rpc"
import { PlusIcon } from "@heroicons/react/24/outline"
import Head from "next/head"
import Form from "app/core/components/Form"
import TextFieldWithButton from "app/core/components/TextFieldWithButton"
import DashboardLayout from "app/core/layouts/DashboardLayout"
import { FeedListContainer } from "app/feeds/components/FeedListContainer"
import ItemSkeleton from "app/feeds/components/items/ItemSkeleton"
import { ItemList } from "app/feeds/components/reading/ItemList"
import createReadlistentry from "app/feeds/readlistentries/mutations/createReadlistentry"
import getReadlistentries from "app/feeds/readlistentries/queries/getReadlistentries"
import { FEED_MODE } from "types"

const FeedsReadingPage: BlitzPage = () => {
  const [addReadlistEntry] = useMutation(createReadlistentry)

  return (
    <>
      <Head>
        <title>Feeds - Reading</title>
      </Head>
      <DashboardLayout
        feeds={<FeedListContainer mode={FEED_MODE.BOOKMARKS} />}
        items={
          <>
            <div className="md:px-10">
              <Form
                onSubmit={({ url }, form) =>
                  addReadlistEntry({ url }).then(() => {
                    invalidateQuery(getReadlistentries)
                    form.reset()
                  })
                }
              >
                <TextFieldWithButton
                  name="url"
                  label="Add a new item"
                  button={{
                    type: "submit",
                    value: "Add a new item",
                    className: "text-nowrap",
                    icon: <PlusIcon />,
                  }}
                />
              </Form>
            </div>
            <Suspense
              fallback={Array.from({ length: 5 }, (_, index) => index).map((index) => (
                <ItemSkeleton key={index} />
              ))}
            >
              <ItemList />
            </Suspense>
          </>
        }
      />
    </>
  )
}

FeedsReadingPage.authenticate = { redirectTo: Routes.LoginPage() }

export default FeedsReadingPage
