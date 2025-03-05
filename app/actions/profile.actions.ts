'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

// プロフィール更新結果の型定義
type ProfileActionResult = {
  success: boolean
  error: string | null
}

// プロフィール更新アクション
export async function updateProfile(
  formData: FormData,
): Promise<ProfileActionResult> {
  try {
    const userId = formData.get('userId') as string
    const nickname = formData.get('nickname') as string
    const icon = formData.get('icon') as string
    const instagram_url = formData.get('instagram_url') as string
    // フォームからオンボーディングフラグを取得
    const isOnboarding = formData.get('isOnboarding') === 'true'

    if (!userId) {
      return { success: false, error: 'ユーザーIDが見つかりません' }
    }

    if (!nickname) {
      return { success: false, error: 'ニックネームは必須です' }
    }

    const supabase = await createClient()

    // プロフィール更新データの準備
    const profileData: Record<string, any> = {
      id: userId,
      nickname,
      icon,
      instagram_url: instagram_url || null,
      updated_at: new Date().toISOString(),
    }

    // オンボーディングコンテキストの場合、完了フラグを追加
    if (isOnboarding) {
      profileData.onboarding_completed = true
    }

    // プロフィール情報をupsert（挿入または更新）
    const { error } = await supabase.from('profiles').upsert(profileData)

    if (error) {
      console.error('Profile update error:', error)
      return { success: false, error: 'プロフィールの更新に失敗しました' }
    }

    return { success: true, error: null }
  } catch (error) {
    console.error('Unexpected error in updateProfile:', error)
    return { success: false, error: '予期せぬエラーが発生しました' }
  }
}

// プロフィール取得アクション
export async function getProfile(userId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Profile fetch error:', error)
    return null
  }

  return data
}
