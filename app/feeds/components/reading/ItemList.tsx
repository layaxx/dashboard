"use client"
import { useState } from "react"
import { useInfiniteQuery } from "@blitzjs/rpc"
import { Readlistentry } from "@prisma/client"
import clsx from "clsx"
import ReadlistItem from "./ReadlistItem"
import Button from "app/core/components/Button"
import Loader from "app/core/components/Loader"
import getReadlistentries from "app/feeds/readlistentries/queries/getReadlistentries"

export const ItemList = () => {
  const pageSize = 20

  const [pages, { hasNextPage, fetchNextPage, isFetchingNextPage }] = useInfiniteQuery(
    getReadlistentries,
    (input) => {
      return {
        take: input?.take ?? pageSize,
        skip: input?.skip ?? 0,
        where: { isArchived: { equals: false } },
      }
    },
    {
      getNextPageParam: ({ nextPage }) => nextPage,
    }
  )

  const [toBeRemoved, setToBeRemoved] = useState<number[]>([])

  return (
    <>
      {pages.map(({ readlistentries }) =>
        readlistentries
          .filter(({ id }) => !toBeRemoved.includes(id))
          .map(({ url, id }: Readlistentry) => (
            <ReadlistItem
              key={id}
              id={id}
              url={url}
              hide={() => setToBeRemoved((previous) => [...previous, id])}
              unhide={() =>
                setToBeRemoved((previous) => previous.filter((argument) => argument !== id))
              }
            />
          ))
      )}

      <Button
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage || !!isFetchingNextPage}
        className={clsx("mb-40", "md:ml-10", "ml-2", "mt-8")}
      >
        {isFetchingNextPage && <Loader />}
        {!isFetchingNextPage && (hasNextPage ? "Load More" : "Nothing more to load")}
      </Button>
    </>
  )
}
