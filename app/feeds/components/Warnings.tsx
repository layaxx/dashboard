import { useEffect, useState } from "react"
import { getAntiCSRFToken } from "@blitzjs/auth"
import { Routes } from "@blitzjs/next"
import { invalidateQuery, useQuery } from "@blitzjs/rpc"
import { CheckCircleIcon, ExclamationCircleIcon, PlusCircleIcon } from "@heroicons/react/solid"
import clsx from "clsx"
import Link from "next/link"
import getFeeds from "../queries/getFeeds"
import getStatus, { IStatusResult } from "../queries/getStatus"
import Button from "app/core/components/Button"
import Loader from "app/core/components/Loader"
import notify from "app/core/hooks/notify"
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
    return (
      <>
        <ExclamationCircleIcon className="text-warning" />
      </>
    )
  }

  return <CheckCircleIcon className="text-success" />
}

const Warnings = () => {
  const [result, { isLoading, isError, refetch }] = useQuery(getStatus, {})

  const [isLoadingRSS, setIsLoadingRSS] = useState(false)

  const handleOnForceReload = async (force: boolean) => {
    window
      .fetch("/api/loadRSS" + (force ? "?force=true" : ""), {
        credentials: "include",
        headers: {
          "anti-csrf": getAntiCSRFToken(),
        },
      })
      .then(
        async (response) => {
          if (!response.ok) {
            notify("Failed to load Feeds", { status: "error" })
            console.error(response)
            return
          }
          const { errors } = JSON.parse(await response.text())
          invalidateQuery(getFeeds)
          notify("Loaded Feeds" + (errors && errors.length > 0 ? " (with Errors)" : ""), {
            status: "success",
            message: errors,
          })
        },
        (error) => {
          notify("Failed to load Feeds", { status: "error" })
          console.error(error)
        }
      )
      .finally(() => setIsLoadingRSS(false))
  }

  useEffect(() => {
    if (result.minutesSinceLastLoad > targetTimeBetweenLoads) {
      setIsLoadingRSS(true)
      handleOnForceReload(false).then(() => {
        setIsLoadingRSS(false)
        refetch()
      })
    }
  }, [result, refetch])

  return (
    <div className={clsx("flex", "items-center", "w-full")}>
      <Link href={Routes.FeedsStatusPage()}>
        <a>
          <Button icon={<WarningsIcon result={result} isLoading={isLoading} isError={isError} />}>
            Status
          </Button>
        </a>
      </Link>
      {isLoadingRSS ? (
        <Loader />
      ) : (
        <Button onClick={() => handleOnForceReload(true)}>Force Reload</Button>
      )}

      <Link href={Routes.FeedsAddPage()}>
        <a>
          <Button icon={<PlusCircleIcon className="text-success" />}>Add</Button>
        </a>
      </Link>
    </div>
  )
}

export default Warnings
