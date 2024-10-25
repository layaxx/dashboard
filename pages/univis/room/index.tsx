import { NotFoundError } from "blitz"
import { Suspense, useState } from "react"
import { BlitzPage, ErrorBoundary } from "@blitzjs/next"
import clsx from "clsx"
import Form from "app/core/components/Form"
import TextFieldWithButton from "app/core/components/TextFieldWithButton"
import Layout from "app/core/layouts/Layout"
import RoomSearch from "app/univis/components/RoomSearch"
import RoomSearchSkeleton from "app/univis/components/RoomSearchSkeleton"

const UnivisRoomsSearchPage: BlitzPage = () => {
  const [searchText, setSearchText] = useState("")

  return (
    <div className={clsx("sm:text-center", "lg:text-left", "w-full")}>
      <p className="mb-4">
        This is a wrapper for the UniVis page of Otto-Friedrich Universität Bamberg with a focus on
        (mobile) usability.
      </p>

      <Form
        onSubmit={async (values) => {
          setSearchText(values.room)
        }}
        initialValues={{ room: "" }}
        keepDirtyOnReinitialize
      >
        <TextFieldWithButton
          name="room"
          label="Name of the room"
          button={{ value: "search", type: "submit" }}
        />
      </Form>

      <ErrorBoundary
        fallbackRender={({ error }) => {
          console.error(error)
          if (error instanceof NotFoundError)
            return <p className={clsx("font-bold", "mt-2")}>No rooms found</p>
          return <p>An Error occurred</p>
        }}
        resetKeys={[searchText]}
      >
        <Suspense fallback={<RoomSearchSkeleton />}>
          <RoomSearch searchTerm={searchText} />
        </Suspense>
        {!searchText && (
          <p>
            You can start by typing (part of) the short name (e.g. &quot;WE5/01.003&quot;) of any
            room from UnivIS in the search bar above.
          </p>
        )}
      </ErrorBoundary>
    </div>
  )
}

UnivisRoomsSearchPage.suppressFirstRenderFlicker = true
UnivisRoomsSearchPage.getLayout = (page) => (
  <Layout heading="UniVis Rooms" title="Univis Rooms">
    {page}
  </Layout>
)

export default UnivisRoomsSearchPage
