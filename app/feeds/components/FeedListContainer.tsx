import { Suspense, useEffect, useState } from "react"
import { Link, Routes, useQuery, useRouter, getAntiCSRFToken } from "blitz"
import countReadlistentries from "../readlistentries/queries/countReadlistentries"
import { FeedList } from "./FeedList"
import FeedListItem from "./FeedListItem"
import Button from "app/core/components/Button"
import Loader from "app/core/components/Loader"
import { FEED_MODE } from "types"

type Props = {
  mode: FEED_MODE
}

export const FeedListContainer = ({ mode }: Props) => {
  const [readListCount] = useQuery(countReadlistentries, {}, { suspense: false })

  const { push: navigate } = useRouter()

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const antiCSRFToken = getAntiCSRFToken()
    window
      .fetch("/api/loadRSS", {
        credentials: "include",
        headers: {
          "anti-csrf": antiCSRFToken,
        },
      })
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <div>
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
      </ul>
      <ul>
        <li>
          {isLoading ? (
            <Loader />
          ) : (
            <Button
              onClick={() => {
                setIsLoading(true)
                const antiCSRFToken = getAntiCSRFToken()
                window
                  .fetch("/api/loadRSS?force=true", {
                    credentials: "include",
                    headers: {
                      "anti-csrf": antiCSRFToken,
                    },
                  })
                  .finally(() => setIsLoading(false))
              }}
            >
              Force Reload
            </Button>
          )}
        </li>
      </ul>
    </div>
  )
}
