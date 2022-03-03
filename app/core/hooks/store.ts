import { useState } from "react"
import { createContainer } from "react-tracked"

const initialState = {
  activeFeedID: -1,
}

const useCustomState = () => useState(initialState)

export const { Provider: SharedStateProvider, useTracked: useSharedState } =
  createContainer(useCustomState)
