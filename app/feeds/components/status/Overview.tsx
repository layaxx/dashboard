import { FC } from "react"
import { useQuery } from "blitz"
import { ExclamationCircleIcon } from "@heroicons/react/solid"
import clsx from "clsx"
import dayjs from "dayjs"
import StatusChart from "./StatusChart"
import StatusItem from "./StatusItem"
import StatusTable from "./Table"
import Loader from "app/core/components/Loader"
import { calculateErrorsAndWarnings, computeStatistics, Statistics } from "app/feeds/lib/status"
import getStatusDetailed from "app/feeds/queries/getStatusDetailed"
import { Status } from "db"
import tailwindConfig from "tailwind.config"

const StatusOverview: FC = () => {
  const [{ status }, { isLoading, isError }]: [
    { status: Status[] },
    { isLoading: boolean; isError: boolean }
  ] = useQuery(getStatusDetailed, {})

  if (isLoading) {
    return <Loader />
  }

  if (isError) {
    return (
      <div className={clsx("h-6", "w-6")}>
        <ExclamationCircleIcon className="text-error" />
      </div>
    )
  }

  let current = dayjs(status[status.length - 1]?.loadTime) ?? dayjs().set("minutes", 0)
  const tickValues = [current]
  while (current.isBefore(dayjs())) {
    current = current.add(1, "hour")
    tickValues.push(current)
  }

  const statusWithWarnings = status.map((stat, index, array) =>
    calculateErrorsAndWarnings(stat, array[index + 1]?.loadTime)
  )

  const statistics: Statistics = computeStatistics(statusWithWarnings)

  return (
    <>
      <StatusTable {...statistics} />
      <StatusChart
        data={statusWithWarnings.map((stat) => ({
          x: stat.loadTime,
          y: 1,
          opacity: 0.9,
          color:
            (stat.hasErrors && tailwindConfig.theme.extend.colors.error) ||
            (stat.hasWarnings && tailwindConfig.theme.extend.colors.warning) ||
            tailwindConfig.theme.extend.colors.primary,
        }))}
      />
      z
      {statusWithWarnings.map((status) => (
        <StatusItem {...status} key={status.id} />
      ))}
    </>
  )
}

export default StatusOverview
