import { FeedEntryOrdering } from "db"

export const defaultOptions: { expand: boolean; ordering: FeedEntryOrdering } = {
  expand: false,
  ordering: FeedEntryOrdering.NEWEST_FIRST,
}
