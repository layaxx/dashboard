"use client"
import { useState } from "react"
import { useMutation, useInfiniteQuery } from "@blitzjs/rpc"
import { PlusIcon } from "@heroicons/react/24/solid"
import { Readlistentry } from "@prisma/client"
import clsx from "clsx"
import ReadlistItem from "./ReadlistItem"
import Button from "app/core/components/Button"
import Form from "app/core/components/Form"
import LabeledTextField from "app/core/components/LabeledTextField"
import Loader from "app/core/components/Loader"
import createReadlistentry from "app/feeds/readlistentries/mutations/createReadlistentry"
import getReadlistentries from "app/feeds/readlistentries/queries/getReadlistentries"

export const ItemList = () => {
  const pageSize = 20

  const [pages, { hasNextPage, fetchNextPage, isFetchingNextPage, refetch }] = useInfiniteQuery(
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
    },
  )

  const [toBeRemoved, setToBeRemoved] = useState<number[]>([])

  const [addReadlistEntry] = useMutation(createReadlistentry)

  return (
    <>
      <div className="md:px-10">
        <Form
          onSubmit={({ url }, form) =>
            addReadlistEntry({ url }).then(() => {
              refetch()
              form.reset()
            })
          }
          className={clsx("flex", "flex-wrap", "items-end")}
        >
          <LabeledTextField name="url" label="url" />
          <Button icon={<PlusIcon />} type="submit">
            Add a new item
          </Button>
        </Form>
      </div>

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
          )),
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
