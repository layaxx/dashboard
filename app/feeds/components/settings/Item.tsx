import { FC } from "react"
import { Link, Routes, useMutation } from "blitz"
import { Feed } from "@prisma/client"
import clsx from "clsx"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { useNotifications } from "reapop"
import Button from "app/core/components/Button"
import removeFeedMutation from "app/feeds/mutations/deleteFeed"
import readAllItemsInFeedMutation from "app/feeds/mutations/readAllItemsInFeed"

dayjs.extend(relativeTime)

interface IProps extends Feed {
  refetch: () => Promise<any | void>
}

const SettingsItem: FC<IProps> = ({ id, url, name, lastLoad, loadIntervall, refetch }) => {
  const classNameTH = "text-left font-bold text-slate-600 md:w-64 table-cell"
  const classNameTD = "pl-4 text-left table-cell"
  const classNameTableRow = "table-row"

  const [removeFeed] = useMutation(removeFeedMutation)
  const [readAllItemsInFeed] = useMutation(readAllItemsInFeedMutation)

  const { notify } = useNotifications()

  const handleDeleteFeed = () =>
    removeFeed({ id, removeEntries: true }).then(
      () => refetch().then(() => notify({ title: "Successfully removed feed", status: "success" })),
      (error) => {
        console.error(error)
        notify({ title: "Failed removed feed", status: "error" })
      }
    )
  const handleMarkAllAsRead = () =>
    readAllItemsInFeed({ feedId: id }).then(
      () =>
        notify({
          title: "Success!",
          message: `Marked all entries of ${url} as read`,
          status: "success",
        }),
      (error) => {
        console.error(error)
        notify({
          title: "Failure",
          message: `Marked all entries of ${url} as read`,
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
        <Link href={Routes.FeedsSettingsPage({ id })}>
          <a className={clsx("font-semibold", "text-gray-800", "text-xl")}>{name}</a>
        </Link>

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
