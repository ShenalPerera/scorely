import { notFound } from 'next/navigation'
import { Container, Section, PageHeader } from '@/components/shell'
import { MatchListClient } from '@/components/match'
import { createClient } from '@/lib/supabase/server'
import { getSportPlugin, getAllSports } from '@/sports/registry'
import type { Match } from '@/sports/_types'

interface DbMatch {
  id: string
  sport: string
  status: string
  config: Record<string, unknown> | null
  created_at: string
}

function toMatch(row: DbMatch): Match {
  const config = row.config ?? {}
  return {
    id: row.id,
    sport: row.sport,
    team_a: String(config.team_a ?? 'Team A'),
    team_b: String(config.team_b ?? 'Team B'),
    status: row.status as Match['status'],
    config,
    created_at: row.created_at,
  }
}

const STATUS_ORDER: Record<string, number> = { live: 0, upcoming: 1, completed: 2 }

interface SportPageProps {
  params: Promise<{ sport: string }>
}

export default async function SportPage({ params }: SportPageProps) {
  const { sport } = await params
  const plugin = getSportPlugin(sport)
  if (!plugin) notFound()

  const supabase = await createClient()
  const { data: rows } = await supabase
    .from('matches')
    .select('id, sport, status, config, created_at')
    .eq('sport', sport)
    .order('created_at', { ascending: false })

  const matches: Match[] = (rows ?? [])
    .map(toMatch)
    .sort((a, b) => (STATUS_ORDER[a.status] ?? 99) - (STATUS_ORDER[b.status] ?? 99))

  const sportOptions = getAllSports().map((s) => ({
    id: s.id,
    name: s.name,
    disabled: s.status === 'coming-soon',
  }))

  return (
    <>
      <Section spacing="lg">
        <Container>
          <PageHeader
            eyebrow={plugin.name}
            title={`${plugin.name} matches`}
            description={`Live and upcoming ${plugin.name.toLowerCase()} matches. Watch the score update in real time.`}
          />
        </Container>
      </Section>
      <Section>
        <Container>
          <MatchListClient
            matches={matches}
            sportOptions={sportOptions}
            defaultFilter={sport}
          />
        </Container>
      </Section>
    </>
  )
}
