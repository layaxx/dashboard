import { FC } from "react"
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid"
import clsx from "clsx"
import dayjs from "dayjs"
import duration from "dayjs/plugin/duration"
import relativeTime from "dayjs/plugin/relativeTime"
import { StatusWithWarningsAndErrors } from "lib/status"

dayjs.extend(relativeTime)
dayjs.extend(duration)

const formatterMS = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
  style: "unit",
  unit: "millisecond",
})

const formatterMinutes = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
  style: "unit",
  unit: "minute",
})

const formatterHours = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
  style: "unit",
  unit: "hour",
})

const SIXTY_MINUTES = 60

function formatDurationMinutes(durationInMinutes: number) {
  let prefix = ""
  if (durationInMinutes >= SIXTY_MINUTES) {
    const hours = Math.floor(durationInMinutes / SIXTY_MINUTES)
    prefix += formatterHours.format(hours) + " "
    durationInMinutes -= hours * SIXTY_MINUTES
  }

  return prefix + formatterMinutes.format(durationInMinutes)
}

const ListElement = ({ text, isError }: { text: string; isError?: boolean }) => {
  return (
    <li>
      <ExclamationTriangleIcon
        className={clsx(
          "h-6",
          isError ? ["text-error", "dark:text-red-600"] : "text-warning",
          "inline",
          "mr-2",
          "w-6"
        )}
      />
      <p className={clsx("break-words", "inline", "text-pretty")}>{text}</p>
    </li>
  )
}

const StatusLoadItem: FC<StatusWithWarningsAndErrors> = ({
  errors,
  loadTime,
  loadDuration,
  previousLoad,
  hasWarnings,
  hasErrors,
  minutesSinceLastLoad,
  loadDurationTooHigh,
  timeBetweenLoadsHigherThanAverage,
  timeBetweenLoadsHigherThanMax,
  insertCount,
  updateCount,
}) => {
  return (
    <div
      className={clsx(
        "dark:bg-slate-700",
        "bg-white",
        hasErrors && ["border-error", "dark:border-red-600"],
        !hasErrors && "border-purple-700",
        "border-solid",
        "border-t-4",
        hasWarnings && !hasErrors && ["border-warning", "dark:border-orange-600"],
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
            "dark:text-gray-300",
            "text-gray-800"
          )}
        >
          {dayjs(loadTime).format("DD.MM.YYYY - HH:mm")}
        </h2>
        <h3 className="dark:text-gray-400">{dayjs(loadTime).fromNow()}</h3>

        <table className="w-full">
          <tbody>
            <tr>
              <th className="text-left" scope="row">
                Duration of Load
              </th>
              <td className="text-right">{formatterMS.format(loadDuration)}</td>
            </tr>
            <tr>
              <th className="text-left" scope="row">
                Since previous load
              </th>
              <td className="text-right">
                {previousLoad ? formatDurationMinutes(minutesSinceLastLoad) : "not available"}
              </td>
            </tr>
            <tr>
              <th className="text-left" scope="row">
                Items inserted / updated
              </th>
              <td className="text-right">
                {insertCount} / {updateCount}
              </td>
            </tr>
          </tbody>
        </table>
        {(hasErrors || hasWarnings) && (
          <ul className="mt-2">
            {loadDurationTooHigh && <ListElement text="Load Duration exceeded threshold." />}
            {timeBetweenLoadsHigherThanAverage && !timeBetweenLoadsHigherThanMax && (
              <ListElement text="Load interval exceeded expectation." />
            )}
            {timeBetweenLoadsHigherThanMax && (
              <ListElement isError text="Load interval exceeded maximum threshold." />
            )}
            {errors.map((error) => (
              <ListElement key={error} isError text={"Error: " + error} />
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
export default StatusLoadItem
