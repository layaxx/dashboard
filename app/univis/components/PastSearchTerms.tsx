import React, { MutableRefObject } from "react"
import clsx from "clsx"
import { useForm } from "react-final-form"
import Button from "app/core/components/Button"
import { LOCALSTORAGE_UNIVIS } from "pages/univis"

const useLocalStorageSubscribe = (callback: any) => {
  window.addEventListener("storage", callback)
  return () => window.removeEventListener("storage", callback)
}

const PastSearchTerms: React.FC<{ termsRef: MutableRefObject<string[]> }> = ({ termsRef }) => {
  const json = React.useSyncExternalStore(useLocalStorageSubscribe, () =>
    window.localStorage.getItem(LOCALSTORAGE_UNIVIS),
  )

  try {
    termsRef.current = JSON.parse(json ?? "null")
    if (!Array.isArray(termsRef.current)) {
      termsRef.current = ["xai", "uixd", "swe"]
    }
  } catch {
    termsRef.current = ["xai", "uixd", "swe"]
  }

  const form = useForm()

  return (
    <div className={clsx("flex", "gap-x-4", "overflow-x-scroll", "pb-1")}>
      {termsRef.current.map((term) => (
        <Button
          size="sm"
          key={term}
          variant="secondary"
          type="submit"
          onClick={() => {
            form.change("lecture", term)
          }}
          className="text-nowrap"
        >
          {term}
        </Button>
      ))}
    </div>
  )
}

export default PastSearchTerms
