import { Trophy } from 'lucide-react'
import { ComingSoon } from '@/sports/_ComingSoon'
import type { SportPlugin, SportEvent, Match } from '@/sports/_types'

const Stub = () => ComingSoon({ sport: 'Football' })

export const footballPlugin: SportPlugin = {
  id: 'football',
  name: 'Football',
  icon: Trophy,
  status: 'coming-soon',
  formats: [{ id: '90min', label: '90 min', config: { duration: 90 } }],
  defaultFormat: '90min',
  SetupForm: Stub,
  ScorerPad: Stub,
  ScoreDisplay: Stub,
  computeScore: (_events: SportEvent[], _match: Match) => ({}),
  formatCommentary: (_event: SportEvent, _match: Match) => '',
}
