import { createAction, createReducer, nanoid, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Post } from '../../../Types/blog.type'
import { initialPostList } from '../../../constants/blog'

interface BlogState {
    postList: Post[]
    editingPost: Post | null
}

const initialState: BlogState = {
    postList: initialPostList,
    editingPost: null
}

const blogSlice = createSlice({
    name: 'blog',
    initialState,
    reducers: {
        deletePost: (state, action: PayloadAction<string>) => {
            const postID = action.payload
            const foundPostIndex = state.postList.findIndex((post) => post.id === postID)
            if (foundPostIndex !== -1) {
                state.postList.splice(foundPostIndex, 1)
            }
        },
        startEditingPost: (state, action: PayloadAction<string>) => {
            const postID = action.payload
            const foundPost = state.postList.find((post) => post.id === postID) || null
            state.editingPost = foundPost
        },
        cancelEditingPost: (state) => {
            state.editingPost = null
        },
        doneEditingPost: (state, action: PayloadAction<Post>) => {
            const postID = action.payload.id
            state.postList.some((post, index) => {
                if (post.id === postID) {
                    state.postList[index] = action.payload
                    return true
                }
                return false
            })
            state.editingPost = null
        },
        addPost: {
            reducer: (state, action: PayloadAction<Post>) => {
                const post = action.payload
                state.postList.push(post)
            },
            prepare: (post: Omit<Post, 'id'>) => ({
                payload: {
                    ...post,
                    id: nanoid()
                }
            })
        }
    }
})

export const { deletePost, addPost, startEditingPost, cancelEditingPost, doneEditingPost } = blogSlice.actions
const blogReducer = blogSlice.reducer

export default blogReducer
