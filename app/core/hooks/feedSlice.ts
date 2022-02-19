/* eslint-disable sort-keys */
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "./store"

interface FeedState {
  activeFeedID: number
  mode: FEED_MODE
}

export enum FEED_MODE {
  RSS,
  BOOKMARKS,
}

// Define the initial state using that type
const initialState: FeedState = {
  activeFeedID: 0,
  mode: FEED_MODE.RSS,
}

export const feedSlice = createSlice({
  name: "activeFeed",
  initialState,
  reducers: {
    setActiveFeed: (state, action: PayloadAction<number>) => {
      state.activeFeedID = action.payload
      state.mode = FEED_MODE.RSS
      return state
    },
    changeMode: (state, action: PayloadAction<FEED_MODE>) => {
      state.mode = action.payload
      return state
    },
  },
})

// Action creators are generated for each case reducer function
export const { setActiveFeed, changeMode } = feedSlice.actions

export const getActiveFeedID = (state: RootState) => state.feed.activeFeedID
export const getFeedMode = (state: RootState) => state.feed.mode

export default feedSlice.reducer
