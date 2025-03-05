import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const origin = requestUrl.origin
    const redirectTo = requestUrl.searchParams.get('redirect_to')

    if (!code) {
      console.error('No code provided in auth callback')
      return NextResponse.redirect(
        `${origin}/sign-in?error=auth_callback_error`,
      )
    }

    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('Error exchanging code for session:', error.message)
      return NextResponse.redirect(
        `${origin}/sign-in?error=${encodeURIComponent(error.message)}`,
      )
    }

    // セッション取得を確認
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.redirect(`${origin}/sign-in?error=session_not_found`)
    }

    // オンボーディング状態のみをチェック
    const { data: profile } = await supabase
      .from('profiles')
      .select('onboarding_completed')
      .eq('id', session.user.id)
      .single()

    // オンボーディングが未完了の場合（またはプロフィールが未取得の場合も含む）
    if (!profile || profile.onboarding_completed === false) {
      return NextResponse.redirect(`${origin}/onboarding`)
    }

    // オンボーディング完了済みで、リダイレクト先が指定されている場合
    if (redirectTo) {
      return NextResponse.redirect(`${origin}${redirectTo}`)
    }

    // オンボーディング完了済みのデフォルトリダイレクト先
    return NextResponse.redirect(`${origin}/notes`)
  } catch (error) {
    console.error('Unexpected error in auth callback:', error)
    const origin = new URL(request.url).origin
    return NextResponse.redirect(`${origin}/sign-in?error=unexpected_error`)
  }
}
