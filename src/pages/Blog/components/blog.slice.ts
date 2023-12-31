import { createSlice, PayloadAction, createAsyncThunk, AsyncThunk } from '@reduxjs/toolkit'
import { Post } from '../../../Types/blog.type'
import { initialPostList } from '../../../constants/blog'
import request from 'utils/request'

type GenericAsyncThunk = AsyncThunk<unknown, unknown, any>

type PendingAction = ReturnType<GenericAsyncThunk['pending']>
type RejectedAction = ReturnType<GenericAsyncThunk['rejected']>
type FulfilledAction = ReturnType<GenericAsyncThunk['fulfilled']>

interface BlogState {
    postList: Post[]
    editingPost: Post | null
    loading: boolean
    currentRequestID: undefined | string
}

const initialState: BlogState = {
    postList: initialPostList,
    editingPost: null,
    loading: false,
    currentRequestID: undefined
}

export const getPostList = createAsyncThunk('blog/getPostList', async (_, thunkAPI) => {
    const response = await request.get<Post[]>('posts', {
        signal: thunkAPI.signal
    })
    return response.data
})

export const addPost = createAsyncThunk('blog/addPost', async (body: Omit<Post, 'id'>, thunkAPI) => {
    try {
        const response = await request.post<Post>('posts', body, {
            signal: thunkAPI.signal
        })
        return response.data
    } catch (error: any) {
        if (error.name === 'AxiosError' && error.response.status === 422) {
            return thunkAPI.rejectWithValue(error.response.data)
        }
        throw error
    }
})

export const updatePost = createAsyncThunk(
    'blog/updatePost',
    async ({ postID, body }: { postID: string; body: Post }, thunkAPI) => {
        try {
            const response = await request.put<Post>(`posts/${postID}`, body, {
                signal: thunkAPI.signal
            })
            return response.data
        } catch (error: any) {
            if (error.name === 'AxiosError' && error.response.status === 422) {
                return thunkAPI.rejectWithValue(error.response.data)
            }
            throw error
        }
    }
)

export const deletePost = createAsyncThunk('blog/deletePost', async (postID: string, thunkAPI) => {
    const response = await request.delete<Post>(`posts/${postID}`, {
        signal: thunkAPI.signal
    })
    return response.data
})

const blogSlice = createSlice({
    name: 'blog',
    initialState,
    reducers: {
        // deletePost: (state, action: PayloadAction<string>) => {
        //     const postID = action.payload
        //     const foundPostIndex = state.postList.findIndex((post) => post.id === postID)
        //     if (foundPostIndex !== -1) {
        //         state.postList.splice(foundPostIndex, 1)
        //     }
        // },
        startEditingPost: (state, action: PayloadAction<string>) => {
            const postID = action.payload
            const foundPost = state.postList.find((post) => post.id === postID) || null
            state.editingPost = foundPost
        },
        cancelEditingPost: (state) => {
            state.editingPost = null
        }
        // doneEditingPost: (state, action: PayloadAction<Post>) => {
        //     const postID = action.payload.id
        //     state.postList.some((post, index) => {
        //         if (post.id === postID) {
        //             state.postList[index] = action.payload
        //             return true
        //         }
        //         return false
        //     })
        //     state.editingPost = null
        // }
    },
    extraReducers(builder) {
        builder
            .addCase(getPostList.fulfilled, (state, action) => {
                state.postList = action.payload
            })
            .addCase(addPost.fulfilled, (state, action) => {
                state.postList.push(action.payload)
            })
            .addCase(updatePost.fulfilled, (state, action) => {
                state.postList.some((post, index) => {
                    if (post.id === action.payload.id) {
                        state.postList[index] = action.payload
                        return true
                    }
                    return false
                })
                state.editingPost = null
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                const postId = action.meta.arg
                const deletePostId = state.postList.findIndex((post) => post.id === postId)
                state.postList.splice(deletePostId, 1)
            })
            .addMatcher<PendingAction>(
                (action) => action.type.endsWith('/pending'),
                (state, action) => {
                    state.loading = true
                    // when call any API createAsyncThunk auto generate requestID unique
                    state.currentRequestID = action.meta.requestId
                }
            )
            .addMatcher<FulfilledAction | RejectedAction>(
                (action) => action.type.endsWith('/fulfilled') || action.type.endsWith('/rejected'),
                (state, action) => {
                    if (state.loading && state.currentRequestID === action.meta.requestId) {
                        state.loading = false
                        state.currentRequestID = undefined
                    }
                }
            )
    }
})

export const { startEditingPost, cancelEditingPost } = blogSlice.actions
const blogReducer = blogSlice.reducer

export default blogReducer
