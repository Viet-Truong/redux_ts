import { useEffect } from 'react'

import PostItem from './PostItem'
import { useSelector } from 'react-redux'
import { RootState, useAppDispatch } from 'store'
import { deletePost, getPostList, startEditingPost } from './blog.slice'
import SkeletonPost from './Skeletonpost'

export default function PostList() {
    const postList = useSelector((state: RootState) => state.blog.postList)
    const loading = useSelector((state: RootState) => state.blog.loading)
    const dispatch = useAppDispatch()

    useEffect(() => {
        const promise = dispatch(getPostList())

        return () => {
            promise.abort()
        }
    }, [dispatch])

    const handleDelete = (postId: string) => {
        dispatch(deletePost(postId))
    }

    const handleStartEditing = (postId: string) => {
        dispatch(startEditingPost(postId))
    }

    return (
        <div className='p-5'>
            <div className='bg-white py-6 sm:py-8 lg:py-12'>
                <div className='mx-auto max-w-screen-xl px-4 md:px-8'>
                    <div className='mb-10 md:mb-16'>
                        <h2 className='mb-4 text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl'>
                            Redux Blog
                        </h2>
                        <p className='mx-auto max-w-screen-md text-center text-gray-500 md:text-lg'>Don't give up</p>
                    </div>
                    <div className='grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-2 xl:grid-cols-2 xl:gap-8'>
                        {loading ? (
                            <>
                                <SkeletonPost />
                                <SkeletonPost />
                            </>
                        ) : (
                            postList.map((post) => (
                                <PostItem
                                    post={post}
                                    key={post.id}
                                    handleDelete={handleDelete}
                                    handleStartEditing={handleStartEditing}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
