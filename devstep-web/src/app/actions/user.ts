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
 * 기존 온보딩 상세 진단 데이터를 가져옵니다. (Pre-fill용)
 */
export async function getOnboardingSurvey(): Promise<{ data: any | null; error: string | null }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { data: null, error: '인증된 유저가 아닙니다.' }
  }

  const { data, error } = await supabase
    .from('onboarding_surveys')
    .select('survey_data')
    .eq('user_id', user.id)
    .maybeSingle()

  if (error) {
    return { data: null, error: error.message }
  }

  return { data: data?.survey_data || null, error: null }
}

/**
 * 유저 프로필 정보를 업데이트합니다. (Minimal Profile)
 * 오직 users 테이블의 기본 컬럼(name, avatar_url)만 처리합니다.
 */
export async function updateUserProfile(input: {
  name?: string | null;
  avatar_url?: string | null;
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: '인증된 유저가 아닙니다.' }
  }

  const { error } = await supabase
    .from('users')
    .update({
      name: input.name,
      avatar_url: input.avatar_url,
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
 * 온보딩 및 상세 조사 데이터를 완료 처리합니다. (JSON 테이블 저장 방식)
 */
export async function completeUnifiedOnboarding(formData: {
  name?: string
  region?: string
  skills?: string[]
  baseline?: string
  status?: string[]
  experience?: string
  interests?: string[]
  careerGaps?: string[]
  targetDomain?: string[]
  availableResource?: string
  freeIdea?: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('인증된 유저가 아닙니다.')
  }

  // 1. AI 전용 설문 데이터 테이블에 JSON으로 저장 (Upsert)
  const { error: surveyError } = await supabase
    .from('onboarding_surveys')
    .upsert({
      user_id: user.id,
      survey_data: {
        profile: {
          name: formData.name,
          region: formData.region,
        },
        point_a: {
          current_skills: formData.skills || [],
          academic_year: formData.baseline || "",
          current_focus: formData.status || [],
          experience_level: formData.experience || "",
          interests: formData.interests || []
        },
        point_b: {
          career_gaps: formData.careerGaps || [],
          target_domains: formData.targetDomain || [],
          availability_resource: formData.availableResource || "미들형",
          free_idea: formData.freeIdea || ""
        }
      },
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' });

  if (surveyError) {
    console.error('Survey save error:', surveyError.message)
    throw new Error('상세 진단 정보 저장 실패')
  }

  // 2. 포트폴리오 기술 스택 동기화 (기술 정보가 있을 경우만)
  if (formData.skills && formData.skills.length > 0) {
    const { error: portfolioError } = await supabase
      .from('portfolio')
      .upsert({
        user_id: user.id,
        tech_stacks: formData.skills,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });

    if (portfolioError) {
      console.warn('Portfolio sync warning:', portfolioError.message)
    }
  }

  // 3. 메인 유저 테이블 온보딩 완료 플래그 및 이름 업데이트
  const updateData: any = { 
    is_onboarded: true,
    updated_at: new Date().toISOString() 
  }
  if (formData.name) updateData.name = formData.name

  const { error: userError } = await supabase
    .from('users')
    .update(updateData)
    .eq('id', user.id)

  if (userError) {
    console.error('Onboarding update error:', userError.message)
    throw new Error('온보딩 완료 처리 실패')
  }

  revalidatePath('/', 'layout')
  return { success: true }
}
