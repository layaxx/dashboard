import { useEffect, useState } from "react"
import { invalidateQuery, Link, Routes, useMutation, useQuery } from "blitz"
import { PlusIcon } from "@heroicons/react/solid"
import { Feed } from "@prisma/client"
import clsx from "clsx"
import { ReactSortable } from "react-sortablejs"
import { useNotifications } from "reapop"
import SettingsItem from "./Item"
import Button from "app/core/components/Button"
import updateFeedMutation from "app/feeds/mutations/updateFeed"
import getFeeds from "app/feeds/queries/getFeeds"

const SettingsOverview = () => {
  const [{ feeds }] = useQuery(getFeeds, undefined, {
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  })

  const [list, setList] = useState<Feed[]>(feeds)

  const [updateFeed] = useMutation(updateFeedMutation)

  const anyNotInCorrectOrder = list.map((feed, index) => feed.position !== index).some(Boolean)
  const { notify } = useNotifications()

  const saveCurrentOrder = async () => {
    await Promise.all(
      list.map((feed, index) => {
        if (feed.position !== index) {
          return updateFeed({ position: index, id: feed.id })
        }
      })
    )
    invalidateQuery(getFeeds)
    notify({ title: "Successfully reordered feeds", status: "success" })
  }

  useEffect(() => setList(feeds), [feeds])

  return (
    <>
      <div className="w-full">
        <ReactSortable list={list} setList={setList}>
          {list.map((feed) => (
            <SettingsItem {...feed} key={feed.id} />
          ))}
        </ReactSortable>

        {anyNotInCorrectOrder && (
          <div className={clsx("flex", "place-content-center")}>
            <Button onClick={saveCurrentOrder} variant="primary">
              Save new Order
            </Button>
          </div>
        )}
      </div>

      <div
        className={clsx(
          "bg-white",
          "border-purple-700",
          "border-solid",
          "border-t-4",
          "flex",
          "my-8",
          "place-content-center",
          "px-8",
          "py-4",
          "rounded-lg",
          "shadow-lg"
        )}
      >
        <Link href={Routes.FeedsAddPage()}>
          <a>
            <Button icon={<PlusIcon />}>Add new Feed</Button>
          </a>
        </Link>
      </div>
    </>
  )
}

export default SettingsOverview
