import { Link, Routes } from "blitz"
import { Feed } from "@prisma/client"
import clsx from "clsx"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

dayjs.extend(relativeTime)

const SettingsItem = (feed: Feed) => {
  return (
    <div
      className={clsx(
        "bg-white",
        "border-purple-700",
        "border-solid",
        "border-t-4",
        "my-4",
        "px-8",
        "py-4",
        "rounded-lg",
        "shadow-lg",
        "w-full"
      )}
    >
      <div>
        <Link href={Routes.FeedsSettingsPage({ id: feed.id })}>
          <a className={clsx("font-semibold", "text-gray-800", "text-xl")}>{feed.name}</a>
        </Link>
        <div className={clsx("flex", "justify-between")}>
          <h3 className={clsx("text-left", "w-1/2")} style={{ overflowWrap: "anywhere" }}>
            {feed.url}
          </h3>
          <h3 className={clsx("text-center", "w-1/4")}>{feed.loadIntervall} min</h3>
          <h3 className={clsx("text-right", "w-1/4")}>{dayjs(feed.lastLoad).fromNow()}</h3>
        </div>
      </div>
    </div>
  )
}

export default SettingsItem
