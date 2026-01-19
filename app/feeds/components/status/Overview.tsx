"use client"
import { FC, useEffect, useState } from "react"
import { useQuery } from "@blitzjs/rpc"
import { ExclamationCircleIcon } from "@heroicons/react/24/solid"
import clsx from "clsx"
import StatusChart from "./StatusChart"
import StatusCleanItem from "./StatusCleanItem"
import StatusLoadItem from "./StatusLoadItem"
import StatusTable from "./Table"
import Loader from "app/core/components/Loader"
import getStatusDetailed from "app/feeds/queries/getStatusDetailed"
import { calculateErrorsAndWarnings, computeStatistics } from "lib/status"

const StatusOverview: FC = () => {
  const [result, { isLoading, isError }] = useQuery(getStatusDetailed, {})

  const [isDarkMode, setMode] = useState(
    globalThis.matchMedia("(prefers-color-scheme: dark)").matches
  )

  useEffect(() => {
    globalThis
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (event) => setMode(event.matches))
  }, [])

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

  const statusWithWarnings = result.statusLoad.map((stat, index, array) =>
    calculateErrorsAndWarnings(stat, array[index + 1]?.loadTime)
  )

  const statistics = computeStatistics(statusWithWarnings)

  return (
    <div className="w-full">
      <div
        className={clsx("flex", "flex-row", "flex-wrap", "justify-around", "max-w-4xl", "mx-auto")}
      >
        <StatusChart
          isDarkMode={isDarkMode}
          data={statusWithWarnings.map(
            ({ insertCount, updateCount, loadTime, hasErrors, hasWarnings }) => ({
              x: loadTime,
              insertCount,
              updateCount,
              color: (hasErrors && "error") || (hasWarnings && "warning") || "default",
            })
          )}
        />
        <StatusTable {...statistics} />
      </div>

      <div
        className={clsx("flex", "flex-row", "flex-wrap", "justify-around", "max-w-7xl", "mx-auto")}
      >
        <h2
          className={clsx("font-bold", "mt-4", "text-2xl", "md:text-3xl", "text-center", "w-full")}
        >
          Recent Feed Loading Events
        </h2>
        {statusWithWarnings.map((status) => (
          <StatusLoadItem {...status} key={status.id} />
        ))}

        <h2
          className={clsx("font-bold", "mt-4", "text-2xl", "md:text-3xl", "text-center", "w-full")}
        >
          Recent Cleaning Events
        </h2>
        {result.statusClean.map((status) => (
          <StatusCleanItem {...status} key={status.id} />
        ))}
      </div>
    </div>
  )
}

export default StatusOverview
