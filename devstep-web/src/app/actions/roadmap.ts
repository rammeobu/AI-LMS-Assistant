'use server'

import { createClient } from '@/utils/supabase/server'

// 서버 사이드 통신을 위한 내부 주소 설정 (도커 서비스 이름 활용)
const AI_BACKEND_URL = process.env.INTERNAL_AI_API_URL || 'http://devstep-ai:8000';

/**
 * AI 백엔드에서 현재 유저의 활성화된 로드맵 데이터를 가져옵니다.
 */
export async function getActiveRoadmap() {
  const supabase = await createClient()
  
  // [Optimization] getUser()는 실제 DB나 Supabase API를 호출하므로 느림. 
  // 세션 정보만 빠르게 가져오기 위해 getSession()만 사용.
  const { data: { session } } = await supabase.auth.getSession()

  if (!session || !session.user) {
    return { data: null, error: '인증된 유저가 아닙니다.' }
  }

  const user = session.user;

  try {
    const response = await fetch(`${AI_BACKEND_URL}/api/v1/roadmaps/active?user_id=${user.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      next: { revalidate: 0 }
    })

    if (!response.ok) {
        if (response.status === 404) return { data: null, error: null }
        const errorData = await response.json()
        throw new Error(errorData.detail || '로드맵 조회 오류')
    }

    const result = await response.json()
    return { data: result, error: null }
  } catch (err: any) {
    console.error('Get Active Roadmap Action Error:', err.message)
    return { data: null, error: err.message }
  }
}

/**
 * 특정 토픽의 학습 상태를 업데이트합니다.
 */
export async function updateTopicStatus(topicId: string, status: 'todo' | 'in_progress' | 'completed') {
  const supabase = await createClient()
  
  // [Optimization] 중복된 auth 호출 제거 및 클라이언트 사이드 캐시 활용 유도
  const { data: { session } } = await supabase.auth.getSession()

  if (!session || !session.user) {
    return { data: null, error: '인증된 유저가 아닙니다.' }
  }

  const user = session.user;

  try {
    const response = await fetch(`${AI_BACKEND_URL}/api/v1/roadmaps/topics/${topicId}/status?user_id=${user.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ status }),
    })

    if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || '상태 업데이트 오류')
    }

    const result = await response.json()
    return { data: result, error: null }
  } catch (err: any) {
    console.error('Update Topic Status Error:', err.message)
    return { data: null, error: err.message }
  }
}
