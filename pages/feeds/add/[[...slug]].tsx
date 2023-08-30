import { useEffect } from "react"
import { BlitzPage, Routes, useParam } from "@blitzjs/next"
import { useMutation } from "@blitzjs/rpc"
import { useRouter } from "next/router"
import createReadlistentry from "app/feeds/readlistentries/mutations/createReadlistentry"

function getURLFromSlug(slug: string[]) {
  const [prefix, ...rest] = slug
  if (!prefix) {
    throw new Error("Invalid input")
  }
  if (prefix.endsWith(":")) {
    return prefix + "//" + rest.join("/")
  }
  return slug.join("/")
}

const AddNewReadListItemPage: BlitzPage = () => {
  const slug = useParam("slug")

  const [addToReadlist] = useMutation(createReadlistentry)
  const router = useRouter()

  const url = !!slug && (typeof slug === "string" ? slug : getURLFromSlug(slug as string[]))

  /* FIXME: this method ignores parameters */

  useEffect(() => {
    if (!!url) {
      addToReadlist({ url })
        .then(() => router.push(Routes.FeedsReadingPage()))
        .catch(console.error)
    }
  }, [url, router, addToReadlist])

  if (!slug) {
    return <p>No Slug provided</p>
  }

  return <p>{url}</p>
}
export default AddNewReadListItemPage
