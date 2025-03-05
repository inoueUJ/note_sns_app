import { getTimelinePosts } from '@/app/actions/diary.actions'

export default async function TimelineList() {
  const { posts, error } = await getTimelinePosts()

  if (error) {
    return <div className='text-red-500'>エラーが発生しました: {error}</div>
  }

  if (posts.length === 0) {
    return <div className='text-center py-8'>最近の投稿はありません</div>
  }

  return (
    <div className='space-y-6'>
      {posts.map(post => (
        <div key={post.id} className='border rounded-lg p-4 shadow-sm'>
          <div className='flex items-center gap-3 mb-3'>
            <img
              src={`/icons/${post.profiles.icon}.png`}
              alt='User avatar'
              className='w-10 h-10 rounded-full'
            />
            <span className='font-medium'>{post.profiles.nickname}</span>
          </div>
          <p className='text-gray-800'>{post.content}</p>
          <div className='text-sm text-gray-500 mt-2'>
            {new Date(post.posted_at).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  )
}
