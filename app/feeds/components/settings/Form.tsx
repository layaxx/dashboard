import { Routes } from "@blitzjs/next"
import { invoke, useMutation } from "@blitzjs/rpc"
import clsx from "clsx"
import { FormApi } from "final-form"
import { useRouter } from "next/router"
import CustomErrorComponent from "app/core/components/CustomErrorComponent"
import Form from "app/core/components/Form"
import FormField from "app/core/components/FormField"
import notify, { notifyPromise } from "app/core/hooks/notify"
import createFeedMutation from "app/feeds/mutations/createFeed"
import removeFeedMutation from "app/feeds/mutations/deleteFeed"
import updateFeedMutation from "app/feeds/mutations/updateFeed"
import getTitleAndTTLQuery from "app/feeds/queries/getInfoFromFeedURL"
import { Feed } from "db"

type Props = { feed?: Feed; isCreate?: boolean }

const SettingsForm = ({ feed, isCreate }: Props) => {
  const [createFeed] = useMutation(createFeedMutation)
  const [updateFeed] = useMutation(updateFeedMutation)
  const [removeFeed] = useMutation(removeFeedMutation)

  const router = useRouter()

  if (!feed && !isCreate) {
    return <CustomErrorComponent statusCode={404} message="Feed not found" />
  }

  const submitHandler = async (
    values: { name: string; url: string; loadIntervall: number | string; isActive: boolean },
    form: FormApi,
  ) => {
    try {
      new URL(values.url)
    } catch {
      console.error("invalid URL")
      return { url: "Invalid URL" }
    }
    if (isCreate) {
      const shouldGetNameFromFeed: boolean = form.getFieldState("name")?.pristine ?? true
      if (shouldGetNameFromFeed) {
        let hasError = false
        const [title, ttl] = await invoke(getTitleAndTTLQuery, { url: values.url }).catch(() => {
          notify("Failed to fetch from url.", { status: "error" })
          hasError = true
          return [undefined, undefined]
        })
        if (hasError) {
          return { url: "Failed to fetch from URL" }
        }
        if (title) {
          values.name = title
        }
        if (ttl && (typeof ttl === "number" || Number.parseInt(ttl, 10))) {
          values.loadIntervall = ttl
        }
      }
      createFeed({
        ...values,
        loadIntervall: Number.parseInt("" + values.loadIntervall, 10),
      }).then(
        () => {
          notifyPromise(fetch("/api/loadRSS?force=true"), {
            pending: { title: "Fetching Entries" },
            success: { title: "Created Feed" },
            error: { title: "Created Feed", message: "Failed initial fetch" },
          }).finally(() => router.push(Routes.FeedsSettingsOverviewPage()))
        },
        (error) => {
          notify("Failed to create Feed", {
            message: "View console for additional information.",
            status: "error",
          })
          console.error(error)
        },
      )
    } else {
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
          error: { title: "Failed to update FeedEntry" },
        },
      )
    }
  }

  const deleteHandler =
    isCreate || !feed
      ? undefined
      : () =>
          removeFeed({ id: feed.id, removeEntries: true }).then(
            () => {
              notify("Successfully deleted Feed", {
                status: "success",
              })
              router.push(Routes.FeedsSettingsOverviewPage())
            },
            () =>
              notify("Failed to delete Feed", {
                status: "error",
              }),
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
        "w-full",
      )}
    >
      <Form
        onSubmit={submitHandler}
        initialValues={isCreate ? { url: "", name: "", loadIntervall: 60 } : feed}
        submitText={isCreate ? "Add new Feed" : "Update Settings"}
        deleteText="Delete"
        onDelete={deleteHandler}
      >
        <div className={clsx("flex", "flex-col", "font-semibold")}>
          <h3 className={clsx("font-semibold", "text-2xl")}>
            {isCreate ? "Add new Feed" : "Edit Settings"}
          </h3>
          <FormField
            required
            name="url"
            type="url"
            label="URL: "
            placeholder="https://example.com/feed.xml"
          />
          <FormField
            required
            name="name"
            label="Name: "
            type="Text"
            placeholder="(can be auto-detected)"
          />
          <FormField
            name="loadIntervall"
            type="number"
            label="Load Intervall: "
            labelProps={{ className: "mb-4" }}
          />
          {!isCreate && <FormField name="isActive" label="is active:" type="checkbox" />}
        </div>
      </Form>
    </div>
  )
}

export default SettingsForm
