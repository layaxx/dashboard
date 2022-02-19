/* eslint-disable sort-keys */
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "./store"

type id = number
interface ReadlistState {
  toBeRemoved: id[]
}

const initialState: ReadlistState = {
  toBeRemoved: [],
}

export const readlistSlice = createSlice({
  name: "activeFeed",
  initialState,
  reducers: {
    addToBeRemoved: (state, action: PayloadAction<id>) => {
      state.toBeRemoved.push(action.payload)
    },
    removeFromToBeRemoved: (state, action: PayloadAction<id>) => {
      state.toBeRemoved = state.toBeRemoved.filter((id) => id !== action.payload)
    },
  },
})

// Action creators are generated for each case reducer function
export const { addToBeRemoved, removeFromToBeRemoved } = readlistSlice.actions

export const getToBeRemoved = (state: RootState) => state.readlist.toBeRemoved

export default readlistSlice.reducer
