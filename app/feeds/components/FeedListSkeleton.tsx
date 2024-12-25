import { FC } from "react"
import clsx from "clsx"
import { FeedListItemBadge, FeedListItemWrapper } from "./FeedListItem"

const FeedListSkeleton: FC = () => {
  return (
    <>
      <FeedListItemWrapper>Recently Read</FeedListItemWrapper>
      <FeedListItemWrapper>
        <span className="grow">All Feeds</span>{" "}
        <FeedListItemBadge className={clsx("animate-pulse", "w-10")} />
      </FeedListItemWrapper>
      {Array.from({ length: 3 }, (_, id) => (
        <FeedListItemWrapper key={id} className="h-8">
          <span
            className={clsx("animate-pulse", "bg-slate-200", "dark:bg-slate-600", "h-6", "w-full")}
          ></span>
        </FeedListItemWrapper>
      ))}
    </>
  )
}

export default FeedListSkeleton
