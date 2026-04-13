
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

// Load .env.local
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

async function main() {
  console.log('--- Supabase Connection Diagnostic ---')
  console.log('URL:', supabaseUrl)
  console.log('Anon Key:', supabaseAnonKey ? 'Present (First 10 chars: ' + supabaseAnonKey.substring(0, 10) + '...)' : 'Missing')

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Error: Supabase URL or Anon Key is missing in .env.local')
    return
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  console.log('\nChecking health...')
  const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true })

  if (error) {
    console.error('Table "users" check failed!')
    console.error('Error Code:', error.code)
    console.error('Error Message:', error.message)
    console.error('Hint:', error.hint)
  } else {
    console.log('Successfully connected to "users" table.')
    console.log('Row count:', data)
  }

  console.log('\n--- Verifying New Roadmap Tables ---')
  const tables = ['roadmaps', 'milestones', 'topics', 'user_topic_progress']
  
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('count', { count: 'exact', head: true })
    if (error) {
      console.error(`❌ Table "${table}" check failed:`, error.message)
    } else {
      console.log(`✅ Table "${table}" is ready. (Row count: ${data})`)
    }
  }

  console.log('\n--- Auth Status Check ---')
  const { data: authData, error: authError } = await supabase.auth.getSession()
  if (authError) {
    console.error('Auth Check Failed:', authError.message)
  } else {
    console.log('Auth check successful (Session exists:', !!authData.session, ')')
  }
}

main()
