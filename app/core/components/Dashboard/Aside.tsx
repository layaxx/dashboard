import { ReactChild, Suspense } from "react"
import { Routes } from "@blitzjs/next"
import { CogIcon } from "@heroicons/react/24/solid"
import clsx from "clsx"
import Link from "next/link"
import Zen from "./zen"
import Loader from "../Loader"
import { useSharedState } from "app/core/hooks/store"
import Warnings from "app/feeds/components/Warnings"
import version from "lib/config/version"

type Props = {
  hideNavbar: boolean
  setHideNavbar: React.Dispatch<React.SetStateAction<boolean>>
  title: string
  feeds: ReactChild
}
const Aside = ({ hideNavbar, setHideNavbar, title, feeds }: Props) => {
  const [{ activeFeedID }] = useSharedState()
  return (
    <aside
      className={clsx(
        "bg-slate-300",
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
        onClick={() => setHideNavbar((previous) => !previous)}
      >
        <h1
          className={clsx("font-bold", "mr-auto", "focus:outline-none", "focus:ring-2", "text-2xl")}
          aria-label={hideNavbar ? "open" : "close"}
          title={version || "unknown version"}
        >
          {title}
        </h1>
        <Link
          href={{ ...Routes.FeedsSettingsOverviewPage(), hash: "feed-" + activeFeedID }}
          passHref
        >
          <CogIcon className={clsx("active:animate-spin", "h-7")} />
        </Link>
      </section>
      <section className={clsx("flex", "flex-1", "flex-col", "w-full")}>
        <div className={clsx("border-b", "border-gray-600", "mt-6", "pb-5", "pl-4", "w-full")}>
          <p className={clsx("font-bold", "leading-4", "text-primary", "uppercase")}>Reader</p>
          <div className={clsx("pr-4", "py-2")}>{feeds}</div>
        </div>
      </section>
      <section>
        <Suspense fallback={<Loader />}>
          <Warnings />
        </Suspense>
      </section>
      <section className={clsx("flex", "flex-col", "h-32", "w-full")}>
        <Zen />
      </section>
    </aside>
  )
}

export default Aside
