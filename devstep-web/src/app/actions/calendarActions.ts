'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * 1. 유저 캘린더 목록 가져오기
 */
export async function getUserCalendar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { success: false, data: [] }

  const { data, error } = await supabase
    .from('user_calendar')
    .select(`
      id,
      activity_id,
      added_at,
      activity:user_activities (
        id,
        title,
        start_date,
        deadline,
        type,
        url,
        provider,
        crawling_id
      )
    `)
    .eq('user_id', user.id);

  if (error) {
    console.error("[getUserCalendar] ERROR:", error.message);
    return { success: false, error: error.message };
  }

  const formatted = (data || []).map((item: any) => ({
    id: item.activity_id,
    crawlingId: item.activity?.crawling_id,
    title: item.activity?.title || "제목 없음",
    startDate: item.activity?.start_date,
    deadline: item.activity?.deadline,
    type: item.activity?.type || "대외활동",
    url: item.activity?.url,
    provider: item.activity?.provider,
    addedAt: item.added_at
  }));

  return { success: true, data: formatted };
}

/**
 * 2. 캘린더에 활동 추가
 */
export async function addActivityToCalendar(crawlingId: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { success: false, error: "로그인이 필요합니다." }

  try {
    const { data: crawl, error: crawlErr } = await supabase
      .from('crawling_data')
      .select('*')
      .eq('id', crawlingId)
      .single();

    if (crawlErr || !crawl) return { success: false, error: "데이터를 찾을 수 없습니다." };

    // 100% 매칭을 위해 ID 혹은 제목으로 기존 데이터 체크
    let { data: existingActivity } = await supabase
      .from('user_activities')
      .select('id')
      .or(`crawling_id.eq.${crawlingId},title.eq."${crawl.title.trim()}"`)
      .maybeSingle();

    let activityUuid = existingActivity?.id;

    if (!activityUuid) {
      const safeStartDate = (crawl.start_date && crawl.start_date.trim() !== "") ? crawl.start_date : null;
      const safeDeadline = (crawl.end_date && crawl.end_date.trim() !== "") ? crawl.end_date : null;

      const { data: newActivity, error: insertError } = await supabase
        .from('user_activities')
        .insert([{
          title: crawl.title.trim(),
          type: crawl.category || crawl.subject || "대외활동",
          provider: crawl.organization || "알 수 없음",
          start_date: safeStartDate,
          deadline: safeDeadline,
          url: crawl.homepage || null,
          content: crawl.description || null,
          crawling_id: crawlingId
        }])
        .select('id')
        .single();

      if (insertError) return { success: false, error: insertError.message };
      activityUuid = newActivity.id;
    }

    const { error: linkError } = await supabase
      .from('user_calendar')
      .upsert([{ user_id: user.id, activity_id: activityUuid }], { onConflict: 'user_id,activity_id' });

    if (linkError) return { success: false, error: linkError.message };

    revalidatePath('/dashboard');
    return { success: true, activityUuid };

  } catch (err: any) {
    return { success: false, error: "서버 오류" };
  }
}

/**
 * 3. AI 대외활동 추천 결과 가져오기 (초강력 하이브리드 필터)
 */
export async function getAIRecommendations() {
  const supabase = await createClient()

  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    let savedIds: number[] = [];
    let savedTitles: string[] = [];

    if (user) {
      const { data: savedData } = await supabase
        .from('user_calendar')
        .select('activity:user_activities(crawling_id, title)')
        .eq('user_id', user.id);
      
      (savedData || []).forEach((item: any) => {
          if (item.activity?.crawling_id) savedIds.push(Number(item.activity.crawling_id));
          if (item.activity?.title) savedTitles.push(item.activity.title.trim().toLowerCase());
      });

      console.log(`[getAIRecommendations] User has ${savedIds.length} IDs and ${savedTitles.length} Titles bookmarked.`);
    }

    const { data: processedList, error: fetchError } = await supabase
      .from('ai_processed_data')
      .select('*');

    if (fetchError || !processedList || processedList.length === 0) {
      return await getFinalFallback(supabase, savedIds, savedTitles);
    }

    // [핵심] 하이브리드 필터링: ID 혹은 제목이 겹치면 무조건 탈락
    const filteredList = processedList.filter((item: any) => {
      const matchId = savedIds.includes(Number(item.crawling_id));
      const matchTitle = savedTitles.includes(item.title?.trim().toLowerCase());
      return !matchId && !matchTitle;
    });

    console.log(`[getAIRecommendations] Hybrid filter done. ${filteredList.length} items remain.`);

    if (filteredList.length === 0) {
        return await getFinalFallback(supabase, savedIds, savedTitles);
    }

    const matched = filteredList.slice(0, 3);
    const crawlingIds = matched.map(m => m.crawling_id);
    const { data: crawlingData } = await supabase
      .from('crawling_data')
      .select('*')
      .in('id', crawlingIds);
    
    const result = matched.map(m => {
      const raw = crawlingData?.find((c: any) => c.id === m.crawling_id) || {};
      return formatActivity(m, raw, "AI 추천");
    });

    return { success: true, data: result };

  } catch (err: any) {
    console.error("[getAIRecommendations] ERROR:", err);
    return { success: true, data: [] };
  }
}

async function getFinalFallback(supabase: any, savedIds: number[], savedTitles: string[]) {
  const { data: fallbackBase } = await supabase
    .from('crawling_data')
    .select('*')
    .limit(30);

  if (!fallbackBase) return { success: true, data: [] };

  const filtered = fallbackBase
    .filter((c: any) => {
        const matchId = savedIds.includes(Number(c.id));
        const matchTitle = savedTitles.includes(c.title?.trim().toLowerCase());
        return !matchId && !matchTitle;
    })
    .slice(0, 3);

  return { success: true, data: filtered.map((c: any) => ({
      id: c.id,
      title: c.title || "지니어스 활동",
      category: c.category || "대외활동",
      date: c.end_date ? `마감: ${c.end_date}` : "모집 중",
      tag: "탐색",
      reason: "유저님을 위한 신선한 추천입니다.",
      score: 80
    }))
  };
}

function formatActivity(item: any, raw: any, reasonPrefix: string) {
  return {
    id: item.crawling_id || raw.id || Math.random(),
    title: raw.title || item.title || "제목 없음",
    category: (item.activity_types && item.activity_types[0]) || "대외활동",
    date: raw.end_date ? `마감: ${raw.end_date}` : "상시 모집",
    raw_start_date: raw.start_date || null,
    raw_end_date: raw.end_date || null,
    tag: (item.domain_tags && item.domain_tags[0]) || "추천",
    reason: `${reasonPrefix}: 유저님 맞춤 분석 완료!`,
    score: 95
  };
}
