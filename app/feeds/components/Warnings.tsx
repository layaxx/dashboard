"use client"
import { FC, ReactElement, useState } from "react"
import { getAntiCSRFToken } from "@blitzjs/auth"
import { Routes } from "@blitzjs/next"
import { invalidateQuery, useQuery } from "@blitzjs/rpc"
import { CheckCircleIcon, ExclamationCircleIcon, PlusCircleIcon } from "@heroicons/react/24/solid"
import clsx from "clsx"
import { twMerge } from "tailwind-merge"
import getFeeds from "../queries/getFeeds"
import getStatus, { IStatusResult } from "../queries/getStatus"
import Button from "app/core/components/Button"
import ButtonGroup from "app/core/components/ButtonGroup"
import Loader from "app/core/components/Loader"
import { notifyPromiseAdvanced } from "app/core/hooks/notify"
import {
  maxAcceptableAverageLoadTime,
  maxAcceptableTimeBetweenLoads,
  targetTimeBetweenLoads,
} from "lib/config/feeds/status"

type Props = {
  result: IStatusResult
  isLoading: boolean
  isError: boolean
}

let lastReload = -1

const WarningsIcon = ({ result, isLoading, isError }: Props) => {
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

const Warnings = () => {
  const [isLoadingRSS, setIsLoadingRSS] = useState(false)

  const handleOnForceReload = async (force: boolean) => {
    setIsLoadingRSS(true)

    notifyPromiseAdvanced(
      () =>
        window.fetch("/api/loadRSS" + (force ? "?force=true" : ""), {
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
    ).finally(() => setIsLoadingRSS(false))
  }

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
          handleOnForceReload(false).finally(() => invalidateQuery(getStatus))
        }
      },
    }
  )

  return (
    <div className={clsx("flex", "items-center", "w-full")}>
      <ButtonGroup notRounded>
        <Button
          icon={<WarningsIcon result={result} isLoading={isLoading} isError={isError} />}
          href={Routes.FeedsStatusPage()}
        >
          Status
        </Button>

        <Button onClick={() => handleOnForceReload(true)} disabled={isLoadingRSS}>
          Force Reload
        </Button>

        <Button icon={<PlusCircleIcon className="text-success" />} href={Routes.FeedsAddPage()}>
          Add
        </Button>
      </ButtonGroup>
    </div>
  )
}

export default Warnings
