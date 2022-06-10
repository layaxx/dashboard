import { Link, Routes, useQuery } from "blitz"
import { PlusIcon } from "@heroicons/react/solid"
import clsx from "clsx"
import getFeeds from "../../queries/getFeeds"
import SettingsItem from "./Item"
import Button from "app/core/components/Button"

const SettingsOverview = () => {
  const [{ feeds }] = useQuery(getFeeds, undefined, {
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
  })

  return (
    <>
      {feeds.map((feed) => (
        <SettingsItem {...feed} key={feed.id} />
      ))}

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
