import React, { useState } from "react"
import { Routes } from "@blitzjs/next"
import { useMutation } from "@blitzjs/rpc"
import clsx from "clsx"
import Link from "next/link"
import { ReactSortable } from "react-sortablejs"
import Button from "app/core/components/Button"
import notify from "app/core/hooks/notify"
import updateFeedMutation from "app/feeds/mutations/updateFeed"
import { Feed } from "db"

type Props = {
  feeds: Feed[]
  refetch: () => Promise<unknown>
}

const FeedReordering: React.FC<Props> = ({ feeds, refetch }) => {
  const [feedList, setFeedList] = useState<Feed[]>(feeds)
  const [updateFeed] = useMutation(updateFeedMutation)

  const anyNotInCorrectOrder = feedList.map((feed, index) => feed.position !== index).some(Boolean)
  const saveCurrentOrder = async () => {
    const newFeeds = await Promise.all(
      feedList.map(async (feed, index) => {
        return feed.position !== index
          ? updateFeed({
              position: index,
              id: feed.id,
            })
          : feed
      }),
    )
    setFeedList(newFeeds.filter((feed) => !!feed))
    await refetch()
    notify("Successfully reordered feeds", { status: "success" })
  }

  return (
    <div>
      <h2 className={clsx("font-bold", "text-2xl", "tracking-tight")}>Order of feeds:</h2>
      <ReactSortable list={feedList} setList={setFeedList}>
        {feedList.map((feed) => (
          <div
            className={clsx(
              "dark:bg-slate-700",
              "bg-white",
              "border-purple-700",
              "border-solid",
              "border-t-4",
              "my-4",
              "px-8",
              "py-4",
              "rounded-lg",
              "shadow-lg",
              "w-full",
            )}
            key={feed.id}
          >
            <div>
              <Link
                href={Routes.FeedsSettingsPage({ id: feed.id })}
                className={clsx("font-semibold", "text-gray-800", "dark:text-slate-300", "text-xl")}
              >
                {feed.name}
              </Link>
            </div>
          </div>
        ))}
      </ReactSortable>

      {anyNotInCorrectOrder && (
        <div className={clsx("flex", "justify-around", "w-full")}>
          <Button onClick={saveCurrentOrder} variant="primary">
            Save new Order
          </Button>
        </div>
      )}
    </div>
  )
}

export default FeedReordering
