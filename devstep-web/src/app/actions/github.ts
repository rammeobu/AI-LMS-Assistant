'use server'

import { createClient } from '@/utils/supabase/server'
import { Octokit } from 'octokit'
import { GoogleGenerativeAI } from '@google/generative-ai'

/**
 * 사용자의 GitHub 토큰이 유효하게 존재하는지 확인합니다. (일회용 토큰 여부 체크)
 */
export async function checkGithubToken(): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: '로그인이 필요합니다.' }
  }

  const { data: userData, error: dbError } = await supabase
    .from('users')
    .select('github_token')
    .eq('id', user.id)
    .single()

  if (dbError || !userData?.github_token) {
    return { success: false, error: '연동된 GitHub 계정이 없거나 토큰이 만료되었습니다.' }
  }

  return { success: true }
}

/**
 * GitHub 레포지토리와 README를 분석하여 기술 스택을 추출하는 서버 액션
 */
export async function analyzeGithubStackWithAI() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: '로그인이 필요합니다.' }
  }

  // 1. DB에서 GitHub 토큰 조회
  const { data: userData, error: dbError } = await supabase
    .from('users')
    .select('github_token')
    .eq('id', user.id)
    .single()

  if (dbError || !userData?.github_token) {
    return { success: false, error: '연동된 GitHub 계정이 없거나 토큰이 만료되었습니다. 다시 로그인해 주세요.' }
  }

  try {
    const octokit = new Octokit({ auth: userData.github_token })
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!)
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-lite-latest' })

    // 2. [고도화] 모든 공개 레포지토리 가져오기 (Pagination 처리)
    const repos = await octokit.paginate(octokit.rest.repos.listForAuthenticatedUser, {
      type: 'public',
      per_page: 100
    })

    if (repos.length === 0) {
      // 레포지토리가 없더라도 토큰은 삭제 (일회성 정책)
      await supabase.from('users').update({ github_token: null }).eq('id', user.id)
      return { success: true, skills: [], message: '분석할 레포지토리가 없습니다.' }
    }

    // 3. 메타데이터 분석 및 주요 README 선별 (최대 10개)
    const sortedRepos = [...repos].sort((a, b) => 
      new Date(b.updated_at || 0).getTime() - new Date(a.updated_at || 0).getTime()
    ).slice(0, 10)

    const repoContexts = await Promise.all(sortedRepos.map(async (repo) => {
      let readme = ''
      try {
        const { data: readmeData } = await octokit.rest.repos.getReadme({
          owner: repo.owner.login,
          repo: repo.name,
        })
        readme = Buffer.from(readmeData.content, 'base64').toString('utf8').slice(0, 800)
      } catch (e) {}

      return `Project: ${repo.name} | Lang: ${repo.language} | Desc: ${repo.description || ''}\nREADME: ${readme}\n`
    }))

    const allRepoSummary = repos.map(r => `${r.name}(${r.language})`).join(', ')

    // 4. Gemini AI에게 분석 요청
    const prompt = `
당신은 개발자의 GitHub 활동을 분석하여 기술 스택을 식별하는 전문가입니다.
사용자의 전체 공개 레포지토리 리스트: ${allRepoSummary}

특히 다음 주요 프로젝트들의 상세 내용입니다:
${repoContexts.join('\n\n')}

위 정보를 종합하여 이 개발자가 실무적으로 가장 많이 활용하고 전문성을 가진 기술 스택을 추출하세요.
응답은 반드시 ["React", "TypeScript", "Node.js", ...]와 같은 JSON 문자열 배열 형식으로만 대답해 주세요.
`

    const aiResult = await model.generateContent(prompt)
    const responseText = aiResult.response.text()
    const jsonMatch = responseText.match(/\[[\s\S]*\]/)
    const skills = jsonMatch ? JSON.parse(jsonMatch[0]) : []

    // 5. [중요] 일회성 토큰 정책: 분석 완료 후 토큰 즉시 삭제
    await supabase
      .from('users')
      .update({ github_token: null })
      .eq('id', user.id)

    return { 
      success: true, 
      skills: skills as string[],
      message: `총 ${repos.length}개의 레포지토리를 분석하여 ${skills.length}개의 기술 스택을 추출했습니다. (보안을 위해 토큰은 즉시 삭제되었습니다.)`
    }

  } catch (error: any) {
    console.error('GitHub AI Analysis error:', error)
    // 에러 발생 시에도 보안을 위해 토큰 삭제 시도
    await supabase.from('users').update({ github_token: null }).eq('id', user.id)
    
    return { 
      success: false, 
      error: error.message || 'AI 분석 중 오류가 발생했습니다.' 
    }
  }
}
