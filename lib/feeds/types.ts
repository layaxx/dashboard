export type LoadFeedResult = {
  error: string | undefined
  updated: number
  created: number
  ignored: number
}

export type Result = {
  name: string
  id: number
  changes: LoadFeedResult
}
