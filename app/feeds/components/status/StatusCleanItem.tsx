import { FC } from "react"
import { StatusClean } from "@prisma/client"
import clsx from "clsx"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

const formatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
  style: "unit",
  unit: "millisecond",
})

dayjs.extend(relativeTime)

const StatusCleanItem: FC<StatusClean> = ({ time, duration }) => {
  return (
    <div
      className={clsx(
        "dark:bg-slate-700",
        "bg-white",
        "border-purple-700",
        "border-solid",
        "border-t-4",
        "max-w-sm",
        "my-2",
        "md:my-6",
        "px-4",
        "md:px-8",
        "py-2",
        "md:py-4",
        "rounded-lg",
        "shadow-lg",
        "w-full"
      )}
    >
      <div>
        <h2
          className={clsx(
            "font-semibold",
            "text-2xl",
            "md:text-3xl",
            "text-gray-800",
            "dark:text-slate-300"
          )}
        >
          {dayjs(time).format("DD.MM.YYYY - HH:mm")}
        </h2>
        <h3 className="dark:text-gray-400">{dayjs(time).fromNow()}</h3>

        <table className="w-full">
          <tbody>
            <tr>
              <th className="text-left" scope="row">
                Cleaning Duration
              </th>
              <td className="text-right">{formatter.format(duration)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
export default StatusCleanItem
