import { useState } from "react"
import { createContainer } from "react-tracked"

export const LOCALSTORAGE_FEEDID = "activeFeedID"

const activeFeedID =
  typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem(LOCALSTORAGE_FEEDID) ?? "null") ?? -1
    : -1

const initialState = {
  activeFeedID,
}

const useCustomState = () => useState(initialState)

export const { Provider: SharedStateProvider, useTracked: useSharedState } =
  createContainer(useCustomState)
