import { NotFoundError } from "blitz"
import { Suspense, useRef, useState } from "react"
import { BlitzPage, ErrorBoundary } from "@blitzjs/next"
import clsx from "clsx"
import dynamic from "next/dynamic"
import { z } from "zod"
import Form from "app/core/components/form"
import TextFieldWithButton from "app/core/components/form/fields/TextFieldWithButton"
import SkeletonButton from "app/core/components/SkeletonButton"
import Layout from "app/core/layouts/Layout"
import LectureSearch from "app/univis/components/LectureSearch"
import LectureSearchSkeleton from "app/univis/components/LectureSearchSkeleton"

const LOCALSTORAGE_UNIVIS_LECTURES = "univis-searchTerms"
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

const UnivisWrapper: BlitzPage = () => {
  const [searchText, setSearchText] = useState("")
  const searchTerms = useRef<string[]>([])

  return (
    <div className={clsx("sm:text-center", "lg:text-left", "w-full")}>
      <p className="mb-4">
        This is a wrapper for the UniVis page of Otto-Friedrich Universität Bamberg with a focus on
        (mobile) usability.
      </p>

      <Form
        schema={z.object({ searchTerm: z.string() })}
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
          globalThis.localStorage.setItem(LOCALSTORAGE_UNIVIS_LECTURES, JSON.stringify(terms))
        }}
        initialValues={{ searchTerm: "" }}
        keepDirtyOnReinitialize
      >
        <TextFieldWithButton
          name="searchTerm"
          label="Name of the lecture"
          button={{ value: "search", type: "submit" }}
        />

        <PastSearchTermsClient
          termsRef={searchTerms}
          localStorageKey={LOCALSTORAGE_UNIVIS_LECTURES}
          fallback={["xai", "uixd", "swe"]}
        />
      </Form>

      <ErrorBoundary
        fallbackRender={({ error }) => {
          console.error(error)
          if (error instanceof NotFoundError)
            return <p className={clsx("font-bold", "mt-2")}>No lectures found</p>
          return <p>An Error occurred</p>
        }}
        resetKeys={[searchText]}
      >
        <Suspense fallback={<LectureSearchSkeleton />}>
          <LectureSearch searchTerm={searchText} />
        </Suspense>
        {!searchText && (
          <p className="mt-4">
            You can start by typing (part of) the name of any event from UnivIS (such as lectures,
            seminars, projects, etc.) in the search bar above or press one of the suggestions.
          </p>
        )}
      </ErrorBoundary>
    </div>
  )
}

UnivisWrapper.suppressFirstRenderFlicker = true
UnivisWrapper.getLayout = (page) => (
  <Layout heading="UniVis Wrapper" title="Univis">
    {page}
  </Layout>
)

export default UnivisWrapper
