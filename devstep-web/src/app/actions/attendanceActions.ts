'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function recordAttendance() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "로그인이 필요합니다." }

  const today = new Date().toISOString().split('T')[0];
  try {
    await supabase.from('user_attendance').upsert([{ user_id: user.id, attendance_date: today }], { onConflict: 'user_id,attendance_date' });
    revalidatePath('/dashboard');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getAttendanceHistory() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, data: [] }

  try {
    const { data, error } = await supabase.from('user_attendance').select('attendance_date').eq('user_id', user.id).order('attendance_date', { ascending: true });
    if (error) throw error;
    const dates = (data || []).map((d: any) => d.attendance_date);
    const firstJoinDate = dates.length > 0 ? dates[0] : null;
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dateSet = new Set(dates);
    let checkDate = new Date(today);
    while (dateSet.has(checkDate.toISOString().split('T')[0])) { 
      streak++; 
      checkDate.setDate(checkDate.getDate() - 1); 
    }
    return { success: true, data: dates, firstJoinDate, streak };
  } catch (err: any) {
    return { success: false, data: [] };
  }
}
