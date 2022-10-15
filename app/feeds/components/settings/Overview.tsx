import { useEffect, useState } from "react"
import { Routes } from "@blitzjs/next"
import { useMutation, useQuery } from "@blitzjs/rpc"
import { PlusIcon } from "@heroicons/react/solid"
import { Feed } from "@prisma/client"
import clsx from "clsx"
import Link from "next/link"
import { ReactSortable } from "react-sortablejs"
import SettingsItem from "./Item"
import Button from "app/core/components/Button"
import notify from "app/core/hooks/notify"
import updateFeedMutation from "app/feeds/mutations/updateFeed"
import getFeeds from "app/feeds/queries/getFeeds"

const SettingsOverview = () => {
  const [{ feeds }, { refetch }] = useQuery(getFeeds, undefined, {
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  })

  const [list, setList] = useState<Feed[]>(feeds)

  const [updateFeed] = useMutation(updateFeedMutation)

  const anyNotInCorrectOrder = list.map((feed, index) => feed.position !== index).some(Boolean)
  const saveCurrentOrder = async (deletedIndex?: number) => {
    const hasDeletedIndex = typeof deletedIndex === "number"

    await Promise.all(
      list.map((feed, index) => {
        if (feed.position !== index || (hasDeletedIndex && index > deletedIndex)) {
          return updateFeed({
            position: hasDeletedIndex && index > deletedIndex ? index - 1 : index,
            id: feed.id,
          })
        }
      })
    )
    await refetch()
    notify("Successfully reordered feeds", { status: "success" })
  }

  useEffect(() => setList(feeds), [feeds])

  return (
    <>
      <Link href={Routes.FeedsAddPage()}>
        <a>
          <Button icon={<PlusIcon />}>Add new Feed</Button>
        </a>
      </Link>

      <Button
        onClick={() =>
          notify("default", {
            dismissAfter: 5555,
            status: "loading",
            message: "A bit longer of a message that shall be displayed",
          })
        }
      >
        TEST {/* TODO: DELETE ME */}
      </Button>

      <div className="w-full">
        {(feeds as Feed[]).map((feed, index) => (
          <SettingsItem {...feed} key={feed.id} refetch={async () => saveCurrentOrder(index)} />
        ))}
      </div>
      <div>
        <h2 className={clsx("font-bold", "text-2xl", "tracking-tight")}>Order of feeds:</h2>
        <ReactSortable list={list} setList={setList}>
          {list.map((feed) => (
            <div
              className={clsx(
                "bg-white",
                "border-purple-700",
                "border-solid",
                "border-t-4",
                "my-4",
                "px-8",
                "py-4",
                "rounded-lg",
                "shadow-lg",
                "w-full"
              )}
              key={feed.id}
            >
              <div>
                <Link href={Routes.FeedsSettingsPage({ id: feed.id })}>
                  <a className={clsx("font-semibold", "text-gray-800", "text-xl")}>{feed.name}</a>
                </Link>
              </div>
            </div>
          ))}
        </ReactSortable>

        {anyNotInCorrectOrder && (
          <div className={clsx("flex", "place-content-center")}>
            <Button onClick={() => saveCurrentOrder()} variant="primary">
              Save new Order
            </Button>
          </div>
        )}
      </div>
    </>
  )
}

export default SettingsOverview
