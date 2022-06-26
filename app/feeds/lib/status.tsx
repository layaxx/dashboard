import dayjs from "dayjs"
import { Status } from "db"
import {
  maxAcceptableAverageLoadTime,
  targetTimeBetweenLoads,
  maxAcceptableTimeBetweenLoads,
} from "lib/config/feeds/status"

export type StatusWithWarningsAndErrors = Status & {
  hasErrors: boolean
  hasWarnings: boolean
  loadDurationTooHigh: boolean
  timeBetweenLoadsHigherThanAverage: boolean
  timeBetweenLoadsHigherThanMax: boolean
  previousLoad: Date | undefined
  minutesSinceLastLoad: number
}

export type Statistics = {
  sumLoadDuration: number
  sumTimeSinceLastLoad: number
  countWarnings: number
  countErrors: number
  sumUpdateCount: number
  sumInsertCount: number
  firstLoad: Date | undefined
  count: number
}

export const calculateErrorsAndWarnings = (
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

export const formatToTwoDigits = (number: number): string => number.toFixed(2)

export const computeStatistics = (
  statusWithWarnings: StatusWithWarningsAndErrors[]
): Statistics => {
  return {
    ...statusWithWarnings.reduce(
      (previous, current) => ({
        sumLoadDuration: previous.sumLoadDuration + current.loadDuration,
        sumTimeSinceLastLoad: previous.sumTimeSinceLastLoad + current.minutesSinceLastLoad,
        countWarnings: previous.countWarnings + (current.hasWarnings ? 1 : 0),
        countErrors: previous.countErrors + (current.hasErrors ? 1 : 0),
        sumUpdateCount: previous.sumUpdateCount + current.updateCount,
        sumInsertCount: previous.sumInsertCount + current.insertCount,
      }),
      {
        sumLoadDuration: 0,
        sumTimeSinceLastLoad: 0,
        countWarnings: 0,
        countErrors: 0,
        sumUpdateCount: 0,
        sumInsertCount: 0,
      }
    ),
    firstLoad: statusWithWarnings[0]?.loadTime,
    count: statusWithWarnings.length,
  }
}
