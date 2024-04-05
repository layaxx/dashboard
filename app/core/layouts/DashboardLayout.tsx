import React, { ReactChild, useEffect, useState } from "react"
import clsx from "clsx"
import Aside from "../components/Dashboard/Aside"
import Header from "../components/Dashboard/Header"

type Props = { items: ReactChild; feeds: ReactChild }

const DashboardLayout = ({ items, feeds }: Props) => {
  const title = "Dashboard"

  // eslint-disable-next-line unicorn/consistent-function-scoping
  const loadFromLocalStorage = (): boolean =>
    JSON.parse(localStorage.getItem("hideNavbar") ?? "false")

  const [hideNavbar, setHideNavbar] = useState<boolean>(false)

  useEffect(() => {
    setHideNavbar(loadFromLocalStorage())
  }, [])

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
      <div className={clsx("flex", "flex-row", "h-screen", "overflow-hidden", "w-full")}>
        <Aside
          hideNavbar={hideNavbar}
          setHideNavbar={setHideNavbarHandler}
          title={title}
          feeds={feeds}
        />

        <div className={clsx("overflow-x-clip", "w-full")}>
          <Header hideNavbar={hideNavbar} setHideNavbar={setHideNavbarHandler} />
          <main className={clsx("bg-slate-100", "h-full", "overflow-y-scroll", "md:px-10", "px-2")}>
            {items}
          </main>
        </div>
      </div>
    </>
  )
}

export default DashboardLayout
