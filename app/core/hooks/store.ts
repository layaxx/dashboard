import { configureStore } from "@reduxjs/toolkit"
import feedSlice from "./feedSlice"
import readlistSlice from "./readlistSlice"

const store = configureStore({
  reducer: { feed: feedSlice, readlist: readlistSlice },
})
export default store

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
