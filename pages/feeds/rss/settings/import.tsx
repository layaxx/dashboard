import { useState } from "react"
import { BlitzPage } from "@blitzjs/next"
import { useMutation } from "@blitzjs/rpc"
import clsx from "clsx"
import Head from "next/head"
import { Field } from "react-final-form"
import { z } from "zod"
import Form from "app/core/components/form"
import notify from "app/core/hooks/notify"
import Layout from "app/core/layouts/Layout"
import FileReaderComponent from "app/feeds/components/settings/FileReader"
import importFeeds from "app/feeds/mutations/importFeeds"

type FormValues = {
  fileContent: string
  file: unknown
  shouldDeleteBefore: boolean
}

const FeedsImportDataPage: BlitzPage = () => {
  const [backup, setBackup] = useState("")
  const [importData] = useMutation(importFeeds)

  const submitHandler = async ({
    fileContent,
    shouldDeleteBefore,
  }: Pick<FormValues, "fileContent" | "shouldDeleteBefore">) => {
    if (shouldDeleteBefore) {
      // make Backup for safety
      const exportResponse = await fetch("/api/export")
      if (!exportResponse.ok) {
        notify("Failed to get backup", { status: "warning" })
        return
      }
      setBackup(await exportResponse.text())
    }

    try {
      await importData({ fileContent, shouldDeleteBefore })
      notify("Successfully imported data", { status: "success" })
      return {}
    } catch (error) {
      notify("Failed to import data", {
        status: "error",
        message: error instanceof Error ? error.toString() : undefined,
      })
    }
  }

  return (
    <>
      <Head>
        <title>Feeds - Import Data</title>
      </Head>
      <div className="w-full">
        <Form
          schema={z.object({
            fileContent: z.string(),
            shouldDeleteBefore: z.boolean(),
            file: z.unknown(),
          })}
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
