'use client'

import { useState } from 'react'
import { Button, Input, Segmented } from '@/components/ui'
import { CRICKET_FORMATS, CRICKET_DEFAULT_FORMAT } from './config'
import type { SetupFormProps } from '@/sports/_types'

type FormatId = 't20' | 'odi' | 'test'

const FORMAT_OPTIONS = CRICKET_FORMATS.map((f) => ({
  value: f.id as FormatId,
  label: f.label,
}))

export function SetupForm({ onSubmit, defaultConfig = {} }: SetupFormProps) {
  const [teamA, setTeamA] = useState(
    typeof defaultConfig.team_a === 'string' ? defaultConfig.team_a : ''
  )
  const [teamB, setTeamB] = useState(
    typeof defaultConfig.team_b === 'string' ? defaultConfig.team_b : ''
  )
  const [format, setFormat] = useState<FormatId>(
    typeof defaultConfig.format === 'string'
      ? (defaultConfig.format as FormatId)
      : CRICKET_DEFAULT_FORMAT
  )
  const [errors, setErrors] = useState<{ teamA?: string; teamB?: string }>({})
  const [loading, setLoading] = useState(false)

  const selectedFormat = CRICKET_FORMATS.find((f) => f.id === format)!
  const overs = selectedFormat.config.overs

  function validate() {
    const next: typeof errors = {}
    if (!teamA.trim()) next.teamA = 'Team name required'
    if (!teamB.trim()) next.teamB = 'Team name required'
    return next
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const next = validate()
    if (Object.keys(next).length) {
      setErrors(next)
      return
    }
    setErrors({})
    setLoading(true)
    try {
      await onSubmit({
        team_a: teamA.trim(),
        team_b: teamB.trim(),
        format,
        overs,
        max_wickets: selectedFormat.config.maxWickets ?? 10,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <Input
        label="Team A"
        placeholder="e.g. Mumbai Indians"
        value={teamA}
        onChange={(e) => setTeamA(e.target.value)}
        error={errors.teamA}
      />

      <Input
        label="Team B"
        placeholder="e.g. Chennai Super Kings"
        value={teamB}
        onChange={(e) => setTeamB(e.target.value)}
        error={errors.teamB}
      />

      <div className="flex flex-col gap-2">
        <span className="text-label-lg uppercase text-text-muted">Format</span>
        <Segmented
          options={FORMAT_OPTIONS}
          value={format}
          onChange={(v) => setFormat(v)}
          block
        />
      </div>

      <Input
        label="Overs per innings"
        value={overs === null ? 'Unlimited (Test)' : String(overs)}
        readOnly
        hint="Auto-set by format"
      />

      <Button type="submit" variant="primary" block disabled={loading}>
        {loading ? 'Creating…' : 'Create match'}
      </Button>
    </form>
  )
}
