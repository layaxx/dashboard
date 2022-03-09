import { Suspense } from "react"
import { MenuIcon, MenuAlt1Icon } from "@heroicons/react/solid"
import clsx from "clsx"
import Loader from "../Loader"
import DashboardGreeting from "./Greeting"

type HeaderProps = {
  hideNavbar: boolean
  setHideNavbar: React.Dispatch<React.SetStateAction<boolean>>
}
const Header = ({ hideNavbar, setHideNavbar }: HeaderProps) => (
  <header
    className={clsx(
      "bg-slate-300",
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

export default Header
