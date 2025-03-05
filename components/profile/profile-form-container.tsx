import { ProfileForm } from './profile-form'

// アイコン選択肢（実際のプロジェクトに合わせて調整）
const ICON_OPTIONS = [
  { id: 'avatar1', url: '/icons/avatar1.png' },
  { id: 'avatar2', url: '/icons/avatar2.png' },
  { id: 'avatar3', url: '/icons/avatar3.png' },
  { id: 'avatar4', url: '/icons/avatar4.png' },
  { id: 'avatar5', url: '/icons/avatar5.png' },
]

export default async function ProfileFormContainer({
  userId,
  isOnboarding = true, // デフォルトでオンボーディングコンテキスト
}: {
  userId: string
  isOnboarding?: boolean
}) {
  // アイコンリストの取得（実際のプロジェクトでは、これはDBから取得するかもしれません）
  const iconOptions = ICON_OPTIONS

  return (
    <ProfileForm
      userId={userId}
      initialData={{
        nickname: '',
        icon: ICON_OPTIONS[0].id,
        instagram_url: '',
      }}
      iconOptions={iconOptions}
      isOnboarding={isOnboarding} // オンボーディング状態を渡す
    />
  )
}
