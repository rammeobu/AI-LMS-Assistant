import { NextResponse } from 'next/server'
// The client you created from the Server-Side Auth instructions
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/dashboard'

  // Docker 컨테이너 내부에서는 origin이 0.0.0.0:3000이 되므로, 
  // 브라우저에서 접근 가능한 주소로 보정
  const safeOrigin = origin.includes('0.0.0.0') 
    ? origin.replace('0.0.0.0', 'localhost') 
    : origin

  if (code) {
    const supabase = await createClient()
    const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && session) {
      const { user } = session
      
      // 1. GitHub provider_token 추출 및 저장
      if (session.provider_token) {
        await supabase
          .from('users')
          .update({ github_token: session.provider_token })
          .eq('id', user.id)
      }

      // 2. 온보딩 여부 확인 및 리다이렉트 처리
      if (user) {
        const { data: userData, error: dbError } = await supabase
          .from('users')
          .select('is_onboarded')
          .eq('id', user.id)
          .single()

        if (dbError || !userData?.is_onboarded) {
          return NextResponse.redirect(`${safeOrigin}/onboarding`)
        }
      }

      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'
      if (isLocalEnv) {
        return NextResponse.redirect(`${safeOrigin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${safeOrigin}${next}`)
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${safeOrigin}/auth/auth-code-error`)
}
