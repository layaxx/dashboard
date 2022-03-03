import { Suspense } from "react"
import { BlitzPage } from "blitz"
import clsx from "clsx"
import Button from "app/core/components/Button"
import UserInfo from "app/core/components/UserInfo"
import Layout from "app/core/layouts/Layout"

const Home: BlitzPage = () => {
  return (
    <main
      className={clsx(
        "max-w-7xl",
        "mt-10",
        "sm:mt-12",
        "md:mt-16",
        "lg:mt-20",
        "xl:mt-28",
        "mx-auto",
        "px-4",
        "sm:px-6",
        "lg:px-8"
      )}
    >
      <div className={clsx("sm:text-center", "lg:text-left")}>
        <h1
          className={clsx(
            "font-extrabold",
            "text-4xl",
            "sm:text-5xl",
            "md:text-6xl",
            "text-primary",
            "tracking-tight"
          )}
        >
          <span className={clsx("block", "xl:inline")}>Dashboard</span>
        </h1>
        <p
          className={clsx(
            "sm:max-w-xl",
            "mt-3",
            "sm:mt-5",
            "md:mt-5",
            "lg:mx-0",
            "sm:mx-auto",
            "text-base",
            "text-gray-500",
            "sm:text-lg",
            "md:text-xl"
          )}
        >
          Login status:
          <Suspense fallback="Loading...">
            <UserInfo />
          </Suspense>
        </p>
        <div
          className={clsx("sm:flex", "sm:justify-center", "lg:justify-start", "mt-5", "sm:mt-8")}
        >
          <div className={clsx("rounded-md", "shadow")}>
            <a
              href="/feeds/rss"
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
            </a>
          </div>
          <div className={clsx("sm:ml-3", "sm:mt-0", "mt-3")}>
            <a
              href="/feeds/reading"
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
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}

Home.suppressFirstRenderFlicker = true
Home.getLayout = (page) => <Layout title="Home">{page}</Layout>

export default Home
