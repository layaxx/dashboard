import { FC } from "react"
import { StatusClean } from "@prisma/client"
import clsx from "clsx"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { formatToTwoDigits } from "lib/status"

dayjs.extend(relativeTime)

const StatusCleanItem: FC<StatusClean> = ({ time, duration }) => {
  return (
    <div
      className={clsx(
        "bg-white",
        "border-purple-700",
        "border-solid",
        "border-t-4",
        "max-w-md",
        "my-12",
        "px-8",
        "py-4",
        "rounded-lg",
        "shadow-lg"
      )}
    >
      <div>
        <h2 className={clsx("font-semibold", "text-3xl", "text-gray-800")}>
          {dayjs(time).format("DD.MM.YYYY - HH:mm")}
        </h2>
        <h3>{dayjs(time).fromNow()}</h3>

        <table className="w-full">
          <tbody>
            <tr>
              <th className="text-left" scope="row">
                Duration of Load
              </th>
              <td className="text-right">{formatToTwoDigits(duration)} ms</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
export default StatusCleanItem
