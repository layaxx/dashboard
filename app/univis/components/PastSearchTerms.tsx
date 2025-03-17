import React, { MutableRefObject } from "react"
import clsx from "clsx"
import { useForm } from "react-final-form"
import Button from "app/core/components/Button"

const useLocalStorageSubscribe = (callback: () => void) => {
  globalThis.addEventListener("storage", callback)
  return () => globalThis.removeEventListener("storage", callback)
}

const PastSearchTerms: React.FC<{
  termsRef: MutableRefObject<string[]>
  localStorageKey: string
  fallback?: string[]
}> = ({ termsRef, localStorageKey, fallback = [] }) => {
  const json = React.useSyncExternalStore(useLocalStorageSubscribe, () =>
    globalThis.localStorage.getItem(localStorageKey)
  )

  try {
    termsRef.current = JSON.parse(json ?? "null")
    if (!Array.isArray(termsRef.current)) {
      termsRef.current = fallback
    }
  } catch {
    termsRef.current = fallback
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
            form.change("searchTerm", term)
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
