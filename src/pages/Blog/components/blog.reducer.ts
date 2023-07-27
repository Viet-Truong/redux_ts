import { createAction, createReducer } from '@reduxjs/toolkit'
import { Post } from '../../../Types/blog.type'
import { initialPostList } from './../../../constants/blog'

interface BlogState {
    postList: Post[]
}

const initialState: BlogState = {
    postList: initialPostList
}

export const addPost = createAction<Post>('blog/addPost')

export const deletePost = createAction<string>('blog/deletePost')

const blogReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(addPost, (state, action) => {
            const post = action.payload
            state.postList.push(post)
        })
        .addCase(deletePost, (state, action) => {
            const postID = action.payload
            const foundPostIndex = state.postList.findIndex((post) => post.id === postID)
            if (foundPostIndex !== -1) {
                state.postList.splice(foundPostIndex, 1)
            }
        })
})

export default blogReducer
