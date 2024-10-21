import { NotFoundError } from "blitz"
import { Suspense, useState } from "react"
import { BlitzPage, ErrorBoundary } from "@blitzjs/next"
import clsx from "clsx"
import Form from "app/core/components/Form"
import Loader from "app/core/components/Loader"
import TextFieldWithButton from "app/core/components/TextFieldWithButton"
import Layout from "app/core/layouts/Layout"
import LectureSearch from "app/univis/components/LectureSearch"

const UnivisWrapper: BlitzPage = () => {
  const [searchText, setSearchText] = useState("")

  return (
    <div className={clsx("sm:text-center", "lg:text-left", "w-full")}>
      <h1 className={clsx("font-bold", "mb-4", "text-2xl")}>UniVis Wrapper</h1>
      <p className="mb-4">
        This is a wrapper for the UniVis page of Otto-Friedrich Universität Bamberg with a focus on
        (mobile) usability.
      </p>

      <Form
        onSubmit={async (values) => {
          setSearchText(values.lecture)
        }}
        initialValues={{ lecture: "" }}
      >
        <TextFieldWithButton
          name="lecture"
          label="Name of the lecture"
          button={{ value: "search" }}
        />
      </Form>

      <ErrorBoundary
        fallbackRender={({ error }) => {
          console.error(error)
          if (error instanceof NotFoundError) return <p>No lectures found</p>
          return <p>An Error occurred</p>
        }}
        resetKeys={[searchText]}
      >
        <Suspense fallback={<Loader />}>
          <LectureSearch searchTerm={searchText} />
        </Suspense>
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
