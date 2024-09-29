"use client"
import { FC, Suspense, useCallback, useState } from "react"
import { getAntiCSRFToken } from "@blitzjs/auth"
import { Routes } from "@blitzjs/next"
import { invalidateQuery } from "@blitzjs/rpc"
import { PlusCircleIcon } from "@heroicons/react/24/solid"
import clsx from "clsx"
import StatusIcon from "./StatusIcon"
import getFeeds from "../../queries/getFeeds"
import Button from "app/core/components/Button"
import ButtonGroup from "app/core/components/ButtonGroup"
import Loader from "app/core/components/Loader"
import { notifyPromiseAdvanced } from "app/core/hooks/notify"

const Controls: FC = () => {
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
      },
    ).finally(() => setIsLoadingRSS(false))
  }

  const handleReload = useCallback(() => handleOnForceReload(false), [])

  return (
    <div className={clsx("flex", "items-center", "w-full")}>
      <ButtonGroup notRounded>
        <Button
          icon={
            <Suspense fallback={<Loader />}>
              <StatusIcon handleReload={handleReload} />
            </Suspense>
          }
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

export default Controls
