import type React from 'react'
import type { LucideIcon } from 'lucide-react'

export interface SportPlugin {
  id: string
  name: string
  icon: LucideIcon
  status: 'active' | 'coming-soon'
  formats: SportFormat[]
  defaultFormat: string
  SetupForm: React.ComponentType<SetupFormProps>
  ScorerPad: React.ComponentType<ScorerPadProps>
  ScoreDisplay: React.ComponentType<ScoreDisplayProps>
  computeScore: (events: SportEvent[], match: Match) => unknown
  formatCommentary: (event: SportEvent, match: Match) => string
}

export interface SportFormat {
  id: string
  label: string
  config: Record<string, unknown>
}

export interface SportEvent {
  id?: string
  client_id: string
  match_id: string
  sequence: number
  type: string
  payload: Record<string, unknown>
  created_at?: string
}

export interface Match {
  id: string
  sport: string
  team_a: string
  team_b: string
  status: 'upcoming' | 'live' | 'completed'
  config: Record<string, unknown>
  created_at: string
}

export interface SetupFormProps {
  onSubmit: (config: Record<string, unknown>) => void | Promise<void>
  defaultConfig?: Record<string, unknown>
}

export interface ScorerPadProps {
  match: Match
  events: SportEvent[]
  onAddEvent: (
    partial: Omit<SportEvent, 'client_id' | 'sequence' | 'match_id'> & {
      client_id?: string
    }
  ) => Promise<void>
  onUndo: () => Promise<void>
}

export interface ScoreDisplayProps {
  match: Match
  events: SportEvent[]
}
