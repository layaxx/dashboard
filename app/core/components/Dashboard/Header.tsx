import { Suspense } from "react"
import { Bars3Icon, Bars3CenterLeftIcon } from "@heroicons/react/24/solid"
import clsx from "clsx"
import DashboardGreeting from "./Greeting"
import Loader from "../Loader"

type HeaderProps = {
  hideNavbar: boolean
  setHideNavbar: (argument0: boolean | ((argument0_: boolean) => boolean)) => void
}
const Header = ({ hideNavbar, setHideNavbar }: HeaderProps) => (
  <header
    className={clsx(
      "bg-slate-300",
      "flex",
      "items-center",
      "justify-between",
      "px-4",
      "py-6",
      "rounded-r",
      "text-primary",
      "w-full"
    )}
    onClick={() => setHideNavbar((previous) => !previous)}
  >
    <div>
      <Suspense fallback={<Loader />}>
        <DashboardGreeting />
      </Suspense>
    </div>

    <div aria-label="toggler" className={clsx("flex", "items-center", "justify-center")}>
      <button
        aria-label={hideNavbar ? "open" : "close"}
        className={clsx("focus:outline-none", "focus:ring-2")}
      >
        {hideNavbar ? <Bars3Icon className="w-6" /> : <Bars3CenterLeftIcon className="w-6" />}
      </button>
    </div>
  </header>
)

export default Header
