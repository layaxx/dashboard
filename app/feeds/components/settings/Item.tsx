import { FC } from "react"
import { Routes } from "@blitzjs/next"
import { useMutation } from "@blitzjs/rpc"
import { Feed } from "@prisma/client"
import clsx from "clsx"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import Link from "next/link"
import Button from "app/core/components/Button"
import notify from "app/core/hooks/notify"
import removeFeedMutation from "app/feeds/mutations/deleteFeed"
import readAllItemsInFeedMutation from "app/feeds/mutations/readAllItemsInFeed"
import updateFeedMutation from "app/feeds/mutations/updateFeed"

dayjs.extend(relativeTime)

interface IProps extends Feed {
  refetch: () => Promise<any | void>
}

const SettingsItem: FC<IProps> = ({
  id,
  url,
  name,
  lastLoad,
  loadIntervall,
  isActive,
  refetch,
}) => {
  const classNameTH = "text-left font-bold text-slate-600 md:w-64 table-cell"
  const classNameTD = "pl-4 text-left table-cell"
  const classNameTableRow = "table-row"

  const [removeFeed] = useMutation(removeFeedMutation)
  const [readAllItemsInFeed] = useMutation(readAllItemsInFeedMutation)
  const [updateFeed] = useMutation(updateFeedMutation)

  const handleDeleteFeed = () =>
    removeFeed({ id, removeEntries: true }).then(
      () => refetch().then(() => notify("Successfully removed feed", { status: "success" })),
      (error) => {
        console.error(error)
        notify("Failed removed feed", { status: "error" })
      }
    )
  const handleMarkAllAsRead = () =>
    readAllItemsInFeed({ feedId: id }).then(
      () =>
        notify("Success!", {
          message: `Marked all entries of ${url} as read`,
          status: "success",
        }),
      (error) => {
        console.error(error)
        notify("Failure", {
          message: `Failed to mark all entries of ${url} as read`,
          status: "error",
        })
      }
    )

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
        <div className={clsx("flex", "flex-row", "flex-wrap")}>
          <Link
            href={Routes.FeedsSettingsPage({ id })}
            className={clsx("font-semibold", "text-gray-800", "text-xl")}
          >
            {name}
          </Link>
          {!isActive && (
            <Button
              onClick={() =>
                updateFeed({ id, isActive: true }).then(() => {
                  notify("Successfully reactivated Feed", { status: "success" })
                  refetch()
                })
              }
            >
              Reactivate
            </Button>
          )}
        </div>

        <div className={clsx("flex", "flex-row", "flex-wrap")}>
          <div className={clsx("table", "md:w-3/4")}>
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

          <div className={clsx("flex", "md:flex-col", "flex-row", "md:flex-wrap", "md:w-1/4")}>
            <Button onClick={handleMarkAllAsRead}>Mark all as read</Button>
            <Button variant="danger" onClick={handleDeleteFeed}>
              Delete Feed
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsItem
