import React, { Fragment } from "react"
import { BlitzLayout } from "@blitzjs/next"
import clsx from "clsx"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"

const Layout: BlitzLayout<{ title?: string; heading: string; children: React.ReactNode }> = ({
  title,
  children,
  heading,
}) => {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>{title || "dashboard"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={clsx("bg-slate-600", "p-12", "text-gray-200")}>
        <div className={clsx("max-w-screen-2xl", "mx-auto")}>
          <h1
            className={clsx(
              "font-extrabold",
              "text-4xl",
              "sm:text-5xl",
              "md:text-6xl",
              "text-gray-100",
              "tracking-tight"
            )}
          >
            <span className={clsx("block", "xl:inline")}>{heading}</span>
          </h1>
          <nav className="mt-4">
            {router.pathname
              .split("/")
              .filter((element, index) => index === 0 || element)
              .map((element, index, array) => {
                const path = array.slice(0, index + 1).join("/")
                return (
                  <Fragment key={path}>
                    <Link href={path || "/"}>{element || "Home"}</Link>
                    <span className="mx-2">/</span>
                  </Fragment>
                )
              })}
          </nav>
        </div>
      </header>
      <main className={clsx("flex", "flex-wrap", "justify-around", "m-auto", "p-8")}>
        {children}
      </main>
    </>
  )
}

export default Layout
