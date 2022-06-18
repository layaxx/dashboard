import { FC } from "react"
import { useQuery } from "blitz"
import { ExclamationCircleIcon } from "@heroicons/react/solid"
import clsx from "clsx"
import StatusChart from "./StatusChart"
import StatusItem from "./StatusItem"
import StatusTable from "./Table"
import Loader from "app/core/components/Loader"
import { calculateErrorsAndWarnings, computeStatistics } from "app/feeds/lib/status"
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

  const statusWithWarnings = status.map((stat, index, array) =>
    calculateErrorsAndWarnings(stat, array[index + 1]?.loadTime)
  )

  const statistics = computeStatistics(statusWithWarnings)

  return (
    <>
      <StatusChart
        data={statusWithWarnings.map(
          ({ insertCount, updateCount, loadTime, hasErrors, hasWarnings }) => ({
            x: loadTime,
            insertCount,
            updateCount,
            color:
              (hasErrors && tailwindConfig.theme.extend.colors.error) ||
              (hasWarnings && tailwindConfig.theme.extend.colors.warning) ||
              tailwindConfig.theme.extend.colors.primary,
          })
        )}
      />
      <StatusTable {...statistics} />
      {statusWithWarnings.map((status) => (
        <StatusItem {...status} key={status.id} />
      ))}
    </>
  )
}

export default StatusOverview
