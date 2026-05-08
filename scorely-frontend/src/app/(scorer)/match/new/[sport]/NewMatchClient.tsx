'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getSportPlugin } from '@/sports/registry'

interface NewMatchClientProps {
  sport: string
  userId: string
}

export function NewMatchClient({ sport, userId }: NewMatchClientProps) {
  const router = useRouter()
  const plugin = getSportPlugin(sport)
  if (!plugin) return null

  const { SetupForm } = plugin

  async function handleSubmit(config: Record<string, unknown>) {
    const supabase = createClient()

    const { data: match, error } = await supabase
      .from('matches')
      .insert({ sport, created_by: userId, status: 'upcoming', config })
      .select('id')
      .single()

    if (error || !match) throw new Error(error?.message ?? 'Failed to create match')

    // Add creator as a scorer so RLS event-insert policy passes
    await supabase
      .from('match_scorers')
      .insert({ match_id: match.id, user_id: userId })

    router.push(`/match/${match.id}/score`)
  }

  return <SetupForm onSubmit={handleSubmit} />
}
