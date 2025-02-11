import { Hero } from '@/components/hero'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar, Share2, Clock } from 'lucide-react'

const features = [
  {
    id: 1,
    icon: Calendar,
    title: '2025年の日記',
    description: '未来の日々を今から記録。時間を超えた自己対話を。',
  },
  {
    id: 2,
    icon: Share2,
    title: '日記の交換',
    description: '友達と思い出を共有。新しい視点で日々を振り返る。',
  },
  {
    id: 3,
    icon: Clock,
    title: 'タイムライン',
    description: 'その日の投稿をチェック。時の流れを可視化。',
  },
]
const recentEntries = [
  {
    id: 1,
    title: '未来への手紙',
    excerpt: '2025年の自分へ。今の気持ち、夢、目標を書き記しました。',
  },
  {
    id: 2,
    title: '技術の進化',
    excerpt: 'AIとの共存が当たり前になった世界。新しい働き方の模索。',
  },
  {
    id: 3,
    title: '日常の一コマ',
    excerpt: 'リモートワークが進化し、バーチャルオフィスでの会議が主流に。',
  },
]

export default async function Home() {
  return (
    <div className='min-h-screen bg-gray-50'>
      <main className='container mx-auto px-4 py-8'>
        <Hero />
        <section className='py-12'>
          <h2 className='text-3xl font-serif font-bold text-gray-800 mb-8 text-center'>
            特徴
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {features.map(feature => (
              <Card key={feature.id}>
                <CardContent className='flex flex-col items-center p-6'>
                  <feature.icon className='w-12 h-12 text-green-600 mb-4' />
                  <h3 className='text-xl font-semibold mb-2'>
                    {feature.title}
                  </h3>
                  <p className='text-center text-gray-600'>
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
        <section className='py-12'>
          <h2 className='text-3xl font-serif font-bold text-gray-800 mb-8 text-center'>
            最近の投稿
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {recentEntries.map(entry => (
              <Card key={entry.id}>
                <CardContent className='p-6'>
                  <h3 className='text-xl font-semibold mb-2'>{entry.title}</h3>
                  <p className='text-gray-600'>{entry.excerpt}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>{' '}
      </main>
    </div>
  )
}
