import { FC } from "react"
import { ExclamationIcon } from "@heroicons/react/solid"
import clsx from "clsx"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { StatusWithWarningsAndErrors } from "./Overview"

dayjs.extend(relativeTime)

const format = (number: number): string => number.toFixed(2)

const ListElement = ({ text, isError }: { text: string; isError?: boolean }) => {
  return (
    <li className="flex">
      <ExclamationIcon className={clsx("h-6", isError ? "text-error" : "text-warning", "w-6")} />{" "}
      {text}
    </li>
  )
}

const StatusItem: FC<StatusWithWarningsAndErrors> = ({
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
}) => {
  return (
    <div
      className={clsx(
        "bg-white",
        hasErrors && "border-error",
        "border-purple-700",
        "border-solid",
        "border-t-4",
        hasWarnings && "border-warning",
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
          {dayjs(loadTime).format("DD.MM.YYYY - HH:mm")}
        </h2>
        <h3>{dayjs(loadTime).fromNow()}</h3>

        <table className="w-full">
          <tbody>
            <tr>
              <th className="text-left" scope="row">
                Duration of Load
              </th>
              <td className="text-right">{format(loadDuration)} ms</td>
            </tr>
            <tr>
              <th className="text-left" scope="row">
                Number of Errors
              </th>
              <td className="text-right">{errors.length}</td>
            </tr>
            <tr>
              <th className="text-left" scope="row">
                Time since previous load
              </th>
              <td className="text-right">
                {previousLoad ? minutesSinceLastLoad + " min" : "not available"}
              </td>
            </tr>
          </tbody>
        </table>
        {(hasErrors || hasWarnings) && (
          <ul>
            {loadDurationTooHigh && <ListElement text="load Duration is too high" />}
            {timeBetweenLoadsHigherThanAverage && !timeBetweenLoadsHigherThanMax && (
              <ListElement text="time between Loads is higher than average" />
            )}
            {errors && errors.length > 0 && <ListElement isError text="Has Errors" />}
            {timeBetweenLoadsHigherThanMax && (
              <ListElement isError text="time between Loads is higher than max" />
            )}
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
export default StatusItem
