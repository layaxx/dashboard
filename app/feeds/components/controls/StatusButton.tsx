import { FC } from "react"
import { Routes } from "@blitzjs/next"
import { invalidateQuery, useQuery } from "@blitzjs/rpc"
import { ExclamationCircleIcon, CheckCircleIcon } from "@heroicons/react/24/outline"
import clsx from "clsx"
import Button, { ButtonProps } from "app/core/components/Button"
import Loader from "app/core/components/Loader"
import getStatus, { IStatusResult } from "app/feeds/queries/getStatus"
import {
  maxAcceptableAverageLoadTime,
  maxAcceptableTimeBetweenLoads,
  targetTimeBetweenLoads,
} from "lib/config/feeds/status"

type WarningsIconProps = {
  result: IStatusResult
  isLoading: boolean
  isError: boolean
}

type StatusButtonProps = {
  handleReload: () => Promise<unknown>
  buttonProps?: Omit<ButtonProps, "children">
}

let lastReload = -1

const WarningsIcon: FC<WarningsIconProps> = ({ result, isLoading, isError }) => {
  if (isLoading) {
    return <Loader />
  }

  if (isError || result.errors.length > 0) {
    return <ExclamationCircleIcon className={clsx(!isError && "text-error")} />
  }

  const isAverageLoadTimeTooLong =
    result.averageLoadTimeInMilliSeconds > maxAcceptableAverageLoadTime
  const isTooMuchTimeBetweenLoads =
    result.averageMinutesBetweenLoads > maxAcceptableTimeBetweenLoads

  if (isAverageLoadTimeTooLong || isTooMuchTimeBetweenLoads) {
    return <ExclamationCircleIcon className="text-warning" />
  }

  return <CheckCircleIcon className="text-success" />
}

const StatusButton: FC<StatusButtonProps> = ({ handleReload, buttonProps }) => {
  const [result, { isLoading, isError }] = useQuery(
    getStatus,
    {},
    {
      onSuccess: (data) => {
        // eslint-disable-next-line no-magic-numbers
        const thirtySeconds = 30 * 1000
        const durationSinceLastReload = Date.now() - lastReload
        if (
          (lastReload === -1 || durationSinceLastReload > thirtySeconds) &&
          data.minutesSinceLastLoad > targetTimeBetweenLoads
        ) {
          console.log(
            `Reloading due to ${JSON.stringify({
              targetTimeBetweenLoads,
              minutesSinceLastLoad: data.minutesSinceLastLoad,
            })}`
          )
          lastReload = Date.now()
          handleReload().finally(() => invalidateQuery(getStatus))
        }
      },
    }
  )

  return (
    <Button
      icon={<WarningsIcon result={result} isLoading={isLoading} isError={isError} />}
      href={Routes.FeedsStatusPage()}
      {...(buttonProps ?? {})}
    >
      Status
    </Button>
  )
}

export default StatusButton
