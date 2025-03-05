import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  try {
    // レスポンスを作成
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    })

    // 非null断言を避ける
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!(supabaseUrl && supabaseAnonKey)) {
      throw new Error('環境変数が設定されていません')
    }

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // forEachではなくfor...ofを使用
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value)
          }

          response = NextResponse.next({
            request,
          })

          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options)
          }
        },
      },
    })

    // セッションの確認
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // 認証が必要なルートへのアクセス制御
    const authRequiredPaths = ['/dashboard', '/profile', '/diary']

    // オンボーディングパス
    const onboardingPath = '/onboarding'

    // 認証後のみアクセス可能なパスに未認証でアクセス
    if (
      authRequiredPaths.some(path =>
        request.nextUrl.pathname.startsWith(path),
      ) &&
      !user
    ) {
      return NextResponse.redirect(new URL('/sign-in', request.url))
    }

    // オンボーディングのアクセス制御（認証済みユーザーのみ）
    if (request.nextUrl.pathname === onboardingPath && !user) {
      return NextResponse.redirect(new URL('/sign-in', request.url))
    }

    if (user) {
      // プロフィールとオンボーディング状態の確認
      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('id', user.id)
        .single()

      // 認証済みユーザーがオンボーディング未完了の場合
      if (profile && profile.onboarding_completed === false) {
        // すでにオンボーディングページにいる場合はリダイレクトしない
        if (request.nextUrl.pathname !== onboardingPath) {
          return NextResponse.redirect(new URL(onboardingPath, request.url))
        }
      }

      // ログイン済みのユーザーがサインインページにアクセスした場合リダイレクト
      if (
        request.nextUrl.pathname === '/sign-in' ||
        request.nextUrl.pathname === '/sign-up'
      ) {
        // オンボーディング未完了ならオンボーディングへ、完了済みならホームへ
        if (profile && profile.onboarding_completed === false) {
          return NextResponse.redirect(new URL(onboardingPath, request.url))
        }
        return NextResponse.redirect(new URL('/', request.url))
      }

      // オンボーディング完了済みユーザーがオンボーディングページにアクセスした場合
      if (
        request.nextUrl.pathname === onboardingPath &&
        profile &&
        profile.onboarding_completed === true
      ) {
        return NextResponse.redirect(new URL('/', request.url))
      }
    }

    return response
  } catch (error) {
    console.error('Middleware error:', error)
    // エラー時は通常通り続行
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    })
  }
}

export const config = {
  matcher: [
    // ファイルは除外
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
