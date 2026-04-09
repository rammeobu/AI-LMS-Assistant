import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set({ name, value, ...options }))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // getUser(). A simple mistake can make it very hard to debug
  // issues with users being logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 1. Not logged in: Redirect to login if accessing protected routes
  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/login') &&
    !request.nextUrl.pathname.startsWith('/auth') &&
    request.nextUrl.pathname !== '/'
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // 2. Logged in: Check onboarding status
  if (user) {
    const { data: userData } = await supabase
      .from('users')
      .select('is_onboarded')
      .eq('id', user.id)
      .single()

    const isOnboardingPage = request.nextUrl.pathname.startsWith('/onboarding')
    const isDashboardPage = request.nextUrl.pathname.startsWith('/dashboard')

    // 온보딩 상태가 DB에 반영되지 않아도 대시보드 접근이 가능하도록 잠시 주석 처리했던 로직을 활성화합니다.
    if (!userData?.is_onboarded && isDashboardPage) {
      return NextResponse.redirect(new URL('/onboarding', request.url))
    }

    // If already onboarded and trying to access onboarding, send to dashboard
    if (userData?.is_onboarded && isOnboardingPage) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return supabaseResponse
}
