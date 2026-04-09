
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

async function main() {
  const supabase = createClient(supabaseUrl!, supabaseAnonKey!)

  console.log('--- users 테이블 컬럼 점검 시작 ---')
  
  // rpc를 호출할 수 없으므로, 아주 간단한 쿼리로 에러 메시지나 결과를 통해 구조 유추
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .limit(1)

  if (error) {
    console.error('조회 실패:', error.message)
    return
  }

  if (data && data.length > 0) {
    console.log('샘플 데이터 발견! 현재 컬럼 목록:', Object.keys(data[0]))
  } else {
    console.log('데이터가 비어 있습니다. 컬럼 확인을 위해 더미 데이터를 시도하거나 대시보드 확인이 필요할 수 있습니다.')
    // 더미 데이터를 넣어보려 시도 (롤백 불가하므로 조심)
    // 대신 rpc가 정의되어 있지 않다면 추측이 어렵습니다. 
  }
}

main()
