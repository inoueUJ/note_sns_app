import { Suspense } from 'react'
import { getTimelinePosts } from '@/app/actions/diary.actions'
import TimelineList from '@/components/timeline/timeline-list'
import { ProfileFormSkeleton } from '@/components/profile/profile-form-skeleton'

export default async function TimelinePage() {
  return (
    <main className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-6'>タイムライン</h1>
      <p className='text-gray-600 mb-8'>最近24時間以内に投稿された日記</p>

      <Suspense fallback={<ProfileFormSkeleton />}>
        <TimelineList />
      </Suspense>
    </main>
  )
}
