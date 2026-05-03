import Link from 'next/link'
import { Card, CardHeader, CardTitle, Pill, LiveDot } from '@/components/ui'
import type { Match } from '@/sports/_types'

interface MatchCardProps {
  match: Match
}

export function MatchCard({ match }: MatchCardProps) {
  return (
    <Link href={`/match/${match.id}`} className="block h-full">
      <Card interactive padding="md" className="h-full">
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
            <Pill variant="upcoming" size="sm">
              Upcoming
            </Pill>
          )}
          {match.status === 'completed' && (
            <Pill variant="completed" size="sm">
              Completed
            </Pill>
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
      </Card>
    </Link>
  )
}
