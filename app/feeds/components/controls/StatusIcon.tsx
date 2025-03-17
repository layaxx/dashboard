import { FC } from "react"
import { getAntiCSRFToken } from "@blitzjs/auth"
import { invalidateQuery, useQuery } from "@blitzjs/rpc"
import { ExclamationCircleIcon, CheckCircleIcon } from "@heroicons/react/24/outline"
import clsx from "clsx"
import { ButtonProps } from "app/core/components/Button"
import { notifyPromiseAdvanced } from "app/core/hooks/notify"
import getFeeds from "app/feeds/queries/getFeeds"
import getStatus from "app/feeds/queries/getStatus"
import {
  maxAcceptableAverageLoadTime,
  maxAcceptableTimeBetweenLoads,
  targetTimeBetweenLoads,
} from "lib/config/feeds/status"

type StatusButtonProps = {
  buttonProps?: Omit<ButtonProps, "children">
}

let lastReload = -1

const handleOnReload = async () => {
  notifyPromiseAdvanced(
    () =>
      globalThis.fetch("/api/loadRSS", {
        credentials: "include",
        headers: {
          "anti-csrf": getAntiCSRFToken(),
        },
      }),
    {
      pending: { title: "Loading Feeds" },
      error: async () => ({ title: "Failed to load Feeds" }),
      success: async (response) => {
        if (!response.ok) {
          console.error(response)
          return { title: "Failed to load Feeds", status: "error" }
        }

        invalidateQuery(getFeeds)

        const { errors } = JSON.parse(await response.text())
        const hasErrors = errors && errors.length > 0
        return {
          title: "Loaded Feeds" + (hasErrors ? " (with Errors)" : ""),
          status: hasErrors ? "warning" : "success",
          message: errors,
        }
      },
    }
  )
}

const StatusIcon: FC<StatusButtonProps> = () => {
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
          // eslint-disable-next-line no-console
          console.debug(
            `Reloading due to ${JSON.stringify({
              targetTimeBetweenLoads,
              minutesSinceLastLoad: data.minutesSinceLastLoad,
            })}`
          )
          lastReload = Date.now()
          handleOnReload().finally(() => invalidateQuery(getStatus))
        }
      },
    }
  )

  if (isError || result.errors.length > 0) {
    return (
      <ExclamationCircleIcon className={clsx(!isError && ["text-error", "dark:text-red-600"])} />
    )
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
