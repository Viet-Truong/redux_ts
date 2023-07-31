import { useState, useEffect } from 'react'

import { Post } from './../../../Types/blog.type'
import { useSelector } from 'react-redux'
import { addPost, cancelEditingPost, updatePost } from './blog.slice'
import { RootState, useAppDispatch } from 'store'
import { unwrapResult } from '@reduxjs/toolkit'

interface Error {
    publishDate: string
}

const initialState: Post = {
    id: '',
    description: '',
    title: '',
    featuredImage: '',
    publishDate: '',
    published: false
}

export default function CreatePost() {
    const [formData, setFormData] = useState<Post>(initialState)
    const [error, setError] = useState<null | Error>(null)
    const editingPost = useSelector((state: RootState) => state.blog.editingPost)
    const dispatch = useAppDispatch()

    useEffect(() => {
        setFormData(editingPost || initialState)
    }, [editingPost])

    const handleCancelEditingPost = () => {
        dispatch(cancelEditingPost())
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        // use promises
        if (editingPost) {
            // Đóng gói
            dispatch(
                updatePost({
                    postID: editingPost.id,
                    body: formData
                })
            )
                // Mở gói => Lấy được data từ AsyncThunk
                .unwrap()
                .then(() => {
                    setFormData(initialState)
                    if (error) {
                        setError(null)
                    }
                })
                .catch((error) => {
                    setError(error.error)
                })
        } else {
            // use async await
            try {
                await dispatch(addPost(formData)).unwrap()
                setFormData(initialState)
                if (error) {
                    setError(null)
                }
            } catch (error: any) {
                setError(error.error)
            }
        }
    }
    return (
        <div className='p-5'>
            <form onSubmit={handleSubmit} onReset={handleCancelEditingPost}>
                <div className='mb-6'>
                    <label htmlFor='title' className='mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300'>
                        Title
                    </label>
                    <input
                        type='text'
                        id='title'
                        className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500'
                        placeholder='Title'
                        value={formData.title}
                        onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    />
                </div>
                <div className='mb-6'>
                    <label
                        htmlFor='featuredImage'
                        className='mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300'
                    >
                        Featured Image
                    </label>
                    <input
                        type='text'
                        id='featuredImage'
                        className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500'
                        placeholder='Url image'
                        value={formData.featuredImage}
                        onChange={(e) => setFormData((prev) => ({ ...prev, featuredImage: e.target.value }))}
                    />
                </div>
                <div className='mb-6'>
                    <div>
                        <label
                            htmlFor='description'
                            className='mb-2 block text-sm font-medium text-gray-900 dark:text-gray-400'
                        >
                            Description
                        </label>
                        <textarea
                            id='description'
                            className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500'
                            placeholder='Your description...'
                            value={formData.description}
                            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                        />
                    </div>
                </div>
                <div className='mb-6'>
                    <label
                        htmlFor='publishDate'
                        className={`mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300 ${
                            error?.publishDate ? 'text-red-700' : 'text-gray-900'
                        }`}
                    >
                        Publish Date
                    </label>
                    <input
                        type='datetime-local'
                        id='publishDate'
                        className={`block w-56 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500 ${
                            error?.publishDate
                                ? 'border-red-500 text-red-700 bg-red-50 placeholder-red-700 focus:border-red-500 focus:ring-red-500'
                                : 'border-gray-500 text-gray-700 bg-gray-50 placeholder-gray-700 focus:border-gray-500 focus:ring-gray-500'
                        }`}
                        placeholder='Title'
                        value={formData.publishDate}
                        onChange={(e) => setFormData((prev) => ({ ...prev, publishDate: e.target.value }))}
                    />
                    {error?.publishDate && (
                        <p className='mt-2 text-sm text-red-600'>
                            <span className='font-medium'>{error.publishDate}</span>
                        </p>
                    )}
                </div>
                <div className='mb-6 flex items-center'>
                    <input
                        id='publish'
                        type='checkbox'
                        className='h-4 w-4 focus:ring-2 focus:ring-blue-500'
                        checked={formData.published}
                        onChange={(e) => setFormData((prev) => ({ ...prev, published: e.target.checked }))}
                    />
                    <label htmlFor='publish' className='ml-2 text-sm font-medium text-gray-900'>
                        Publish
                    </label>
                </div>
                <div>
                    {editingPost ? (
                        <>
                            <button
                                type='submit'
                                className='group relative mb-2 mr-2 inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-teal-300 to-lime-300 p-0.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-4 focus:ring-lime-200 group-hover:from-teal-300 group-hover:to-lime-300 dark:text-white dark:hover:text-gray-900 dark:focus:ring-lime-800'
                            >
                                <span className='relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900'>
                                    Update Post
                                </span>
                            </button>
                            <button
                                type='reset'
                                className='group relative mb-2 mr-2 inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-red-200 via-red-300 to-yellow-200 p-0.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-4 focus:ring-red-100 group-hover:from-red-200 group-hover:via-red-300 group-hover:to-yellow-200 dark:text-white dark:hover:text-gray-900 dark:focus:ring-red-400'
                            >
                                <span className='relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900'>
                                    Cancel
                                </span>
                            </button>
                        </>
                    ) : (
                        <button
                            className='group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 p-0.5 text-sm font-medium text-gray-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-blue-300 group-hover:from-purple-600 group-hover:to-blue-500 dark:text-white dark:focus:ring-blue-800'
                            type='submit'
                        >
                            <span className='relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900'>
                                Publish Post
                            </span>
                        </button>
                    )}
                </div>
            </form>
        </div>
    )
}
