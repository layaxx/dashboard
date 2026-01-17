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
          "dark:text-gray-400",
          "text-gray-500",
          "sm:text-lg",
          "md:text-xl"
        )}
      >
        Login status:
      </div>
      <Suspense
        fallback={
          <div className={clsx("max-w-sm", "mx-auto", "w-full")}>
            <div className={clsx("animate-pulse", "flex", "space-x-4")}>
              <div
                className={clsx(
                  "bg-slate-200",
                  "dark:bg-slate-700",
                  "h-4",
                  "mt-1",
                  "rounded",
                  "w-6/12"
                )}
              />
              <div
                className={clsx("bg-slate-200", "dark:bg-slate-700", "h-10", "rounded", "w-6/12")}
              />
            </div>
          </div>
        }
      >
        <UserInfo />
      </Suspense>

      {process.env.NEXT_PUBLIC_IS_DEMO_MODE === "true" && (
        <div>
          <p className="font-bold">Demo Mode Active</p>
          <p>You can log in with the demo account (demo@example.com, demo).</p>
        </div>
      )}

      <div className={clsx("flex", "flex-col", "md:flex-row", "gap-2", "md:gap-8", "mt-8")}>
        <Button href={Routes.FeedsRSSPage()} variant="primary" size="lg" className="grow">
          News Feed
        </Button>

        <Button href={Routes.FeedsReadingPage()} variant="secondary" size="lg" className="grow">
          Bookmarks
        </Button>
      </div>

      <div className={clsx("flex", "flex-col", "md:flex-row", "gap-2", "md:gap-8", "mt-8")}>
        <Button href={Routes.UnivisWrapper()} variant="secondary" className="grow">
          Univis Wrapper
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
