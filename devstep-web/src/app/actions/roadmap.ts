'use server'

import { createClient } from '@/utils/supabase/server'

// 서버 사이드 통신을 위한 내부 주소 설정 (도커 서비스 이름 활용)
const AI_BACKEND_URL = process.env.INTERNAL_AI_API_URL || 'http://devstep-ai:8000';

/**
 * AI 백엔드에서 현재 유저의 활성화된 로드맵 데이터를 가져옵니다.
 */
export async function getActiveRoadmap() {
  const start = Date.now();
  console.log('[PERF] getActiveRoadmap started');
  
  const supabase = await createClient()
  const authStart = Date.now();
  
  const { data: { session } } = await supabase.auth.getSession()
  console.log(`[PERF] getSession took ${Date.now() - authStart}ms`);

  if (!session || !session.user) {
    return { data: null, error: '인증된 유저가 아닙니다.' }
  }

  const user = session.user;

  try {
    const fetchStart = Date.now();
    const response = await fetch(`${AI_BACKEND_URL}/api/v1/roadmaps/active?user_id=${user.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      next: { revalidate: 0 }
    })
    console.log(`[PERF] Backend fetch took ${Date.now() - fetchStart}ms`);

    if (!response.ok) {
        if (response.status === 404) return { data: null, error: null }
        const errorData = await response.json()
        throw new Error(errorData.detail || '로드맵 조회 오류')
    }

    const result = await response.json()
    console.log(`[PERF] getActiveRoadmap total: ${Date.now() - start}ms`);
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
  const start = Date.now();
  console.log(`[PERF] updateTopicStatus(${topicId}, ${status}) started`);
  
  const supabase = await createClient()
  const authStart = Date.now();
  
  const { data: { session } } = await supabase.auth.getSession()
  console.log(`[PERF] updateTopicStatus.getSession took ${Date.now() - authStart}ms`);

  if (!session || !session.user) {
    return { data: null, error: '인증된 유저가 아닙니다.' }
  }

  const user = session.user;

  try {
    const fetchStart = Date.now();
    const response = await fetch(`${AI_BACKEND_URL}/api/v1/roadmaps/topics/${topicId}/status?user_id=${user.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ status }),
    })
    console.log(`[PERF] updateTopicStatus.fetch took ${Date.now() - fetchStart}ms`);

    if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || '상태 업데이트 오류')
    }

    const result = await response.json()
    console.log(`[PERF] updateTopicStatus total: ${Date.now() - start}ms`);
    return { data: result, error: null }
  } catch (err: any) {
    console.error('Update Topic Status Error:', err.message)
    return { data: null, error: err.message }
  }
}
