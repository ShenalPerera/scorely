import { Activity } from 'lucide-react'
import { CRICKET_FORMATS, CRICKET_DEFAULT_FORMAT } from './config'
import { computeScore, formatCommentary } from './events'
import { SetupForm } from './SetupForm'
import { ScorerPad } from './ScorerPad'
import { ScoreDisplay } from './ScoreDisplay'
import type { SportPlugin } from '@/sports/_types'

export const cricketPlugin: SportPlugin = {
  id: 'cricket',
  name: 'Cricket',
  icon: Activity,
  status: 'active',
  formats: CRICKET_FORMATS,
  defaultFormat: CRICKET_DEFAULT_FORMAT,
  SetupForm,
  ScorerPad,
  ScoreDisplay,
  computeScore,
  formatCommentary,
}
