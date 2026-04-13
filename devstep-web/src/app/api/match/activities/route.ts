import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

const AI_BACKEND_URL = process.env.INTERNAL_AI_API_URL || 'http://devstep-ai:8000';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session || !session.user) {
      return NextResponse.json({ error: '인증된 유저가 아닙니다.' }, { status: 401 });
    }

    const body = await req.json();
    const { targetJob, skills, top_k = 5 } = body;

    const response = await fetch(`${AI_BACKEND_URL}/api/v1/match/activities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        user_id: session.user.id,
        target_job: targetJob,
        skills: skills || null,
        top_k: top_k
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData.detail || 'AI 서버 응답 오류' }, { status: response.status });
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('API Match Handler Error:', error.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
