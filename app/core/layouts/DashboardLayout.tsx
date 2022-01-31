import React, { ReactChild, Suspense } from "react"
import Loader from "../components/Loader"
import UserInfo from "../components/UserInfo"
import DashboardGreeting from "app/core/components/DashboardGreeting"

type Props = { items: ReactChild; feeds: ReactChild }

const DashboardLayout = ({ items, feeds }: Props) => {
  const title = "Dashboard"

  return (
    <>
      <div className="min-h-screen flex">
        <aside className="py-10 w-1/3 ">
          <div className="flex px-10 space-2 items-center border-b-2 pb-4">
            <h1 className="text-3xl font-bold text-primary">{title}</h1>
          </div>

          <div className="px-10 py-8">{feeds}</div>

          <div className="flex mt-20 space-x-4 items-center px-10">
            <Suspense fallback={<Loader />}>
              <UserInfo />
            </Suspense>
          </div>
        </aside>

        <div className="py-10 px-10 w-2/3" style={{ backgroundColor: "#f4f7fc" }}>
          <header>
            <Suspense fallback={<Loader />}>
              <DashboardGreeting />
            </Suspense>
          </header>

          <main>{items}</main>
        </div>
      </div>
    </>
  )
}

export default DashboardLayout
