import { useState, useEffect } from 'react';

interface MatchResponse {
  normalized_skills: string[];
  matches: any[];
}

export function useAIMatching(selectedJob: string, targetSkills: string[], activeStepId?: string) {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedJob) return;

    const controller = new AbortController();

    async function fetchMatches() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/match/activities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            targetJob: selectedJob,
            skills: targetSkills.length > 0 ? targetSkills : null,
          }),
          signal: controller.signal,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'AI 추천 활동 매칭 도중 오류가 발생했습니다.');
        }

        const result: MatchResponse = await response.json();
        setData(result.matches || []);
      } catch (err: any) {
        if (err.name === 'AbortError') return;
        console.error('AI Matching Hook Error:', err.message);
        setError(err.message);
        setData([]);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    fetchMatches();

    return () => {
      controller.abort();
    };
  }, [selectedJob, targetSkills.join(','), activeStepId]);

  return { data, isLoading, error };
}
