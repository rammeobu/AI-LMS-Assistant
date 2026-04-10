'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function signUpWithEmail(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: '이메일과 비밀번호를 모두 입력해주세요.' }
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_API_URL}/auth/callback`,
    },
  })

  if (error) {
    console.error('Sign up error:', error.message)
    return { error: error.message }
  }

  // [DB 트리거 도입] 이제 DB 트리거(on_auth_user_created)가 
  // public.users 테이블에 프로필을 자동으로 생성하므로 수동 upsert는 필요하지 않습니다.

  revalidatePath('/', 'layout')
  
  // 이메일 확인이 필요한 경우와 아닌 경우를 구분할 수 있지만, 
  // 보통 Supabase 기본 설정상 이메일 확인 메일이 발송됩니다.
  return { success: true, message: '회원가입 성공! 이메일을 확인해 주세요.' }
}

export async function signInWithEmail(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: '이메일과 비밀번호를 모두 입력해주세요.' }
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('Sign in error:', error.message)
    return { error: '이메일 또는 비밀번호가 일치하지 않습니다.' }
  }

  revalidatePath('/', 'layout')
  
  // 온보딩 여부 확인 후 리다이렉트 (이 부분은 미들웨어가 처리하도록 맡기거나 여기서 처리 가능)
  // 현재는 단순 성공 반환
  return { success: true, message: '' }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}
