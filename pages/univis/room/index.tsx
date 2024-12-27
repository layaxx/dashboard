import { NotFoundError } from "blitz"
import { Suspense, useRef, useState } from "react"
import { BlitzPage, ErrorBoundary } from "@blitzjs/next"
import clsx from "clsx"
import dynamic from "next/dynamic"
import Form from "app/core/components/Form"
import SkeletonButton from "app/core/components/SkeletonButton"
import TextFieldWithButton from "app/core/components/TextFieldWithButton"
import Layout from "app/core/layouts/Layout"
import RoomSearch from "app/univis/components/RoomSearch"
import RoomSearchSkeleton from "app/univis/components/RoomSearchSkeleton"

const LOCALSTORAGE_UNIVIS_ROOMS = "univis-searchTerms-room"
const MAX_SEARCH_TERMS = 10

const PastSearchTermsClient = dynamic(() => import("app/univis/components/PastSearchTerms"), {
  ssr: false,
  loading: () => (
    <div className={clsx("flex", "gap-x-4")}>
      {Array.from({ length: 3 }, (_, index) => index).map((key) => (
        <SkeletonButton key={key} />
      ))}
    </div>
  ),
})

const UnivisRoomsSearchPage: BlitzPage = () => {
  const [searchText, setSearchText] = useState("")
  const searchTerms = useRef<string[]>([])

  return (
    <div className={clsx("sm:text-center", "lg:text-left", "w-full")}>
      <p className="mb-4">
        This is a wrapper for the UniVis page of Otto-Friedrich Universität Bamberg with a focus on
        (mobile) usability.
      </p>

      <Form
        onSubmit={async (values: { searchTerm: string }) => {
          setSearchText(values.searchTerm)
          if (!values.searchTerm) return

          if (!Array.isArray(searchTerms.current)) searchTerms.current = []
          const terms = searchTerms.current
          if (!terms.includes(values.searchTerm)) {
            if (terms.length >= MAX_SEARCH_TERMS) terms.pop()
            terms.unshift(values.searchTerm)
          } else if (terms.at(0) !== values.searchTerm) {
            terms.splice(terms.indexOf(values.searchTerm), 1)
            terms.unshift(values.searchTerm)
          }
          globalThis.localStorage.setItem(LOCALSTORAGE_UNIVIS_ROOMS, JSON.stringify(terms))
        }}
        initialValues={{ room: "" }}
        keepDirtyOnReinitialize
      >
        <TextFieldWithButton
          name="searchTerm"
          label="Name of the room"
          button={{ value: "search", type: "submit" }}
        />

        <PastSearchTermsClient
          termsRef={searchTerms}
          localStorageKey={LOCALSTORAGE_UNIVIS_ROOMS}
          fallback={["WE5/01.003", "WE5/00.022", "F21/01.57"]}
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
