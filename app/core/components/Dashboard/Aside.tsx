import { ReactChild } from "react"
import { CogIcon } from "@heroicons/react/solid"
import clsx from "clsx"
import Zen from "./zen"

type Props = {
  hideNavbar: boolean
  setHideNavbar: React.Dispatch<React.SetStateAction<boolean>>
  title: string
  feeds: ReactChild
}
const Aside = ({ hideNavbar, setHideNavbar, title, feeds }: Props) => (
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
      <h1
        className={clsx("font-bold", "focus:outline-none", "focus:ring-2", "text-2xl")}
        aria-label={hideNavbar ? "open" : "close"}
        onClick={() => setHideNavbar((previous) => !previous)}
      >
        {title}
      </h1>
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
)

export default Aside
