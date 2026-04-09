'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { UserProfile, UserUpdateInput } from '@/types/user'

/**
 * 현재 로그인한 유저의 전체 프로필 정보를 가져옵니다.
 */
export async function getUserProfile(): Promise<{ data: UserProfile | null; error: string | null }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { data: null, error: '인증된 유저가 아닙니다.' }
  }

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) {
    return { data: null, error: error.message }
  }

  return { data: data as UserProfile, error: null }
}

/**
 * 유저 프로필 정보를 업데이트합니다. (범용 수정용)
 */
export async function updateUserProfile(input: UserUpdateInput) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: '인증된 유저가 아닙니다.' }
  }

  const { error } = await supabase
    .from('users')
    .update({
      ...input,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)

  if (error) {
    console.error('Update profile error:', error.message)
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  return { success: true }
}

/**
 * 온보딩 정보를 완료 처리합니다.
 */
export async function completeOnboarding(formData: {
  name: string
  major: string
  status: string
  interest_role: string
  skills: string[]
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not found')
  }

  // 이제 트리거가 유저 행을 생성해두었으므로 upsert 대신 update를 사용해도 안전합니다.
  const { error } = await supabase
    .from('users')
    .update({
      name: formData.name,
      major: formData.major,
      status: formData.status,
      interest_role: formData.interest_role,
      skills: formData.skills,
      is_onboarded: true,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)

  if (error) {
    console.error('Onboarding update error:', error.message)
    // 여전히 백엔드 미준비 상황을 대비해 성공으로 처리할 수도 있으나, 
    // 이제 트리거를 통해 구조가 잡혔으므로 엄격하게 처리하는 것이 좋습니다.
    throw new Error('온보딩 정보를 저장하는 데 실패했습니다.')
  }

  revalidatePath('/', 'layout')
  return { success: true }
}
