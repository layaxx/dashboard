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

export type Result = LoadFeedResult & {
  name: string
  id: number
}

export type HandleItemResult = { updated: number; created: number; ignored: number }
