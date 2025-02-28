import { ClientHero } from './clientHero'

export function Hero() {
  return (
    <section className='text-center py-12 md:py-24'>
      <ClientHero>
        <h1 className='text-4xl md:text-6xl font-serif font-bold text-gray-800 mb-6'>
          2025年をマイブックに記録しましょう
        </h1>
        <p className='text-xl text-gray-600 mb-8 max-w-2xl mx-auto'>
          今日の思い出を残そう。
          日々の出来事、感情、夢を綴り、2025年の自分との対話を始めましょう。
        </p>
      </ClientHero>
    </section>
  )
}
