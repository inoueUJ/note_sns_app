'use server'

import { createClient } from '@/utils/supabase/server'

type DiaryData = {
  id?: string
  content: string
  is_public: boolean
  diary_date: string
}

export async function createDiary(formData: FormData) {
  try {
    const supabase = await createClient()

    // ユーザー確認
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: '認証が必要です' }
    }

    const content = formData.get('content') as string
    const is_public = formData.get('is_public') === 'true'
    const diary_date = formData.get('diary_date') as string

    if (!content) {
      return { success: false, error: 'コンテンツが必要です' }
    }

    // 日記の作成
    const { data, error } = await supabase
      .from('diaries')
      .insert({
        user_id: user.id,
        content,
        is_public,
        diary_date,
        posted_at: is_public ? new Date().toISOString() : null,
      })
      .select()
      .single()

    if (error) {
      console.error('Diary creation error:', error)
      return { success: false, error: '日記の作成に失敗しました' }
    }

    return { success: true, data, error: null }
  } catch (error) {
    console.error('Unexpected error in createDiary:', error)
    return { success: false, error: '予期せぬエラーが発生しました' }
  }
}

export async function getTimelinePosts() {
  const supabase = await createClient()

  // 24時間前のタイムスタンプを計算
  const oneDayAgo = new Date()
  oneDayAgo.setHours(oneDayAgo.getHours() - 24)

  // 公開された、24時間以内の投稿を取得
  const { data, error } = await supabase
    .from('diaries')
    .select(`
      *,
      profiles:profiles(id, nickname, icon)
    `)
    .eq('is_public', true)
    .gte('posted_at', oneDayAgo.toISOString())
    .order('posted_at', { ascending: false })

  if (error) {
    console.error('Timeline fetch error:', error)
    return { posts: [], error: error.message }
  }

  return { posts: data, error: null }
}
