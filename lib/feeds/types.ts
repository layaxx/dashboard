import type { Feed, FeedLoadEvent, Feedoption } from "db"

export enum LoadFeedStatus {
  SKIPPED = "skipped",
  UPDATED = "updated",
  ERROR = "error",
}

export type LoadFeedResult = {
  status: LoadFeedStatus
  statusMessage?: string
  errorMessage?: string
  changes?: { createdIds: string[]; updatedIds: string[]; ignored: number }
}

export type Result = { result: LoadFeedResult; feed: Feed }

export type HandleItemResult = { updated: number; created: number; ignored: number }

export type FeedWithEventsAndCount = Feed & {
  loadEvents: FeedLoadEvent[]
  _count: { entries: number }
  options: Feedoption
}
