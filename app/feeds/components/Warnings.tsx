import { useEffect, useState } from "react"
import { getAntiCSRFToken, useQuery } from "blitz"
import { CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/solid"
import clsx from "clsx"
import getWarnings, { IStatusResult } from "../queries/getWarnings"
import Button from "app/core/components/Button"
import Loader from "app/core/components/Loader"

type Props = {
  result: IStatusResult
  isLoading: boolean
  isError: boolean
}

const maxAcceptableTimeBetweenLoads = 61
const maxAcceptableAverageLoadTime = 250

const WarningsIcon = ({ result, isLoading, isError }: Props) => {
  if (isLoading) {
    return <Loader />
  }

  if (isError || result.errors.length > 0) {
    return <ExclamationCircleIcon color={isError ? "gray" : "red"} />
  }

  const isAverageLoadTimeTooLong =
    (result.averageLoadTimeInMilliSeconds ?? 1000) > maxAcceptableAverageLoadTime
  const isTooMuchTimeBetweenLoads =
    result.averageMinutesBetweenLoads > maxAcceptableTimeBetweenLoads

  if (isAverageLoadTimeTooLong || isTooMuchTimeBetweenLoads) {
    return (
      <>
        <ExclamationCircleIcon color="orange" />
        {isAverageLoadTimeTooLong &&
          "Average Load time is " + result.averageLoadTimeInMilliSeconds + "ms"}
        {isTooMuchTimeBetweenLoads &&
          "Average Minutes between Loads was " + result.averageMinutesBetweenLoads}
      </>
    )
  }

  return <CheckCircleIcon color="green" />
}

const Warnings = () => {
  const [result, { isLoading, isError, refetch }] = useQuery(getWarnings, {})

  const [isLoadingRSS, setIsLoadingRSS] = useState(false)

  const handleOnForceReload = async () => {
    window
      .fetch("/api/loadRSS", {
        credentials: "include",
        headers: {
          "anti-csrf": getAntiCSRFToken(),
        },
      })
      .finally(() => setIsLoadingRSS(false))
  }

  useEffect(() => {
    if (result.minutesSinceLastLoad > maxAcceptableTimeBetweenLoads) {
      setIsLoadingRSS(true)
      handleOnForceReload().then(() => {
        setIsLoadingRSS(false)
        refetch()
      })
    }
  }, [result, refetch])

  return (
    <div className={clsx("flex", "items-center")}>
      <div className={clsx("h-6", "w-6")}>
        <WarningsIcon result={result} isLoading={isLoading} isError={isError} />
      </div>
      {isLoadingRSS ? <Loader /> : <Button onClick={handleOnForceReload}>Force Reload</Button>}
    </div>
  )
}

export default Warnings
