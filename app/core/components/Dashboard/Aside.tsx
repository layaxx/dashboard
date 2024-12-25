import { ReactChild } from "react"
import clsx from "clsx"
import Header from "./Header"
import Zen from "./zen"
import Controls from "app/feeds/components/controls"

type Props = {
  hideNavbar: boolean
  setHideNavbar: React.Dispatch<React.SetStateAction<boolean>>
  feeds: ReactChild
}
const Aside = ({ hideNavbar, setHideNavbar, feeds }: Props) => (
  <aside
    className={clsx(
      "bg-slate-300",
      "dark:bg-slate-700",
      "flex",
      "flex-col",
      "h-full",
      hideNavbar && "hidden",
      "items-start",
      "justify-start",
      "shrink-0",
      "sm:w-96",
      "w-full",
    )}
  >
    <section className={clsx("border-b", "border-primary", "dark:border-violet-400", "w-full")}>
      <Header hideNavbar={hideNavbar} setHideNavbar={setHideNavbar} />
    </section>

    <section className={clsx("grow", "overflow-y-hidden", "pt-6", "w-full")}>
      <div
        className={clsx(
          "border-b",
          "border-gray-600",
          "h-full",
          "overflow-y-hidden",
          "pl-4",
          "w-full",
        )}
      >
        <p
          className={clsx(
            "font-bold",
            "leading-4",
            "text-primary",
            "dark:text-violet-400",
            "uppercase",
          )}
        >
          Reader
        </p>
        <div className={clsx("h-full", "overflow-y-auto", "pb-5", "pr-4", "py-2")}>{feeds}</div>
      </div>
    </section>
    <section className="w-full">
      <Controls />
    </section>
    <section className={clsx("flex", "flex-col", "h-32", "w-full")}>
      <Zen />
    </section>
  </aside>
)

export default Aside
