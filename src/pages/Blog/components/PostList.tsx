import PostItem from './PostItem'
import { useSelector } from 'react-redux'
import { RootState } from 'store'

export default function PostList() {
    const postList = useSelector((state: RootState) => state.blog.postList)
    console.log(postList)

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
                        {postList.map((post) => (
                            <PostItem post={post} key={post.id} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
