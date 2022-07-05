import { Routes, useMutation, useQuery, useRouter } from "blitz"
import clsx from "clsx"
import { Field } from "react-final-form"
import { useNotifications } from "reapop"
import Form from "app/core/components/Form"
import Loader from "app/core/components/Loader"
import createFeedMutation from "app/feeds/mutations/createFeed"
import removeFeedMutation from "app/feeds/mutations/deleteFeed"
import updateFeedMutation from "app/feeds/mutations/updateFeed"
import getFeed from "app/feeds/queries/getFeed"

type Props = { id?: number; isCreate?: boolean }

const SettingsForm = ({ id, isCreate }: Props) => {
  const [feed, { isLoading }] = useQuery(
    getFeed,
    { id },
    {
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
      enabled: !isCreate,
    }
  )

  const [createFeed] = useMutation(createFeedMutation)
  const [updateFeed] = useMutation(updateFeedMutation)
  const [removeFeed] = useMutation(removeFeedMutation)

  const router = useRouter()
  const { notify } = useNotifications()

  if (isLoading) {
    return <Loader />
  }
  if (!feed && !isCreate) {
    return <p>Invalid id provided: {id}</p>
  }

  const styledInput = (props: any) => (
    <input {...props.input} className={clsx("text-right", "w-full")} />
  )

  const submitHandler = (values: { name: string; url: string; loadIntervall: number | string }) => {
    try {
      new URL(values.url)
    } catch {
      console.error("invalid URL")
      return
    }
    if (isCreate) {
      createFeed({
        ...values,
        loadIntervall: Number.parseInt("" + values.loadIntervall, 10),
      }).then(
        () => {
          fetch("/api/loadRSS?force=true")
            .then(
              () => notify({ title: "Successfully created Feed.", status: "success" }),
              () =>
                notify({
                  title: "Successfully created Feed but failed initial Load.",
                  status: "warning",
                })
            )
            .finally(() => router.push(Routes.FeedsSettingsOverviewPage()))
        },
        (error) => {
          notify({
            title: "Failed to create Feed",
            message: "View console for additional information.",
            status: "error",
          })
          console.error(error)
        }
      )
    } else {
      updateFeed({
        id: feed!.id,
        name: values.name,
        loadIntervall: Number.parseInt("" + values.loadIntervall, 10),
        url: values.url,
      }).then(
        () => notify({ title: "Successfully updated Feed.", status: "success" }),
        (error) => {
          notify({
            title: "Failed to update Feed",
            message: "View console for additional information.",
            status: "error",
          })
          console.error(error)
        }
      )
    }
  }

  const deleteHandler = isCreate
    ? undefined
    : () =>
        removeFeed({ id: id ?? -1, removeEntries: true }).then(
          () => {
            notify({
              title: "Successfully deleted Feed",
              status: "success",
              dismissAfter: 5000,
              dismissible: true,
            })
            router.push(Routes.FeedsSettingsOverviewPage())
          },
          () =>
            notify({
              title: "Failed to delete Feed",
              status: "error",
              dismissAfter: 5000,
              dismissible: true,
            })
        )

  return (
    <div
      className={clsx(
        "bg-white",
        "border-purple-700",
        "border-solid",
        "border-t-4",
        "max-w-lg",
        "my-4",
        "px-8",
        "py-4",
        "rounded-lg",
        "shadow-lg",
        "w-full"
      )}
    >
      <Form
        onSubmit={submitHandler}
        initialValues={isCreate ? { url: "", name: "new Feed", loadIntervall: 60 } : feed}
        submitText={isCreate ? "Add new Feed" : "Update Settings"}
        deleteText="Delete"
        onDelete={deleteHandler}
      >
        <div className={clsx("flex", "flex-col", "font-semibold")}>
          <h3 className={clsx("font-semibold", "text-2xl")}>
            {isCreate ? "Add new Feed" : "Edit Settings"}
          </h3>
          <label className={clsx("flex", "flex-row")}>
            Name:{" "}
            <Field name="name" type="text">
              {styledInput}
            </Field>
          </label>

          <label className={clsx("flex", "flex-row")}>
            URL:{" "}
            <Field name="url" type="url">
              {styledInput}
            </Field>
          </label>

          <label className={clsx("flex", "flex-row")}>
            LoadIntervall:{" "}
            <Field name="loadIntervall" type="number">
              {styledInput}
            </Field>
          </label>
        </div>
      </Form>
    </div>
  )
}

export default SettingsForm
