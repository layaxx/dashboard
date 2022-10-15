import { useState } from "react"
import { BlitzPage } from "@blitzjs/next"
import { useMutation } from "@blitzjs/rpc"
import { Feed, Feedentry } from "@prisma/client"
import clsx from "clsx"
import dayjs from "dayjs"
import { SubmissionErrors } from "final-form"
import Head from "next/head"
import { Field } from "react-final-form"
import Form from "app/core/components/Form"
import notify from "app/core/hooks/notify"
import Layout from "app/core/layouts/Layout"
import FileReaderComponent from "app/feeds/components/settings/FileReader"
import createFeed from "app/feeds/mutations/createFeed"
import createFeedEntry from "app/feeds/mutations/createFeedEntry"
import deleteAllFeedEntries from "app/feeds/mutations/deleteAllFeedEntries"
import deleteAllFeeds from "app/feeds/mutations/deleteAllFeeds"

type FormValues = {
  fileContent: string
  file: string
  shouldDeleteBefore: boolean
}

const FeedsImportDataPage: BlitzPage = () => {
  const [deleteFeedFunction] = useMutation(deleteAllFeeds)
  const [deleteFeedEntryFunction] = useMutation(deleteAllFeedEntries)
  const [createFeedFunction] = useMutation(createFeed)
  const [createFeedEntryFunction] = useMutation(createFeedEntry)

  const [backup, setBackup] = useState("")

  const submitHandler = async ({
    fileContent,
    shouldDeleteBefore,
  }: FormValues): Promise<SubmissionErrors | void> => {
    if (!fileContent) {
      return { file: "No file provided" }
    }
    let parsedContent
    try {
      parsedContent = JSON.parse(fileContent)
    } catch {
      return { fileContent: "Failed to parse JSON." }
    }
    if (!parsedContent.feeds) {
      console.error("No feeds in provided file")
      return { fileContent: "No feeds in provided file" }
    }
    if (!parsedContent.feedEntries) {
      console.error("No feedEntries in provided file")
      return { fileContent: "No feedEntries in provided file" }
    }

    if (shouldDeleteBefore) {
      // make Backup for safety
      const exportResponse = await fetch("/api/export")
      if (!exportResponse.ok) {
        notify("Failed to get backup", { status: "warning" })
        return
      }
      setBackup(await exportResponse.text())

      const resultDeleteFeedEntries = await deleteFeedEntryFunction({ confirm: shouldDeleteBefore })
      const resultDeleteFeeds = await deleteFeedFunction({ confirm: shouldDeleteBefore })

      console.log(
        "Deleted",
        resultDeleteFeedEntries.count,
        "Entries from",
        resultDeleteFeeds.count,
        "Feeds."
      )
    }
    let failure = false
    const idLookup = new Map()
    const feeds = await Promise.all(
      parsedContent.feeds.map(async (feed: Feed) => {
        const result = await createFeedFunction({
          name: feed.name,
          url: feed.url,
          loadIntervall: feed.loadIntervall,
        })
        console.log("added Feed:", result.url)
        idLookup.set(feed.id, result.id)
        return result
      })
    ).catch((error) => {
      console.error(error)
      notify("Failed to Import Feeds.", { status: "error" })
      failure = true
      return []
    })

    if (failure) {
      return
    }

    const feedEntries = await Promise.all(
      parsedContent.feedEntries.map(
        async ({
          createdAt,
          feedId,
          id,
          isArchived,
          link,
          summary,
          text,
          title,
          updatedAt,
        }: Feedentry) => {
          const result = await createFeedEntryFunction({
            createdAt: dayjs(createdAt).toISOString(),
            feedId: idLookup.get(feedId),
            id,
            isArchived,
            link,
            summary,
            text,
            title,
            updatedAt: dayjs(updatedAt).toISOString(),
          })

          console.log("added FeedEntry:", result.id)
          return result
        }
      )
    ).catch((error) => {
      console.error(error)
      notify("Failed to Import Feedentries.", { status: "error" })
      failure = true
      return []
    })
    if (failure) {
      return
    }

    notify("Success!", {
      message: `Added ${feedEntries.length} Entries in ${feeds.length} Feeds.`,
    })
  }

  return (
    <>
      <Head>
        <title>Feeds - Import Data</title>
      </Head>
      <div className="w-full">
        <Form
          onSubmit={submitHandler}
          initialValues={{ file: undefined, shouldDeleteBefore: false, fileContent: "" }}
          submitText={"Import Data"}
          className={clsx("mx-auto", "md:w-1/2", "w-full")}
        >
          <div className={clsx("flex", "flex-col", "w-full")}>
            <h3 className={clsx("font-semibold", "text-2xl")}>Import Feeds / Feedentries</h3>
            <label className={clsx("flex", "flex-row")}>
              From File: <FileReaderComponent className="ml-auto" />
            </label>

            <label className={clsx("flex", "flex-row")}>
              FileContent:{" "}
              <Field name="fileContent">
                {(props) => (
                  <>
                    <textarea
                      {...props.input}
                      className={clsx(
                        "border-4",
                        props.meta.submitError && "border-error",
                        "ml-auto",
                        "text-left"
                      )}
                      rows={4}
                      cols={50}
                    />
                    <small className="text-error">{props.meta.submitError}</small>
                  </>
                )}
              </Field>
            </label>

            <label className={clsx("flex", "flex-row")}>
              Delete old data before entering new data:{" "}
              <Field name="shouldDeleteBefore" type="checkbox">
                {(props) => <input {...props.input} className={clsx("ml-auto", "text-right")} />}
              </Field>
            </label>
          </div>
        </Form>
        {backup && (
          <div className="w-full">
            <h3 className={clsx("font-bold", "text-lg")}>Pre-delete Backup: </h3>
            <textarea rows={10} className="w-full">
              {backup}
            </textarea>
          </div>
        )}
      </div>
    </>
  )
}

FeedsImportDataPage.authenticate = true
FeedsImportDataPage.getLayout = (page) => <Layout heading="RSS Import Data">{page}</Layout>

export default FeedsImportDataPage
