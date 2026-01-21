import { useState } from "react"
import { getAntiCSRFToken } from "@blitzjs/auth"
import { BlitzPage } from "@blitzjs/next"
import clsx from "clsx"
import Head from "next/head"
import { z } from "zod"
import Form from "app/core/components/form"
import TextFieldWithButton from "app/core/components/form/fields/TextFieldWithButton"
import Loader from "app/core/components/Loader"
import { notifyPromiseAdvanced } from "app/core/hooks/notify"
import Layout from "app/core/layouts/Layout"
import PreviewItem from "app/feeds/components/items/PreviewItem"
import type { Feedentry } from "db"

const RSSPreviewPage: BlitzPage = () => {
  const [feedEntries, setFeedEntries] = useState<Feedentry[] | undefined>()
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = (values: { url: string }) => {
    try {
      new URL(values.url)
    } catch {
      return { url: "not a valid URL" }
    }

    const url = new URL("/api/previewRSS", globalThis.location.toString())
    url.searchParams.append("url", values.url)

    setIsLoading(true)
    notifyPromiseAdvanced(
      () =>
        globalThis.fetch(url, {
          credentials: "include",
          headers: {
            "anti-csrf": getAntiCSRFToken(),
          },
        }),
      {
        pending: { title: "Loading Preview" },
        error: async () => {
          setFeedEntries(undefined)
          return { title: "Failed to load Preview" }
        },
        success: async (response) => {
          if (!response.ok) {
            console.error(response)
            return { title: "Failed to load Preview", status: "error" }
          }

          const { items } = JSON.parse(await response.text())
          setFeedEntries(items)
          return {
            title: `Loaded ${items.length} items from ${values.url}`,
            status: "success",
          }
        },
      }
    ).finally(() => setIsLoading(false))
  }

  // eslint-disable-next-line no-console
  console.debug({ feedEntries })

  return (
    <>
      <Head>
        <title>Feeds - Preview</title>
      </Head>

      <div className="w-full">
        <Form
          schema={z.object({ url: z.string().url() })}
          onSubmit={onSubmit}
          initialValues={{ url: "" }}
          className={clsx("mx-auto", "w-full")}
        >
          <TextFieldWithButton
            name={"url"}
            label={"Feed URL"}
            placeholder="https://..."
            button={{
              value: "Preview",
              type: "submit",
              className: "focus:ring-primary focus:ring-offset-0",
            }}
            outerProps={{ className: "w-full" }}
          />
        </Form>

        <div>
          {isLoading && <Loader />}

          {feedEntries?.length === 0 && "No entries found"}

          {!isLoading && feedEntries?.length && (
            <>
              {feedEntries.map((item) => (
                <PreviewItem
                  item={item}
                  key={item.id}
                  settings={{ expand: false }}
                  removeEntry={() =>
                    setFeedEntries((oldEntries) => oldEntries?.filter((entry) => entry !== item))
                  }
                />
              ))}
            </>
          )}
        </div>
      </div>
    </>
  )
}

RSSPreviewPage.authenticate = true
RSSPreviewPage.getLayout = (page) => <Layout heading="RSS Preview Page">{page}</Layout>

export default RSSPreviewPage
