import React, { ReactChild, useEffect, useState } from "react"
import clsx from "clsx"
import NotificationsSystem, { atalhoTheme, useNotifications, setUpNotifications } from "reapop"

import Aside from "../components/Dashboard/Aside"
import Header from "../components/Dashboard/Header"
import Notification from "app/core/Notification"

type Props = { items: ReactChild; feeds: ReactChild }

const DashboardLayout = ({ items, feeds }: Props) => {
  const title = "Dashboard"

  // eslint-disable-next-line unicorn/consistent-function-scoping
  const loadFromLocalStorage = (): boolean =>
    JSON.parse(localStorage.getItem("hideNavbar") ?? "false")

  const [hideNavbar, setHideNavbar] = useState<boolean>(false)

  const { notifications, dismissNotification } = useNotifications()

  useEffect(() => {
    setHideNavbar(loadFromLocalStorage())
    setUpNotifications({
      defaultProps: {
        position: "top-right",
        dismissible: true,
        dismissAfter: 5000,
        status: "info",
        allowHTML: false,
        showDismissButton: false,
      },
    })
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
      <NotificationsSystem
        notifications={notifications}
        dismissNotification={(id) => dismissNotification(id)}
        theme={atalhoTheme}
        components={{
          Notification,
        }}
      />
      <div className={clsx("flex", "flex-row", "h-screen", "overflow-hidden", "w-full")}>
        <Aside
          hideNavbar={hideNavbar}
          setHideNavbar={setHideNavbarHandler}
          title={title}
          feeds={feeds}
        />

        <div className={clsx("overflow-x-clip", "w-full")}>
          <Header hideNavbar={hideNavbar} setHideNavbar={setHideNavbarHandler} />
          <main className={clsx("bg-slate-100", "h-full", "overflow-y-scroll", "px-10")}>
            {items}
          </main>
        </div>
      </div>
    </>
  )
}

export default DashboardLayout
