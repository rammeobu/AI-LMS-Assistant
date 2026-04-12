'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * 1. 새로운 팀 모집글 생성
 */
export async function createTeamPost(formData: {
  crawlingId: number;
  title: string;
  description: string;
  requiredStacks: string[];
  maxMembers: number;
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { success: false, error: "로그인이 필요합니다." }

  try {
    // 1. 모집글 생성
    const { data: post, error: postError } = await supabase
      .from('team_posts')
      .insert([{
        crawling_id: formData.crawlingId,
        leader_id: user.id,
        title: formData.title,
        description: formData.description,
        required_stacks: formData.requiredStacks,
        max_members: formData.maxMembers,
        status: 'recruiting'
      }])
      .select('id')
      .single();

    if (postError) throw postError;

    // 2. 방장을 첫 번째 멤버(leader 역할)로 자동 등록
    const { error: memberError } = await supabase
      .from('team_members')
      .insert([{
        post_id: post.id,
        user_id: user.id,
        role: 'leader',
        status: 'accepted'
      }]);

    if (memberError) throw memberError;

    revalidatePath('/dashboard');
    return { success: true, postId: post.id };

  } catch (err: any) {
    console.error("[createTeamPost] Error:", err.message);
    return { success: false, error: err.message };
  }
}

/**
 * 2. 팀 참가 신청하기
 */
export async function applyToTeam(postId: string, message: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { success: false, error: "로그인이 필요합니다." }

  try {
    const { data: post } = await supabase
      .from('team_posts')
      .select('status, max_members')
      .eq('id', postId)
      .single();

    if (post?.status === 'completed') return { success: false, error: "이미 모집이 완료된 팀입니다." };

    const { error } = await supabase
      .from('team_members')
      .insert([{
        post_id: postId,
        user_id: user.id,
        role: 'member',
        status: 'pending',
        apply_message: message
      }]);

    if (error) {
      if (error.code === '23505') return { success: false, error: "이미 지원한 팀입니다." };
      throw error;
    }

    revalidatePath('/dashboard');
    return { success: true };

  } catch (err: any) {
    console.error("[applyToTeam] Error:", err.message);
    return { success: false, error: err.message };
  }
}

/**
 * 3. 공모전별 모집글 목록 가져오기
 */
export async function getTeamPostsByActivity(crawlingId: number) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('team_posts')
    .select(`
      *,
      leader:users(name, email),
      members:team_members(user_id, status)
    `)
    .eq('crawling_id', crawlingId)
    .order('created_at', { ascending: false });

  if (error) return { success: false, error: error.message };
  
  return { success: true, data };
}

/**
 * 4. 전체 모집글 목록 가져오기 (대시보드 보드용)
 */
export async function getAllTeamPosts() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('team_posts')
    .select(`
      *,
      leader:users(name, avatar_url),
      activity:crawling_data(title, organization)
    `)
    .order('created_at', { ascending: false });

  if (error) return { success: false, error: error.message };
  
  return { success: true, data };
}
