import { FC } from "react"
import { useQuery } from "blitz"
import { ExclamationCircleIcon } from "@heroicons/react/solid"
import clsx from "clsx"
import dayjs from "dayjs"
import { VictoryChart, VictoryBar, VictoryAxis, VictoryTheme } from "victory"
import StatusItem from "./StatusItem"
import Loader from "app/core/components/Loader"
import getStatusDetailed from "app/feeds/queries/getStatusDetailed"
import {
  maxAcceptableAverageLoadTime,
  maxAcceptableTimeBetweenLoads,
  targetTimeBetweenLoads,
} from "config/feeds/status"
import { Status } from "db"

export type StatusWithWarningsAndErrors = Status & {
  hasErrors: boolean
  hasWarnings: boolean
  loadDurationTooHigh: boolean
  timeBetweenLoadsHigherThanAverage: boolean
  timeBetweenLoadsHigherThanMax: boolean
  previousLoad: Date | undefined
  minutesSinceLastLoad: number
}

const calculateErrorsAndWarnings = (
  status: Status,
  previousLoad: Date | undefined
): StatusWithWarningsAndErrors => {
  const minutesSinceLastLoad = dayjs(status.loadTime).diff(dayjs(previousLoad), "minutes")

  const loadDurationTooHigh = status.loadDuration > maxAcceptableAverageLoadTime
  const timeBetweenLoadsHigherThanAverage = minutesSinceLastLoad > targetTimeBetweenLoads
  const hasWarnings = loadDurationTooHigh || timeBetweenLoadsHigherThanAverage

  const timeBetweenLoadsHigherThanMax = minutesSinceLastLoad > maxAcceptableTimeBetweenLoads
  const hasErrors = (status.errors && status.errors.length > 0) || timeBetweenLoadsHigherThanMax

  return {
    ...status,
    hasErrors,
    hasWarnings,
    loadDurationTooHigh,
    timeBetweenLoadsHigherThanAverage,
    timeBetweenLoadsHigherThanMax,
    previousLoad,
    minutesSinceLastLoad,
  }
}

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

  const limits = [dayjs(status[status.length - 1]?.loadTime) ?? dayjs(), dayjs()] as const
  let current = limits[0]?.set("minutes", 0)

  const tickValues = [current]

  const now = dayjs()

  while (current.isBefore(now)) {
    current = current.add(1, "hour")
    tickValues.push(current)
  }

  const statusWithWarnings = status.map((stat, index, array) =>
    calculateErrorsAndWarnings(stat, array[index + 1]?.loadTime)
  )

  return (
    <>
      <VictoryChart
        maxDomain={{
          x: dayjs().toDate() as unknown as number, // TODO: not pretty but works
        }}
        theme={VictoryTheme.material}
        height={50}
      >
        <VictoryBar
          data={statusWithWarnings.map((stat) => ({
            x: stat.loadTime,
            y: 1,
            opacity: 0.9,
            color:
              (stat.hasErrors && "var(--color-error)") ||
              (stat.hasWarnings && "var(--color-warning)") ||
              "var(--color-primary)",
          }))}
          barWidth={2}
          style={{
            data: {
              opacity: ({ datum }) => datum.opacity,
              fill: ({ datum }) => datum.color,
            },
          }}
        />
        <VictoryAxis
          tickValues={tickValues}
          tickFormat={(date) => {
            return dayjs(date).format("HH:mm")
          }}
          style={{ tickLabels: { fill: "black", fontSize: "8px" } }}
        />
      </VictoryChart>

      {statusWithWarnings.map((status) => (
        <StatusItem {...status} key={status.id} />
      ))}
    </>
  )
}

export default StatusOverview
