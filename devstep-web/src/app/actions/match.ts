'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// 서버 사이드 통신을 위한 내부 주소 설정
const AI_BACKEND_URL = process.env.INTERNAL_AI_API_URL || 'http://devstep-ai:8000';

/**
 * AI 매칭 엔진(FastAPI)을 호출하여 유저 맞춤형 대외활동 추천을 가져옵니다.
 */
export async function getAIMatchedActivities(targetJob: string, manualSkills?: string[]) {
  const supabase = await createClient()
  
  // [Optimization] getUser() 호출을 제거하고 세션 정보만 빠르게 확보
  const { data: { session } } = await supabase.auth.getSession()

  if (!session || !session.user) {
    return { data: null, error: '인증된 유저가 아닙니다.' }
  }

  const user = session.user;

  try {
    const response = await fetch(`${AI_BACKEND_URL}/api/v1/match/activities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        user_id: user.id,
        target_job: targetJob,
        skills: manualSkills || null,
        top_k: 5
      }),
    })

    if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'AI 서버 응답 오류')
    }

    const result = await response.json()
    return { data: result, error: null }
  } catch (err: any) {
    console.error('AI Match Action Error:', err.message)
    return { data: null, error: err.message }
  }
}
