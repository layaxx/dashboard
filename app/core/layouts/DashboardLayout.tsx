import React, { ReactChild, useEffect, useState } from "react"
import clsx from "clsx"
import Aside from "../components/Dashboard/Aside"
import Header from "../components/Dashboard/Header"
import { useSharedState } from "../hooks/store"

type Props = { items: ReactChild; feeds: ReactChild }

const DashboardLayout = ({ items, feeds }: Props) => {
  const [_, setSharedState] = useSharedState()

  // eslint-disable-next-line unicorn/consistent-function-scoping
  const loadFromLocalStorage = (): boolean =>
    JSON.parse(localStorage.getItem("hideNavbar") ?? "false")

  const [hideNavbar, setHideNavbar] = useState<boolean>(false)

  useEffect(() => {
    setHideNavbar(loadFromLocalStorage())
  }, [])

  useEffect(() => {
    setSharedState((previous) => ({ ...previous, closeAside: () => setHideNavbar(true) }))
  }, [setHideNavbar, setSharedState])

  const setHideNavbarHandler = (input: boolean | ((argument0: boolean) => boolean)) => {
    if (typeof input === "boolean") {
      localStorage.setItem("hideNavbar", JSON.stringify(input))
    } else {
      localStorage.setItem("hideNavbar", JSON.stringify(input(hideNavbar)))
    }
    setHideNavbar(input)
  }

  return (
    <>
      <div className={clsx("flex", "flex-row", "h-dvh", "overflow-hidden", "w-full")}>
        <Aside hideNavbar={hideNavbar} setHideNavbar={setHideNavbarHandler} feeds={feeds} />
        {/*  eslint-disable-next-line tailwindcss/no-arbitrary-value */}
        <div className={clsx("overflow-x-clip", hideNavbar ? "w-full" : "w-[calc(100%-24rem)]")}>
          {hideNavbar && <Header hideNavbar={hideNavbar} setHideNavbar={setHideNavbarHandler} />}
          <main
            className={clsx("bg-slate-100", "dark:bg-slate-800", "h-full", "overflow-y-scroll")}
          >
            {items}
          </main>
        </div>
      </div>
    </>
  )
}

export default DashboardLayout
