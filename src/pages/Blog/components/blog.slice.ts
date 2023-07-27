import { nanoid, createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { Post } from '../../../Types/blog.type'
import { initialPostList } from '../../../constants/blog'
import request from 'utils/request'

interface BlogState {
    postList: Post[]
    editingPost: Post | null
}

const initialState: BlogState = {
    postList: initialPostList,
    editingPost: null
}

export const getPostList = createAsyncThunk('blog/getPostList', async (_, thunkAPI) => {
    const response = await request.get<Post[]>('posts', {
        signal: thunkAPI.signal
    })
    return response.data
})

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
    },
    extraReducers(builder) {
        builder.addCase(getPostList.fulfilled, (state, action) => {
            state.postList = action.payload
        })
    }
})

export const { deletePost, addPost, startEditingPost, cancelEditingPost, doneEditingPost } = blogSlice.actions
const blogReducer = blogSlice.reducer

export default blogReducer
