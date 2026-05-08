import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Plus, Trophy } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Container, Section, PageHeader } from '@/components/shell'
import { Card, CardHeader, CardTitle, Pill, LiveDot, EmptyState } from '@/components/ui'
import { buttonVariants } from '@/components/ui/button-variants'
import { cn } from '@/lib/utils/cn'
import type { Match } from '@/sports/_types'

interface DbMatch {
  id: string
  sport: string
  status: string
  config: Record<string, unknown> | null
  created_at: string
  created_by: string
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

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const name =
    (user.user_metadata?.full_name as string | undefined) ||
    (user.user_metadata?.name as string | undefined) ||
    user.email?.split('@')[0] ||
    'Scorer'

  // Matches the user can score (creator or assigned scorer)
  const { data: scorerRows } = await supabase
    .from('match_scorers')
    .select('match_id')
    .eq('user_id', user.id)

  const scorableIds = new Set((scorerRows ?? []).map((r) => r.match_id as string))

  // Matches created by user
  const { data: createdRows } = await supabase
    .from('matches')
    .select('id, sport, status, config, created_at, created_by')
    .eq('created_by', user.id)
    .order('created_at', { ascending: false })

  // Matches where user is scorer but not creator
  const scorerOnlyIds = [...scorableIds].filter(
    (id) => !(createdRows ?? []).some((m) => m.id === id)
  )

  let assignedRows: DbMatch[] = []
  if (scorerOnlyIds.length > 0) {
    const { data } = await supabase
      .from('matches')
      .select('id, sport, status, config, created_at, created_by')
      .in('id', scorerOnlyIds)
      .order('created_at', { ascending: false })
    assignedRows = (data ?? []) as DbMatch[]
  }

  const allMatches = [...(createdRows ?? []) as DbMatch[], ...assignedRows]
    .map(toMatch)
    .sort((a, b) => (STATUS_ORDER[a.status] ?? 99) - (STATUS_ORDER[b.status] ?? 99))

  const canScore = (matchId: string, createdBy: string) =>
    createdBy === user.id || scorableIds.has(matchId)

  const liveMatches = allMatches.filter((m) => m.status === 'live')
  const upcomingMatches = allMatches.filter((m) => m.status === 'upcoming')
  const completedMatches = allMatches.filter((m) => m.status === 'completed')

  return (
    <Container width="lg">
      <Section spacing="lg">
        <PageHeader
          eyebrow="Dashboard"
          title={`Welcome, ${name}`}
          description="Your matches — live, upcoming, and completed."
          actions={
            <Link
              href="/match/new"
              className={cn(buttonVariants({ variant: 'primary', size: 'md' }))}
            >
              <Plus className="h-4 w-4" />
              New match
            </Link>
          }
        />
      </Section>

      {allMatches.length === 0 ? (
        <Section>
          <EmptyState
            icon={<Trophy />}
            title="No matches yet"
            description="Create your first match to start scoring."
            action={
              <Link
                href="/match/new"
                className={cn(buttonVariants({ variant: 'primary', size: 'md' }))}
              >
                <Plus className="h-4 w-4" />
                New match
              </Link>
            }
          />
        </Section>
      ) : (
        <>
          {liveMatches.length > 0 && (
            <Section>
              <h2 className="mb-4 text-display-sm text-text">Live</h2>
              <MatchGrid
                matches={liveMatches}
                scorableIds={scorableIds}
                userId={user.id}
                rawRows={[...((createdRows ?? []) as DbMatch[]), ...assignedRows]}
              />
            </Section>
          )}
          {upcomingMatches.length > 0 && (
            <Section>
              <h2 className="mb-4 text-display-sm text-text">Upcoming</h2>
              <MatchGrid
                matches={upcomingMatches}
                scorableIds={scorableIds}
                userId={user.id}
                rawRows={[...((createdRows ?? []) as DbMatch[]), ...assignedRows]}
              />
            </Section>
          )}
          {completedMatches.length > 0 && (
            <Section>
              <h2 className="mb-4 text-display-sm text-text">Completed</h2>
              <MatchGrid
                matches={completedMatches}
                scorableIds={scorableIds}
                userId={user.id}
                rawRows={[...((createdRows ?? []) as DbMatch[]), ...assignedRows]}
              />
            </Section>
          )}
        </>
      )}
    </Container>
  )
}

function MatchGrid({
  matches,
  scorableIds,
  userId,
  rawRows,
}: {
  matches: Match[]
  scorableIds: Set<string>
  userId: string
  rawRows: DbMatch[]
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {matches.map((match) => {
        const raw = rawRows.find((r) => r.id === match.id)
        const userCanScore = raw
          ? raw.created_by === userId || scorableIds.has(match.id)
          : false
        return (
          <Card key={match.id} padding="md">
            <CardHeader>
              <span className="text-label uppercase text-text-subtle capitalize">
                {match.sport}
              </span>
              {match.status === 'live' && (
                <Pill variant="live" size="sm">
                  <LiveDot />
                  Live
                </Pill>
              )}
              {match.status === 'upcoming' && (
                <Pill variant="upcoming" size="sm">Upcoming</Pill>
              )}
              {match.status === 'completed' && (
                <Pill variant="completed" size="sm">Completed</Pill>
              )}
            </CardHeader>
            <CardTitle>
              {match.team_a} vs {match.team_b}
            </CardTitle>
            {!!match.config.format && (
              <p className="mt-1 text-body-sm text-text-muted">
                {String(match.config.format)}
              </p>
            )}
            <div className="mt-4 flex gap-2">
              <Link
                href={`/match/${match.id}`}
                className={cn(buttonVariants({ variant: 'secondary', size: 'sm' }))}
              >
                View public
              </Link>
              {userCanScore && match.status !== 'completed' && (
                <Link
                  href={`/match/${match.id}/score`}
                  className={cn(buttonVariants({ variant: 'primary', size: 'sm' }))}
                >
                  Score →
                </Link>
              )}
            </div>
          </Card>
        )
      })}
    </div>
  )
}
