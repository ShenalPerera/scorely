import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getSportPlugin } from '@/sports/registry'
import { Container, Section, PageHeader } from '@/components/shell'
import { ScorerController } from '@/components/match'
import type { Match, SportEvent } from '@/sports/_types'

interface ScorerMatchPageProps {
  params: Promise<{ id: string }>
}

export default async function ScorerMatchPage({ params }: ScorerMatchPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: row } = await supabase
    .from('matches')
    .select('*')
    .eq('id', id)
    .single()

  if (!row) notFound()

  const plugin = getSportPlugin(row.sport)
  if (!plugin) notFound()

  // Authorization: must be the creator or an assigned scorer
  const isCreator = row.created_by === user.id
  if (!isCreator) {
    const { data: scorerRow } = await supabase
      .from('match_scorers')
      .select('user_id')
      .eq('match_id', id)
      .eq('user_id', user.id)
      .single()
    if (!scorerRow) redirect('/')
  }

  const { data: eventRows } = await supabase
    .from('events')
    .select('*')
    .eq('match_id', id)
    .order('sequence', { ascending: true })

  const config = (row.config as Record<string, unknown>) ?? {}
  const match: Match = {
    id: row.id,
    sport: row.sport,
    team_a: String(config.team_a ?? 'Team A'),
    team_b: String(config.team_b ?? 'Team B'),
    status: row.status as Match['status'],
    config,
    created_at: row.created_at,
  }

  const events: SportEvent[] = (eventRows ?? []).map((e) => ({
    id: e.id as string,
    client_id: e.client_id as string,
    match_id: e.match_id as string,
    sequence: e.sequence as number,
    type: e.type as string,
    payload: (e.payload as Record<string, unknown>) ?? {},
    created_at: e.created_at as string | undefined,
  }))

  return (
    <>
      <Section spacing="lg">
        <Container width="md">
          <PageHeader
            eyebrow={`${plugin.name} · Scoring`}
            title={`${match.team_a} vs ${match.team_b}`}
          />
        </Container>
      </Section>
      <Section>
        <Container width="md">
          <ScorerController
            match={match}
            initialEvents={events}
            userId={user.id}
          />
        </Container>
      </Section>
    </>
  )
}
