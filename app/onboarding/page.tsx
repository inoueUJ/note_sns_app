import { Suspense } from 'react'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { ProfileFormSkeleton } from '@/components/profile/profile-form-skeleton'
import ProfileFormContainer from '@/components/profile/profile-form-container'

export default async function OnboardingPage() {
  const supabase = await createClient()

  // ユーザー認証チェック
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/sign-in')
  }

  // プロフィールの存在チェック
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // オンボーディングが完了している場合のみリダイレクト
  if (profile && profile.onboarding_completed === true) {
    return redirect('/notes')
  }

  return (
    <main className='container mx-auto px-4 py-8'>
      <div className='max-w-lg mx-auto'>
        <h1 className='text-3xl font-bold mb-6 text-center'>
          プロフィール設定
        </h1>
        <p className='text-lg text-center mb-8'>
          ようこそ！少しだけあなたについて教えてください
        </p>

        {/* Suspenseを使ってローディング状態を管理 */}
        <Suspense fallback={<ProfileFormSkeleton />}>
          <ProfileFormContainer userId={user.id} />
        </Suspense>
      </div>
    </main>
  )
}
