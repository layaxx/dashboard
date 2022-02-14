/* eslint-disable sort-keys */
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "./store"

interface FeedState {
  value: number
}

// Define the initial state using that type
const initialState: FeedState = {
  value: 0,
}

export const feedSlice = createSlice({
  name: "activeFeed",
  initialState,
  reducers: {
    setActiveFeed: (state, action: PayloadAction<number>) => {
      state.value = action.payload
      return state
    },
  },
})

// Action creators are generated for each case reducer function
export const { setActiveFeed } = feedSlice.actions

export const activeFeedID = (state: RootState) => state.feed.value

export default feedSlice.reducer
