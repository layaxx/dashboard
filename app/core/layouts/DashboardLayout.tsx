import React, { ReactChild, useEffect, useState } from "react"
import clsx from "clsx"
import NotificationsSystem, { atalhoTheme, useNotifications, setUpNotifications } from "reapop"
import defaultTheme from "tailwindcss/defaultTheme"
import Aside from "../components/Dashboard/Aside"
import Header from "../components/Dashboard/Header"
import Notification from "app/core/Notification"

type Props = { items: ReactChild; feeds: ReactChild }

const DashboardLayout = ({ items, feeds }: Props) => {
  const title = "Dashboard"

  const [hideNavbar, setHideNavbar] = useState(false)

  const { notifications, dismissNotification } = useNotifications()

  useEffect(() => {
    setHideNavbar(window && window.innerWidth <= Number.parseInt(defaultTheme.screens.sm, 10))
    setUpNotifications({
      defaultProps: {
        position: "top-right",
        dismissible: true,
      },
    })
  }, [])

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
        <Aside hideNavbar={hideNavbar} setHideNavbar={setHideNavbar} title={title} feeds={feeds} />

        <div className={clsx("overflow-x-clip", "w-full")}>
          <Header hideNavbar={hideNavbar} setHideNavbar={setHideNavbar} />
          <main className={clsx("bg-slate-100", "h-full", "overflow-y-scroll", "px-10")}>
            {items}
          </main>
        </div>
      </div>
    </>
  )
}

export default DashboardLayout
