import { useState } from "react"
import { createContainer } from "react-tracked"
import { ALL_FEEDS_ID } from "config/feeds/feedIDs"

export const LOCALSTORAGE_FEEDID = "activeFeedID"

const activeFeedID =
  typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem(LOCALSTORAGE_FEEDID) ?? "null") ?? -1
    : ALL_FEEDS_ID

const initialState = {
  activeFeedID,
}

const useCustomState = () => useState(initialState)

export const { Provider: SharedStateProvider, useTracked: useSharedState } =
  createContainer(useCustomState)
