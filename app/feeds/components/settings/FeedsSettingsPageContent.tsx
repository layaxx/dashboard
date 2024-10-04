import React, { ReactNode } from "react"
import clsx from "clsx"
import dayjs from "dayjs"
import FeedHistory from "./FeedHistory"
import Heading from "./Heading"
import SettingsTable from "./SettingsTable"
import { FeedLoadEvent } from "db"
import { FeedWithEventsAndCount } from "lib/feeds/types"

const FeedsSettingsPageContent: React.FC<{ feed: FeedWithEventsAndCount }> = ({ feed }) => {
  const errors: FeedLoadEvent[] = feed.loadEvents.filter((event) =>
    Boolean(Array.isArray(event.errors) && event.errors.length > 0),
  )

  if (!feed.options) {
    feed.options = {
      expand: false,
      oldestFirst: false,
      id: -1,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  }

  const rows: Array<[string, ReactNode]> = [
    ["Name", feed.name],
    ["Feed-URL", feed.url],
    ["Number of unread entries", feed._count.entries],
    ["Last updated", dayjs(feed.updatedAt).format("DD.MM.YYYY - HH:mm")],
    ["Load interval target", feed.loadIntervall + " minutes"],
    ["is active", feed.isActive ? "Yes" : "No"],
  ]

  const settingsRows: Array<[string, ReactNode]> = [
    ["Ordering", feed.options.oldestFirst ? "Oldest first" : "Newest first"],
    ["Auto-expansion", feed.options.expand ? "On" : "Off"],
  ]

  return (
    <div className={clsx("flex", "flex-col", "w-full")}>
      <Heading level="h2">{feed.name}</Heading>

      <Heading level="h3">Details</Heading>
      <SettingsTable rows={rows} />

      <Heading level="h3">Settings</Heading>
      <SettingsTable rows={settingsRows} />

      <Heading level="h3">Errors{errors.length > 0 ? ` (${errors.length})` : ""}</Heading>
      {errors.length === 0 ? (
        <p>Great, there have been not errors with this feed in the past!</p>
      ) : (
        errors.map((error) => (
          <div key={error.id}>
            <p>[{dayjs(error.createdAt).format("DD.MM.YYYY - HH:mm")}]</p>
            <pre className="overflow-auto">
              {JSON.stringify(JSON.parse(error.errors[0] ?? "unknown error"), undefined, 2)}
            </pre>
          </div>
        ))
      )}

      <Heading level="h3">History</Heading>
      <FeedHistory loadEvents={feed.loadEvents} />
    </div>
  )
}

export default FeedsSettingsPageContent
