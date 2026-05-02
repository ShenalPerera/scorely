'use client'

import { Card, Stat, Pill, Divider } from '@/components/ui'
import { computeScore } from './events'
import type { ScoreDisplayProps } from '@/sports/_types'

export function ScoreDisplay({ match, events }: ScoreDisplayProps) {
  const score = computeScore(events, match)
  const oversLabel = `${score.overs}.${score.ballsInOver}`

  return (
    <Card className="p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-body text-text-muted">{match.team_a} vs {match.team_b}</span>
        {match.status === 'live' && <Pill variant="live">Live</Pill>}
        {match.status === 'completed' && <Pill variant="completed">Completed</Pill>}
        {match.status === 'upcoming' && <Pill variant="upcoming">Upcoming</Pill>}
      </div>

      <Divider />

      <div className="flex items-end gap-8">
        <Stat
          label={match.team_a}
          value={`${score.runs}/${score.wickets}`}
          size="score-xl"
          accent
        />
        <div className="flex flex-col gap-3 pb-1">
          <Stat
            label="Overs"
            value={oversLabel}
            size="lg"
          />
          <Stat
            label="Run rate"
            value={score.runRate.toFixed(2)}
            size="lg"
          />
        </div>
      </div>

      {(score.extras.wides > 0 ||
        score.extras.noBalls > 0 ||
        score.extras.byes > 0 ||
        score.extras.legByes > 0) && (
        <p className="text-body-sm text-text-muted">
          Extras: {score.extras.wides}wd · {score.extras.noBalls}nb · {score.extras.byes}b · {score.extras.legByes}lb
        </p>
      )}
    </Card>
  )
}
