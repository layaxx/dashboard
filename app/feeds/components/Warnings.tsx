import { useQuery } from "blitz"
import { CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/solid"
import clsx from "clsx"
import getWarnings from "../queries/getWarnings"
import Loader from "app/core/components/Loader"

const WarningsIcon = () => {
  const [{ warnings }, { isLoading, isError }] = useQuery(getWarnings, {})

  if (isLoading) {
    return <Loader />
  }

  if (isError || warnings.length > 0) {
    return <ExclamationCircleIcon color={isError ? "gray" : "red"} />
  }

  return <CheckCircleIcon color="green" />
}

const Warnings = () => {
  return (
    <div className={clsx("h-6", "w-6")}>
      <WarningsIcon />
    </div>
  )
}

export default Warnings
