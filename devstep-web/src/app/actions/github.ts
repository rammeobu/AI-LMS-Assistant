'use server'

import { createClient } from '@/utils/supabase/server'

const AI_BACKEND_URL = process.env.NEXT_PUBLIC_AI_API_URL || 'http://localhost:8000'

/**
 * 사용자의 GitHub 토큰이 유효하게 존재하는지 확인합니다.
 */
export async function checkGithubToken(): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: '로그인이 필요합니다.' }
  }

  const { data: userData, error: dbError } = await supabase
    .from('users')
    .select('github_token')
    .eq('id', user.id)
    .single()

  if (dbError || !userData?.github_token) {
    return { success: false, error: '연동된 GitHub 계정이 없거나 토큰이 만료되었습니다.' }
  }

  return { success: true }
}

/**
 * AI 백엔드에 GitHub 기술 스택 추출 작업을 요청합니다. (비동기 트리거)
 */
export async function triggerGithubStackAnalysis() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: { session } } = await supabase.auth.getSession()

  if (!user || !session) {
    return { success: false, error: '로그인이 필요합니다.' }
  }

  // DB에서 토큰 조회
  const { data: userData } = await supabase
    .from('users')
    .select('github_token')
    .eq('id', user.id)
    .single()

  if (!userData?.github_token) {
    return { success: false, error: 'GitHub 토큰이 없습니다. 다시 연동해주세요.' }
  }

  try {
    const response = await fetch(`${AI_BACKEND_URL}/api/v1/extract/github`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify({
        user_id: user.id,
        github_token: userData.github_token
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || '백엔드 작업 요청 실패')
    }

    return { success: true, message: '분석 작업이 시작되었습니다.' }
  } catch (err: any) {
    console.error('Trigger GitHub Analysis Error:', err.message)
    return { success: false, error: err.message }
  }
}

/**
 * AI 백엔드에서 추출된 기술 스택 상태를 폴링합니다.
 */
export async function pollGithubStackStatus(): Promise<{ status: 'pending' | 'completed' | 'processing'; skills: string[] }> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const { data: { session } } = await supabase.auth.getSession()

    if (!user || !session) {
        throw new Error('인증 필요')
    }

    try {
        const response = await fetch(`${AI_BACKEND_URL}/api/v1/extract/github/status/${user.id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${session.access_token}`
            }
        })

        if (!response.ok) {
            throw new Error('상태 조회 실패')
        }

        return await response.json()
    } catch (err: any) {
        console.error('Poll GitHub Status Error:', err.message)
        return { status: 'pending', skills: [] }
    }
}

/**
 * 이전 버전의 호환성을 위해 남겨둔 래퍼 (내부적으로 트리거 호출)
 */
export async function analyzeGithubStackWithAI() {
    return triggerGithubStackAnalysis()
}
