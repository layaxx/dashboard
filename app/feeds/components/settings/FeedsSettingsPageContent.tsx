import React from "react"
import clsx from "clsx"
import FeedDangerZone from "./FeedDangerZone"
import FeedDetails from "./FeedDetails"
import FeedErrors from "./FeedErrors"
import FeedHistory from "./FeedHistory"
import FeedOptions from "./FeedOptions"
import Heading from "./Heading"
import type { FeedLoadEvent } from "db"
import type { FeedWithEventsAndCount } from "lib/feeds/types"

const FeedsSettingsPageContent: React.FC<{ feed: FeedWithEventsAndCount }> = ({ feed }) => {
  const errors: FeedLoadEvent[] = feed.loadEvents.filter((event) =>
    Boolean(Array.isArray(event.errors) && event.errors.length > 0)
  )

  return (
    <div className={clsx("flex", "flex-col", "w-full")}>
      <Heading level="h2">{feed.name}</Heading>

      <Heading level="h3">Details</Heading>
      <FeedDetails feed={feed} />

      <Heading level="h3">Settings</Heading>
      <FeedOptions feed={feed} />

      <Heading level="h3">Errors{errors.length > 0 ? ` (${errors.length})` : ""}</Heading>
      <FeedErrors errors={errors} />

      <Heading level="h3">History</Heading>
      <FeedHistory loadEvents={feed.loadEvents} />

      <Heading level="h3">Dangerzone</Heading>
      <FeedDangerZone feed={feed} />
    </div>
  )
}

export default FeedsSettingsPageContent
