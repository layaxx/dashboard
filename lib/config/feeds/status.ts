import process from "process"

export const maxAcceptableTimeBetweenLoads = 61
export const maxAcceptableAverageLoadTime = 500
export const targetTimeBetweenLoads = Number.parseInt(
  process.env.NEXT_PUBLIC_TARGET_TIME_BETWEEN_LOADS || "10",
  10
)
