import { BarChart2 } from 'lucide-react'
import { ComingSoon } from '@/sports/_ComingSoon'
import type { SportPlugin, SportEvent, Match } from '@/sports/_types'

const Stub = () => ComingSoon({ sport: 'Basketball' })

export const basketballPlugin: SportPlugin = {
  id: 'basketball',
  name: 'Basketball',
  icon: BarChart2,
  status: 'coming-soon',
  formats: [{ id: 'nba', label: 'NBA (4×12 min)', config: { quarters: 4, duration: 12 } }],
  defaultFormat: 'nba',
  SetupForm: Stub,
  ScorerPad: Stub,
  ScoreDisplay: Stub,
  computeScore: (_events: SportEvent[], _match: Match) => ({}),
  formatCommentary: (_event: SportEvent, _match: Match) => '',
}
