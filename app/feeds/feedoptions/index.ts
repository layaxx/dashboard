import { FeedEntryOrdering, Feedoption, ImageHandling } from "db/generated/prisma"

export const defaultOptions: Omit<Feedoption, "id" | "createdAt" | "updatedAt"> = {
  expand: false,
  ordering: FeedEntryOrdering.NEWEST_FIRST,
  imageHandling: ImageHandling.NONE,
}
