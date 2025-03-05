export function ProfileFormSkeleton() {
  // 固有のキーを持つ配列を用意（キーは静的で一意となるように定義）
  const skeletonKeys = [
    'skeleton-1',
    'skeleton-2',
    'skeleton-3',
    'skeleton-4',
    'skeleton-5',
  ]

  return (
    <div className='space-y-6 animate-pulse'>
      <div className='space-y-2'>
        <div className='h-5 w-24 bg-gray-200 rounded' />
        <div className='h-10 bg-gray-200 rounded w-full' />
      </div>

      <div className='space-y-2'>
        <div className='h-5 w-24 bg-gray-200 rounded' />
        <div className='grid grid-cols-5 gap-4'>
          {skeletonKeys.map(key => (
            <div key={key} className='flex flex-col items-center'>
              <div className='w-16 h-16 rounded-full bg-gray-200' />
            </div>
          ))}
        </div>
      </div>

      <div className='space-y-2'>
        <div className='h-5 w-36 bg-gray-200 rounded' />
        <div className='h-10 bg-gray-200 rounded w-full' />
      </div>

      <div className='h-10 bg-gray-200 rounded w-full' />
    </div>
  )
}
