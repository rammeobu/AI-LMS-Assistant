'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * 1. 사용자의 모든 할 일 목록 가져오기 (생성일 오름차순 - 추가된 순서)
 */
export async function getTodos() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { success: false, data: [] }

  try {
    const { data, error } = await supabase
      .from('user_todos')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return { success: true, data: data || [] };
  } catch (err: any) {
    console.error("[getTodos] ERROR:", err.message);
    return { success: false, data: [] };
  }
}

/**
 * 2. 새로운 할 일 추가하기
 */
export async function addTodo(content: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !content.trim()) return { success: false, error: "로그인이 필요하거나 내용이 없습니다." }

  try {
    const { data, error } = await supabase
      .from('user_todos')
      .insert([{ user_id: user.id, content: content.trim(), is_completed: false }])
      .select()
      .single();

    if (error) throw error;

    revalidatePath('/dashboard');
    return { success: true, data };
  } catch (err: any) {
    console.error("[addTodo] ERROR:", err.message);
    return { success: false, error: err.message };
  }
}

/**
 * 3. 할 일 완료 상태 토글 (is_completed 반전)
 */
export async function toggleTodo(id: string, currentStatus: boolean) {
  const supabase = await createClient()
  
  try {
    const { error } = await supabase
      .from('user_todos')
      .update({ is_completed: !currentStatus })
      .eq('id', id);

    if (error) throw error;

    revalidatePath('/dashboard');
    return { success: true };
  } catch (err: any) {
    console.error("[toggleTodo] ERROR:", err.message);
    return { success: false, error: err.message };
  }
}

/**
 * 4. 할 일 삭제
 */
export async function deleteTodo(id: string) {
  const supabase = await createClient()

  try {
    const { error } = await supabase
      .from('user_todos')
      .delete()
      .eq('id', id);

    if (error) throw error;

    revalidatePath('/dashboard');
    return { success: true };
  } catch (err: any) {
    console.error("[deleteTodo] ERROR:", err.message);
    return { success: false, error: err.message };
  }
}
