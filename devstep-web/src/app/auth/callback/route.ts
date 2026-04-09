import { NextResponse } from 'next/server'
// The client you created from the Server-Side Auth instructions
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // 1. Check if user is already in our custom 'users' table and onboarded
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const { data: userData, error: dbError } = await supabase
          .from('users')
          .select('is_onboarded')
          .eq('id', user.id)
          .single()

        // 2. If user doesn't exist in our table or hasn't finished onboarding
        if (dbError || !userData?.is_onboarded) {
          // If totally missing, create a base record (upsert handles updates if it somehow existed)
          // 트리거 덕분에 데이터가 반드시 존재해야 하지만, 
          // 만약 없거나 온보딩이 안 된 경우 무조건 온보딩으로 보냅니다.
          return NextResponse.redirect(`${origin}/onboarding`)
        }
      }

      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
