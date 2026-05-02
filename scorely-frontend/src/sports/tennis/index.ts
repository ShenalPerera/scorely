import { CircleDot } from 'lucide-react'
import { ComingSoon } from '@/sports/_ComingSoon'
import type { SportPlugin, SportEvent, Match } from '@/sports/_types'

const Stub = () => ComingSoon({ sport: 'Tennis' })

export const tennisPlugin: SportPlugin = {
  id: 'tennis',
  name: 'Tennis',
  icon: CircleDot,
  status: 'coming-soon',
  formats: [
    { id: 'best-of-3', label: 'Best of 3', config: { sets: 3 } },
    { id: 'best-of-5', label: 'Best of 5', config: { sets: 5 } },
  ],
  defaultFormat: 'best-of-3',
  SetupForm: Stub,
  ScorerPad: Stub,
  ScoreDisplay: Stub,
  computeScore: (_events: SportEvent[], _match: Match) => ({}),
  formatCommentary: (_event: SportEvent, _match: Match) => '',
}
