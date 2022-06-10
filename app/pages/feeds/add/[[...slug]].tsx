import { useEffect } from "react"
import { BlitzPage, Routes, useMutation, useParam, useRouter } from "blitz"
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

  useEffect(() => {
    if (!!url) {
      addToReadlist({ url })
        .then(() => router.push(Routes.FeedsReadingPage()))
        .catch(console.error)
    }
  }, [url])

  if (!slug) {
    return <p>No Slug provided</p>
  }

  return <p>{url}</p>
}
export default AddNewReadListItemPage
