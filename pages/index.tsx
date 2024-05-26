import { Suspense } from "react"
import { BlitzPage, Routes } from "@blitzjs/next"
import clsx from "clsx"
import Link from "next/link"
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
          "md:text-xl"
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
      <div className={clsx("sm:flex", "md:justify-between", "sm:justify-center", "mt-8")}>
        <div className={clsx("rounded-md", "shadow")}>
          <Link
            href={Routes.FeedsRSSPage()}
            className={clsx(
              "hover:bg-indigo-700",
              "bg-primary",
              "border",
              "border-transparent",
              "flex",
              "font-medium",
              "items-center",
              "justify-center",
              "md:px-10",
              "px-8",
              "py-3",
              "md:py-4",
              "rounded-md",
              "text-base",
              "md:text-lg",
              "text-white",
              "w-full"
            )}
          >
            News Feed
          </Link>
        </div>
        <div className={clsx("sm:ml-3", "sm:mt-0", "mt-3")}>
          <Link
            href={Routes.FeedsReadingPage()}
            className={clsx(
              "bg-indigo-100",
              "hover:bg-indigo-200",
              "border",
              "border-transparent",
              "flex",
              "font-medium",
              "items-center",
              "justify-center",
              "md:px-10",
              "px-8",
              "py-3",
              "md:py-4",
              "rounded-md",
              "text-base",
              "text-indigo-700",
              "md:text-lg",
              "w-full"
            )}
          >
            Bookmarks
          </Link>
        </div>
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
