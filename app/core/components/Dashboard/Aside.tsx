import { ReactChild } from "react"
import { ErrorBoundary, Routes } from "@blitzjs/next"
import { CogIcon } from "@heroicons/react/24/solid"
import clsx from "clsx"
import dynamic from "next/dynamic"
import Link from "next/link"
import Zen from "./zen"
import { useSharedState } from "app/core/hooks/store"
import Controls from "app/feeds/components/controls"
import version from "lib/config/version"

const ClientSideSettingsLink = dynamic(
  async () => () => {
    const [{ activeFeedID }] = useSharedState()
    return (
      <Link href={{ ...Routes.FeedsSettingsOverviewPage(), hash: "feed-" + activeFeedID }} passHref>
        <CogIcon
          onClickCapture={(event) => {
            event.stopPropagation()
          }}
          className={clsx("active:animate-spin", "h-7")}
        />
      </Link>
    )
  },
  { ssr: false, loading: () => <CogIcon className="h-7" /> }
)

type Props = {
  hideNavbar: boolean
  setHideNavbar: React.Dispatch<React.SetStateAction<boolean>>
  title: string
  feeds: ReactChild
}
const Aside = ({ hideNavbar, setHideNavbar, title, feeds }: Props) => (
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
      <ClientSideSettingsLink />
    </section>
    <section className={clsx("grow", "overflow-y-hidden", "pt-6", "w-full")}>
      <div
        className={clsx(
          "border-b",
          "border-gray-600",
          "h-full",
          "overflow-y-hidden",
          "pl-4",
          "w-full"
        )}
      >
        <p className={clsx("font-bold", "leading-4", "text-primary", "uppercase")}>Reader</p>
        <div className={clsx("h-full", "overflow-y-auto", "pb-5", "pr-4", "py-2")}>{feeds}</div>
      </div>
    </section>
    <section className="w-full">
      <Controls />
    </section>
    <section className={clsx("flex", "flex-col", "h-32", "w-full")}>
      <ErrorBoundary
        fallbackRender={({ resetErrorBoundary }) => {
          resetErrorBoundary()
          return <></>
        }}
      >
        <Zen />
      </ErrorBoundary>
    </section>
  </aside>
)

export default Aside
