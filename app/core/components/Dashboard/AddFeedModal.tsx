import React, { useState } from "react"
import { invalidateQuery, useMutation } from "blitz"
import { PlusIcon } from "@heroicons/react/solid"
import Form from "../Form"
import GenericModal from "../GenericModal"
import LabeledTextField from "../LabeledTextField"
import createFeed from "app/feeds/mutations/createFeed"
import getFeeds from "app/feeds/queries/getFeeds"

type Props = {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const AddFeedModal = ({ setIsOpen }: Props) => {
  const [url, setUrl] = useState<string>("")

  const [addFeed] = useMutation(createFeed)

  return (
    <GenericModal
      title={`Add a new Feed`}
      content={
        <Form
          onSubmit={() =>
            addFeed({ url })
              .then(() => invalidateQuery(getFeeds))
              .then(() => setIsOpen(false))
          }
        >
          <LabeledTextField
            name="url"
            label="url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
          />
          <button>
            <PlusIcon />
            Add Feed
          </button>
        </Form>
      }
      cancelButton={{ handler: () => setIsOpen(false), text: "Cancel" }}
    />
  )
}

export default AddFeedModal
