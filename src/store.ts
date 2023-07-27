import { configureStore } from '@reduxjs/toolkit'
import blogReducer from './pages/Blog/components/blog.slice'

export const store = configureStore({
    reducer: { blog: blogReducer }
})

// Get RootState and AppDispatch from store
export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
