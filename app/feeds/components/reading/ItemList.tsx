import { useState } from "react"
import { useMutation, invalidateQuery, useInfiniteQuery } from "blitz"
import { PlusIcon } from "@heroicons/react/solid"
import { Readlistentry } from "@prisma/client"
import clsx from "clsx"
import createReadlistentry from "../../readlistentries/mutations/createReadlistentry"
import getReadlistentries from "../../readlistentries/queries/getReadlistentries"
import ReadlistItem from "./ReadlistItem"
import Button from "app/core/components/Button"
import Form from "app/core/components/Form"
import LabeledTextField from "app/core/components/LabeledTextField"
import Loader from "app/core/components/Loader"

export const ItemList = () => {
  const pageSize = 20

  const [pages, { hasNextPage, fetchNextPage, isFetchingNextPage }] = useInfiniteQuery(
    getReadlistentries,
    (input) => {
      const { take, skip } = input ?? { take: pageSize, skip: 0 }
      return { take, skip, where: { isArchived: { equals: false } } }
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
    }
  )

  const [toBeRemoved, setToBeRemoved] = useState<number[]>([])

  const [addRLE] = useMutation(createReadlistentry)

  return (
    <>
      <div>
        <Form
          onSubmit={({ url }) => {
            addRLE({ url }).then(() => invalidateQuery(getReadlistentries))
          }}
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
          ))
      )}

      <Button
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage || !!isFetchingNextPage}
        style={{ marginTop: "2rem", marginBottom: "10rem" }}
      >
        {isFetchingNextPage && <Loader />}
        {!isFetchingNextPage && (hasNextPage ? "Load More" : "Nothing more to load")}
      </Button>
    </>
  )
}
