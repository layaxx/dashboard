import { FC } from "react"
import { invalidateQuery, useQuery } from "@blitzjs/rpc"
import { ExclamationCircleIcon, CheckCircleIcon } from "@heroicons/react/24/outline"
import clsx from "clsx"
import { ButtonProps } from "app/core/components/Button"
import getStatus from "app/feeds/queries/getStatus"
import {
  maxAcceptableAverageLoadTime,
  maxAcceptableTimeBetweenLoads,
  targetTimeBetweenLoads,
} from "lib/config/feeds/status"

type StatusButtonProps = {
  handleReload: () => Promise<unknown>
  buttonProps?: Omit<ButtonProps, "children">
}

let lastReload = -1

const StatusIcon: FC<StatusButtonProps> = ({ handleReload }) => {
  const [result, { isError }] = useQuery(
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
            })}`,
          )
          lastReload = Date.now()
          handleReload().finally(() => invalidateQuery(getStatus))
        }
      },
    },
  )

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

export default StatusIcon
