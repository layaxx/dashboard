import { Routes } from "@blitzjs/next"
import { invoke, useMutation, useQuery } from "@blitzjs/rpc"
import clsx from "clsx"
import { FormApi } from "final-form"
import { useRouter } from "next/router"
import FormSkeleton from "./FormSkeleton"
import Form from "app/core/components/Form"
import FormField from "app/core/components/FormField"
import notify, { notifyPromise } from "app/core/hooks/notify"
import createFeedMutation from "app/feeds/mutations/createFeed"
import removeFeedMutation from "app/feeds/mutations/deleteFeed"
import updateFeedMutation from "app/feeds/mutations/updateFeed"
import getFeed from "app/feeds/queries/getFeed"
import getTitleAndTTLQuery from "app/feeds/queries/getInfoFromFeedURL"

type Props = { id?: number; isCreate?: boolean }

const SettingsForm = ({ id, isCreate }: Props) => {
  const [feed, { isFetching }] = useQuery(
    getFeed,
    { id },
    {
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
      enabled: !isCreate,
    },
  )

  const [createFeed] = useMutation(createFeedMutation)
  const [updateFeed] = useMutation(updateFeedMutation)
  const [removeFeed] = useMutation(removeFeedMutation)

  const router = useRouter()

  if (isFetching) {
    return <FormSkeleton />
  }
  if (!feed && !isCreate) {
    return <p>Invalid id provided: {id}</p>
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
            success: { title: "Created Entry" },
            error: { title: "Created Entry", message: "Failed initial fetch" },
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
          loadIntervall: Number.parseInt("" + values.loadIntervall, 10),
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

  const deleteHandler = isCreate
    ? undefined
    : () =>
        removeFeed({ id: id ?? -1, removeEntries: true }).then(
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
          <p></p>
          <FormField name="name" label="Name: " type="Text" placeholder="(can be auto-detected)" />
          <FormField
            name="loadIntervall"
            type="number"
            label="Load Intervall: "
            labelProps={{ style: { whiteSpace: "pre" } }}
          />
          {!isCreate && <FormField name="isActive" label="isActive" type="checkbox" />}
        </div>
      </Form>
    </div>
  )
}

export default SettingsForm
