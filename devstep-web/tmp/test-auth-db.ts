
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

async function main() {
  const supabase = createClient(supabaseUrl!, supabaseAnonKey!)

  console.log('--- 가상 회원가입(DB 생성) 테스트 시작 ---')
  
  // 가상의 테스트 유저 데이터 (실제 auth.users에는 생기지 않고 public.users 테이블만 테스트)
  const testId = '00000000-0000-0000-0000-000000000000'
  const testEmail = 'test@devstep.io'
  
  const { data, error } = await supabase
    .from('users')
    .upsert({
      id: testId,
      email: testEmail,
      name: 'TestUser',
      is_onboarded: false,
      updated_at: new Date().toISOString()
    })
    .select()

  if (error) {
    if (error.message.includes('column "email" does not exist')) {
        console.error('오류: users 테이블에 email 컬럼이 없습니다. 스키마 확인이 필요합니다.');
    } else if (error.message.includes('column "name" does not exist')) {
        console.error('오류: users 테이블에 name 컬럼이 없습니다. 스키마 확인이 필요합니다.');
    } else {
        console.error('알 수 없는 오류 발생:', error.message);
    }
    return;
  }

  console.log('성공! DB에 유저 데이터가 생성되었습니다.');
  console.log('생성된 데이터:', data);

  // 테스트 데이터 삭제
  await supabase.from('users').delete().eq('id', testId);
  console.log('테스트 데이터가 정리되었습니다.');
}

main()
