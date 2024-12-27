import { useState } from "react"
import { createContainer } from "react-tracked"
import { ALL_FEEDS_ID } from "lib/config/feeds/feedIDs"

export const LOCALSTORAGE_FEEDID = "activeFeedID"

const activeFeedID =
  globalThis.localStorage === undefined
    ? ALL_FEEDS_ID
    : JSON.parse(localStorage.getItem(LOCALSTORAGE_FEEDID) ?? "null") ?? -1

const initialState = {
  activeFeedID,
  refetchItems: () => console.warn("Cannot refetch items as no handler is attached"),
  closeAside: () => console.warn("Cannot close Aside as no handler is attached"),
}

const useCustomState = () => useState(initialState)

export const { Provider: SharedStateProvider, useTracked: useSharedState } =
  createContainer(useCustomState)
