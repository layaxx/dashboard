import { FC } from "react"
import { Routes } from "@blitzjs/next"
import { useMutation } from "@blitzjs/rpc"
import { Feed } from "@prisma/client"
import clsx from "clsx"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import Link from "next/link"
import Button from "app/core/components/Button"
import ButtonGroup from "app/core/components/ButtonGroup"
import notify from "app/core/hooks/notify"
import removeFeedMutation from "app/feeds/mutations/deleteFeed"
import readAllItemsInFeedMutation from "app/feeds/mutations/readAllItemsInFeed"

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

  const handleDeleteFeed = () =>
    removeFeed({ id, removeEntries: true }).then(
      () => refetch().then(() => notify("Successfully removed feed", { status: "success" })),
      (error) => {
        console.error(error)
        notify("Failed removed feed", { status: "error" })
      },
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
          message: `Failed to mark some/all entries of ${url} as read`,
          status: "error",
        })
      },
    )

  return (
    <div
      className={clsx(
        isActive ? "bg-white" : "bg-red-100",
        "border-purple-700",
        "border-solid",
        "border-t-4",
        "my-4",
        "px-4",
        "md:px-8",
        "py-4",
        "rounded-lg",
        "shadow-lg",
        "w-full",
      )}
      id={"feed-" + String(id)}
    >
      <div>
        <div className={clsx("flex", "flex-row", "flex-wrap")}>
          <Link
            href={Routes.FeedsSettingsPage({ id })}
            className={clsx("font-semibold", "text-gray-800", "text-xl")}
          >
            {!isActive && "[inactive] "}
            {name}
          </Link>
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

          <div className={clsx("flex", "md:flex-col", "md:w-1/4", "w-full")}>
            <ButtonGroup notRounded>
              <Button onClick={handleMarkAllAsRead}>Mark all as read</Button>
              <Button variant="danger" onClick={handleDeleteFeed}>
                Delete Feed
              </Button>
            </ButtonGroup>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsItem
