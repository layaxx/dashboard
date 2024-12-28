import React, { ReactNode, useState } from "react"
import { invalidateQuery, useMutation, useQuery } from "@blitzjs/rpc"
import dayjs from "dayjs"
import { SubmissionErrors } from "final-form"
import { z } from "zod"
import SettingsTable from "./SettingsTable"
import Form from "app/core/components/form"
import MinimalFormField from "app/core/components/form/fields/MinimalFormField"
import { notifyPromise } from "app/core/hooks/notify"
import updateFeedMutation from "app/feeds/mutations/updateFeed"
import getFeed from "app/feeds/queries/getFeed"
import { FeedWithEventsAndCount } from "lib/feeds/types"

const FeedDetails: React.FC<{ feed: FeedWithEventsAndCount }> = ({ feed: initialData }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [updateFeed] = useMutation(updateFeedMutation)

  const [feed] = useQuery(getFeed, { id: initialData.id }, { initialData })

  const rows: Array<[string, ReactNode]> = [
    ["Name", feed.name],
    ["Feed-URL", feed.url],
    ["Number of unread entries", feed._count.entries],
    ["Last updated", dayjs(feed.updatedAt).format("DD.MM.YYYY - HH:mm")],
    ["Load interval target", feed.loadIntervall + " minutes"],
    ["is active", feed.isActive ? "Yes" : "No"],
  ]

  const rowsEdit: Array<[string, ReactNode]> = [
    ["Name", <MinimalFormField key="name" name="name" type="text" />],
    ["Feed-URL", <MinimalFormField key="url" name="url" type="text" />],
    ["Number of unread entries", feed._count.entries],
    ["Last updated", dayjs(feed.updatedAt).format("DD.MM.YYYY - HH:mm")],
    [
      "Load interval target",
      <MinimalFormField key="loadIntervall" name="loadIntervall" type="number" />,
    ],
    ["is active", <MinimalFormField key="isActive" name="isActive" type="checkbox" />],
  ]

  return (
    <>
      <Form
        schema={z.object({
          name: z.string(),
          isActive: z.boolean(),
          url: z.string(),
          loadIntervall: z.number(),
        })}
        onSubmit={(values, form): SubmissionErrors | void => {
          if (form.getState().pristine) {
            return setIsEditing(false)
          }

          if (!values.name) {
            console.error("Name is required")
            return { name: "Name is required" }
          }
          try {
            new URL(values.url)
          } catch {
            console.error("invalid URL")
            return { url: "Invalid URL" }
          }
          // eslint-disable-next-line no-magic-numbers
          if (values.loadIntervall < 5) {
            console.error("Load interval must be at least 5")
            return { loadIntervall: "Load interval must be at least 5" }
          }

          notifyPromise(
            updateFeed({
              id: feed!.id,
              name: values.name,
              loadIntervall:
                typeof values.loadIntervall === "number"
                  ? values.loadIntervall
                  : Number.parseInt(values.loadIntervall, 10),
              url: values.url,
              isActive: values.isActive,
            }),
            {
              pending: { title: "Updating Feed" },
              success: { title: "Updated Feed" },
              error: { title: "Failed to update Feed" },
            },
          )
            .then(() => invalidateQuery(getFeed, { id: feed.id }))
            .finally(() => setIsEditing(false))
        }}
        initialValues={feed}
        submitText={isEditing ? "Save" : undefined}
        resetText={isEditing ? "Cancel" : "Edit"}
        onReset={() => setIsEditing((old) => !old)}
      >
        <SettingsTable rows={isEditing ? rowsEdit : rows} />
      </Form>
    </>
  )
}

export default FeedDetails
