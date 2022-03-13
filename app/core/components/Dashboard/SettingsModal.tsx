import React from "react"
import { useMutation, invalidateQuery } from "blitz"
import { PlusIcon } from "@heroicons/react/solid"
import clsx from "clsx"
import { useNotifications } from "reapop"
import GenericModal from "../GenericModal"
import { LabeledTextField } from "../LabeledTextField"
import { Form } from "app/core/components/Form"
import { useSharedState } from "app/core/hooks/store"
import createFeed from "app/feeds/mutations/createFeed"
import getFeeds from "app/feeds/queries/getFeeds"

type Props = {
  setIsSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const SettingsModal = ({ setIsSettingsOpen }: Props) => {
  const [{ activeFeedID }] = useSharedState()

  const [addFeed] = useMutation(createFeed)

  const { notify } = useNotifications()

  return (
    <GenericModal
      title={`Editing Settings for Feed ${activeFeedID}`}
      confirmButton={{ handler: console.log, text: "Save Settings" }}
      cancelButton={{ handler: () => setIsSettingsOpen(false), text: "Cancel" }}
    >
      <p className={clsx("text-gray-500", "text-sm")}>
        Are you sure you want to deactivate your account? All of your data will be permanently
        removed. This action cannot be undone.
      </p>
      <Form
        onSubmit={async ({ url }) => {
          try {
            await addFeed({ url })
            notify({
              status: "success",
              title: "Successfully added new Feed",
              dismissAfter: 5000,
              dismissible: true,
            })
            invalidateQuery(getFeeds)
          } catch {
            notify({
              status: "error",
              title: "Failed to add new Feed",
              dismissAfter: 5000,
              dismissible: true,
            })
          }
        }}
        submitText="Add Feed"
        submitIcon={<PlusIcon />}
      >
        <LabeledTextField name="url" label="url" placeholder="Feed URL" />
      </Form>
    </GenericModal>
  )
}

export default SettingsModal
