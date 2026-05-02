'use client'

import { Card, CardHeader, CardTitle } from '@/components/ui'
import type { ScorerPadProps } from '@/sports/_types'

export function ScorerPad({ match }: ScorerPadProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{match.team_a} vs {match.team_b}</CardTitle>
      </CardHeader>
      <p className="text-text-muted text-body px-4 pb-4">
        Cricket scorer pad — coming in Phase 5
      </p>
    </Card>
  )
}
