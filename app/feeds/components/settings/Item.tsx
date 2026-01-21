import { FC } from "react"
import { Routes } from "@blitzjs/next"
import clsx from "clsx"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import Link from "next/link"
import type { Feed } from "db"

dayjs.extend(relativeTime)

interface IProps extends Feed {
  refetch: () => Promise<unknown | void>
}

const SettingsItem: FC<IProps> = ({ id, url, name, lastLoad, loadIntervall, isActive }) => {
  const classNameTH = "text-left font-bold text-slate-600 dark:text-slate-400 md:w-96 table-cell"
  const classNameTD = "pl-4 text-left table-cell dark:text-slate-200"
  const classNameTableRow = "table-row"

  return (
    <div
      className={clsx(
        isActive ? ["bg-white", "dark:bg-slate-700"] : ["bg-red-100", "dark:bg-red-900"],
        "border-purple-700",
        "border-solid",
        "border-t-4",
        "my-4",
        "px-4",
        "md:px-8",
        "py-4",
        "rounded-lg",
        "shadow-lg",
        "w-full"
      )}
      id={"feed-" + String(id)}
    >
      <div>
        <div className={clsx("flex", "flex-row", "flex-wrap")}>
          <Link
            href={Routes.FeedsSettingsPage({ id })}
            className={clsx("font-semibold", "text-gray-800", "dark:text-slate-300", "text-xl")}
          >
            {!isActive && "[inactive] "}
            {name}
          </Link>
        </div>

        <div className={clsx("table", "w-full")}>
          <div className={classNameTableRow}>
            <span className={classNameTH}>URL</span>
            <span className={classNameTD}>
              <h3 style={{ overflowWrap: "anywhere" }}>{url}</h3>
            </span>
          </div>
          <div className={classNameTableRow}>
            <span className={classNameTH}>Load Intervall</span>
            <span className={classNameTD}>
              <h3>{loadIntervall} min</h3>
            </span>
          </div>
          <div className={classNameTableRow}>
            <span className={classNameTH}>Last Load</span>
            <span className={classNameTD}>
              <h3>{dayjs(lastLoad).fromNow()}</h3>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsItem
