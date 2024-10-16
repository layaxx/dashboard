import React, { ReactNode, useState } from "react"
import { invalidateQuery, useMutation, useQuery } from "@blitzjs/rpc"
import { FormApi, SubmissionErrors } from "final-form"
import { Field } from "react-final-form"
import SettingsTable from "./SettingsTable"
import Form from "app/core/components/Form"
import MinimalFormField from "app/core/components/MinimalFormField"
import { notifyPromise } from "app/core/hooks/notify"
import createFeedoptionMutation from "app/feedoptions/mutations/createFeedoption"
import updateFeedoptionMutation from "app/feedoptions/mutations/updateFeedoption"
import getFeed from "app/feeds/queries/getFeed"
import { FeedWithEventsAndCount } from "lib/feeds/types"

const FeedOptions: React.FC<{ feed: FeedWithEventsAndCount }> = ({ feed: initialData }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [updateFeedOption] = useMutation(updateFeedoptionMutation)
  const [createFeedOption] = useMutation(createFeedoptionMutation)

  const [feed] = useQuery(getFeed, { id: initialData.id }, { initialData })

  const relevantOptions = feed.options

  const rows: Array<[string, ReactNode]> = [
    ["Ordering", relevantOptions.oldestFirst ? "Oldest first" : "Newest first"],
    ["Auto-expansion", relevantOptions.expand ? "On" : "Off"],
  ]

  const rowsEdit: Array<[string, ReactNode]> = [
    [
      "Ordering",
      <Field
        key="ordering"
        name="ordering"
        component={(props) => (
          <select className="w-full" {...props.input}>
            <option value="oldestFirst">Oldest first</option>
            <option value="newestFirst">Newest first</option>
          </select>
        )}
      />,
    ],
    ["Auto-expansion", <MinimalFormField key="autoExpand" name="autoExpand" type="checkbox" />],
  ]

  return (
    <>
      <Form
        onSubmit={(
          values: { autoExpand: boolean; ordering: "newestFirst" | "oldestFirst" },
          form: FormApi<any, Partial<any>>,
        ): SubmissionErrors | void => {
          if (form.getState().pristine) {
            return setIsEditing(false)
          }

          const action =
            feed.options.id !== -1
              ? updateFeedOption({
                  id: feed.options!.id,
                  expand: values.autoExpand,
                  oldestFirst: values.ordering === "oldestFirst",
                })
              : createFeedOption({
                  id: feed.id,
                  expand: values.autoExpand,
                  oldestFirst: values.ordering === "oldestFirst",
                })

          notifyPromise(action, {
            pending: { title: "Updating Options" },
            success: { title: "Updated Options" },
            error: { title: "Failed to update Options" },
          })
            .then(() => invalidateQuery(getFeed, { id: feed.id }))
            .finally(() => setIsEditing(false))
        }}
        initialValues={{
          autoExpand: relevantOptions.expand,
          ordering: relevantOptions.oldestFirst ? "oldestFirst" : "newestFirst",
        }}
        submitText={isEditing ? "Save" : undefined}
        resetText={isEditing ? "Cancel" : "Edit"}
        onReset={() => setIsEditing((old) => !old)}
      >
        <SettingsTable rows={isEditing ? rowsEdit : rows} />
      </Form>
    </>
  )
}

export default FeedOptions
