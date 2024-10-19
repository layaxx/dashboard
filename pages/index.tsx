import { Suspense } from "react"
import { BlitzPage, Routes } from "@blitzjs/next"
import clsx from "clsx"
import Button from "app/core/components/Button"
import UserInfo from "app/core/components/UserInfo"
import Layout from "app/core/layouts/Layout"

const Home: BlitzPage = () => {
  return (
    <div className={clsx("sm:text-center", "lg:text-left", ["w-full", "max-w-96"])}>
      <div
        className={clsx(
          "mt-5",
          "lg:mx-0",
          "sm:mx-auto",
          "text-base",
          "text-gray-500",
          "sm:text-lg",
          "md:text-xl",
        )}
      >
        Login status:
      </div>
      <Suspense
        fallback={
          <div className={clsx("max-w-sm", "mx-auto", "w-full")}>
            <div className={clsx("animate-pulse", "flex", "space-x-4")}>
              <div className={clsx("bg-slate-200", "h-4", "mt-1", "rounded", "w-6/12")}></div>
              <div className={clsx("bg-slate-200", "h-10", "rounded", "w-6/12")}></div>
            </div>
          </div>
        }
      >
        <UserInfo />
      </Suspense>

      <div className={clsx("flex", "flex-col", "md:flex-row", "gap-2", "md:gap-8", "mt-8")}>
        <Button href={Routes.FeedsRSSPage()} variant="primary" size="lg" className="grow">
          News Feed
        </Button>

        <Button href={Routes.FeedsReadingPage()} variant="secondary" size="lg" className="grow">
          Bookmarks
        </Button>
      </div>
    </div>
  )
}

Home.suppressFirstRenderFlicker = true
Home.getLayout = (page) => (
  <Layout heading="Dashboard" title="Home">
    {page}
  </Layout>
)

export default Home
