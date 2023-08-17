import { Feed } from "@prisma/client"

export enum LoadFeedStatus {
  SKIPPED = "skipped",
  UPDATED = "updated",
  ERROR = "error",
}

export type LoadFeedResult = {
  status: LoadFeedStatus
  statusMessage?: string
  errorMessage?: string
  changes?: { updated: number; created: number; ignored: number }
}

export type Result = LoadFeedResult & Feed

export type HandleItemResult = { updated: number; created: number; ignored: number }
