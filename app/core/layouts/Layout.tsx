import { useEffect } from "react"
import { Head, BlitzLayout, Link, useRouter } from "blitz"
import clsx from "clsx"
import NotificationsSystem, { useNotifications, setUpNotifications, atalhoTheme } from "reapop"
import Notification from "../Notification"

const Layout: BlitzLayout<{ title?: string; heading: string }> = ({ title, children, heading }) => {
  const { notifications, dismissNotification } = useNotifications()

  useEffect(() => {
    setUpNotifications({
      defaultProps: {
        position: "top-right",
        dismissible: true,
      },
    })
  }, [])

  const router = useRouter()

  return (
    <>
      <Head>
        <title>{title || "dashboard"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <NotificationsSystem
        notifications={notifications}
        dismissNotification={(id) => dismissNotification(id)}
        theme={atalhoTheme}
        components={{
          Notification,
        }}
      />

      <header className={clsx("bg-slate-600", "p-12", "text-gray-200")}>
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
          {router.asPath
            .split("/")
            .filter((element, index) => index === 0 || element)
            .map((element, index, array) => {
              const path = array.slice(0, index + 1).join("/")
              return (
                <>
                  <Link href={path || "/"} key={path}>
                    <a>{element || "Home"}</a>
                  </Link>
                  <span className="mx-2">/</span>
                </>
              )
            })}
        </nav>
      </header>
      <main className={clsx("flex", "flex-wrap", "justify-around", "m-auto", "p-8")}>
        {children}
      </main>
    </>
  )
}

export default Layout
