"use client"
import { FC, Suspense, useEffect, useState } from "react"
import { Routes } from "@blitzjs/next"
import { CogIcon, PlusCircleIcon } from "@heroicons/react/24/solid"
import clsx from "clsx"
import StatusIcon from "./StatusIcon"
import Button from "app/core/components/Button"
import ButtonGroup from "app/core/components/ButtonGroup"
import Loader from "app/core/components/Loader"
import { useSharedState } from "app/core/hooks/store"
import { ALL_FEEDS_ID } from "lib/config/feeds/feedIDs"

const Controls: FC = () => {
  const [{ activeFeedID }] = useSharedState()
  const [hasAttached, setHasAttached] = useState(false)
  useEffect(() => {
    setHasAttached(true)
  }, [])

  return (
    <div className={clsx("flex", "items-center", "w-full")}>
      <ButtonGroup notRounded>
        <Button
          icon={
            <Suspense fallback={<Loader />}>
              <StatusIcon />
            </Suspense>
          }
          href={Routes.FeedsStatusPage()}
        >
          Status
        </Button>

        <Button
          href={
            hasAttached && activeFeedID !== ALL_FEEDS_ID
              ? Routes.FeedsSettingsPage({ id: activeFeedID })
              : Routes.FeedsSettingsOverviewPage()
          }
          icon={<CogIcon />}
        >
          Settings
        </Button>

        <Button
          icon={<PlusCircleIcon className={clsx("dark:text-green-600", "text-success")} />}
          href={Routes.FeedsAddPage()}
        >
          Add
        </Button>
      </ButtonGroup>
    </div>
  )
}

export default Controls
