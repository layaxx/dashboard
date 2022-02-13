import React, { ReactChild, Suspense, useEffect, useState } from "react"
import { CogIcon, MenuAlt1Icon, MenuIcon } from "@heroicons/react/solid"
import clsx from "clsx"
import defaultTheme from "tailwindcss/defaultTheme"
import Loader from "../components/Loader"
import DashboardGreeting from "app/core/components/DashboardGreeting"
import Zen from "app/feeds/components/zen"

type HeaderProps = {
  hideNavbar: boolean
  setHideNavbar: React.Dispatch<React.SetStateAction<boolean>>
}
const Header = ({ hideNavbar, setHideNavbar }: HeaderProps) => (
  <header
    className={clsx(
      "bg-slate-200",
      "flex",
      "items-center",
      "justify-between",
      "p-6",
      "rounded-r",
      "text-primary",
      "w-full"
    )}
  >
    <div>
      <Suspense fallback={<Loader />}>
        <DashboardGreeting />
      </Suspense>
    </div>

    <div aria-label="toggler" className={clsx("flex", "items-center", "justify-center")}>
      <button
        aria-label={hideNavbar ? "open" : "close"}
        onClick={() => setHideNavbar((previous) => !previous)}
        className={clsx("focus:outline-none", "focus:ring-2")}
      >
        {hideNavbar ? <MenuIcon className="w-6" /> : <MenuAlt1Icon className="w-6" />}
      </button>
    </div>
  </header>
)

type Props = { items: ReactChild; feeds: ReactChild }

const DashboardLayout = ({ items, feeds }: Props) => {
  const title = "Dashboard"

  const [hideNavbar, setHideNavbar] = useState(false)

  useEffect(() => {
    setHideNavbar(window && window.innerWidth <= Number.parseInt(defaultTheme.screens.sm))
  }, [])

  return (
    <div className={clsx("flex", "flex-row", "h-screen", "overflow-hidden", "w-full")}>
      <aside
        className={clsx(
          "bg-slate-200",
          "flex",
          "flex-col",
          "h-full",
          hideNavbar && "hidden",
          "items-start",
          "justify-start",
          "shrink-0",
          "sm:w-96",
          "w-full"
        )}
      >
        <section
          className={clsx(
            "border-b",
            "border-primary",
            "flex",
            "items-center",
            "px-4",
            "py-6",
            "text-primary",
            "w-full"
          )}
        >
          <h1 className={clsx("font-bold", "text-2xl")}>{title}</h1>
          <CogIcon className={clsx("active:animate-spin", "h-7", "ml-auto", "w-auto")} />
        </section>
        <section className={clsx("flex", "flex-1", "flex-col", "w-full")}>
          <div className={clsx("border-b", "border-gray-600", "mt-6", "pb-5", "pl-4", "w-full")}>
            <p className={clsx("font-bold", "leading-4", "text-primary", "uppercase")}>Reader</p>
            <div className={clsx("pr-4", "py-2")}>{feeds}</div>
          </div>
        </section>
        <section className={clsx("flex", "flex-col", "h-32", "w-full")}>
          <Zen />
        </section>
      </aside>

      <div className="w-full">
        <Header hideNavbar={hideNavbar} setHideNavbar={setHideNavbar} />
        <main
          className={clsx("h-full", "overflow-y-scroll", "px-10", "py-4")}
          style={{ backgroundColor: "#f4f7fc" }}
        >
          {items}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
