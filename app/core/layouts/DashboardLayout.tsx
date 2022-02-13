import React, { ReactChild, useEffect, useState } from "react"
import clsx from "clsx"
import defaultTheme from "tailwindcss/defaultTheme"
import Aside from "../components/Dashboard/Aside"
import Header from "../components/Dashboard/Header"

type Props = { items: ReactChild; feeds: ReactChild }

const DashboardLayout = ({ items, feeds }: Props) => {
  const title = "Dashboard"

  const [hideNavbar, setHideNavbar] = useState(false)

  useEffect(() => {
    setHideNavbar(window && window.innerWidth <= Number.parseInt(defaultTheme.screens.sm))
  }, [])

  return (
    <div className={clsx("flex", "flex-row", "h-screen", "overflow-hidden", "w-full")}>
      <Aside hideNavbar={hideNavbar} setHideNavbar={setHideNavbar} title={title} feeds={feeds} />

      <div className="overflow-x-clip">
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
