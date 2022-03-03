import { Suspense, useState } from "react"
import { Link, Routes, useQuery, useRouter } from "blitz"
import { PlusIcon } from "@heroicons/react/solid"
import clsx from "clsx"
import countReadlistentries from "../readlistentries/queries/countReadlistentries"
import { FeedList } from "./FeedList"
import FeedListItem from "./FeedListItem"
import AddFeedModal from "app/core/components/Dashboard/AddFeedModal"
import Loader from "app/core/components/Loader"
import { FEED_MODE } from "types"

type Props = {
  mode: FEED_MODE
}

export const FeedListContainer = ({ mode }: Props) => {
  const [readListCount] = useQuery(countReadlistentries, {}, { suspense: false })

  const [showAddModal, setShowAddModal] = useState(false)

  const { push: navigate } = useRouter()

  return (
    <ul>
      <Suspense fallback={<Loader />}>
        <FeedList mode={mode} />
      </Suspense>
      <Link href={Routes.FeedsReadingPage()}>
        <a>
          <FeedListItem
            title={"Reading List"}
            unreadCount={readListCount ?? 0}
            isActive={mode === FEED_MODE.BOOKMARKS}
            onClick={() => {
              navigate("/feeds/reading")
            }}
          />
        </a>
      </Link>
      <li
        className={clsx("cursor-pointer", "inline-flex", "mt-4")}
        onClick={() => setShowAddModal(true)}
      >
        <PlusIcon className="w-5" /> new Feed
        {showAddModal && <AddFeedModal setIsOpen={setShowAddModal} />}
      </li>
    </ul>
  )
}
