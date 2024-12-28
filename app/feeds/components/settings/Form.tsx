import { Routes } from "@blitzjs/next"
import { invoke, useMutation } from "@blitzjs/rpc"
import clsx from "clsx"
import { useRouter } from "next/router"
import { z } from "zod"
import Form from "app/core/components/Form"
import FormField from "app/core/components/FormField"
import notify, { notifyPromise } from "app/core/hooks/notify"
import createFeedMutation from "app/feeds/mutations/createFeed"
import getTitleAndTTLQuery from "app/feeds/queries/getInfoFromFeedURL"

const AddFeedForm = () => {
  const [createFeed] = useMutation(createFeedMutation)

  const router = useRouter()

  const submitHandler = async (values: {
    name: string
    url: string
    loadIntervall: number | string
  }) => {
    try {
      new URL(values.url)
    } catch {
      console.error("invalid URL")
      return { url: "Invalid URL" }
    }

    const shouldGetNameFromFeed: boolean = values.name === undefined || values.name === ""

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
  }

  return (
    <div
      className={clsx(
        "dark:bg-slate-700",
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
        schema={z.object({
          url: z.string().url(),
          name: z.string(),
          loadIntervall: z.number(),
        })}
        onSubmit={submitHandler}
        initialValues={{ url: "", name: "", loadIntervall: 60 }}
        submitText={"Add new Feed"}
      >
        <div className={clsx("flex", "flex-col", "font-semibold")}>
          <h3 className={clsx("font-semibold", "text-2xl")}>Add new Feed</h3>
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
        </div>
      </Form>
    </div>
  )
}

export default AddFeedForm
