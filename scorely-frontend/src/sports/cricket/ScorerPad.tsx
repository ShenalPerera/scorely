'use client'

import { useState } from 'react'
import { Button, Card, Stat, Notice, Divider } from '@/components/ui'
import { cn } from '@/lib/utils/cn'
import { computeScore, isLegalDelivery, type CricketEventType } from './events'
import type { ScorerPadProps, SportEvent } from '@/sports/_types'

// ─── Ball chip helpers ─────────────────────────────────────────────────────────

function ballLabel(type: string, payload: Record<string, unknown>): string {
  const runs = typeof payload.runs === 'number' ? payload.runs : 0
  switch (type) {
    case 'wicket':  return 'W'
    case 'wide':    return 'Wd'
    case 'no_ball': return 'Nb'
    case 'bye':     return runs > 0 ? `${runs}B` : 'B'
    case 'leg_bye': return runs > 0 ? `${runs}L` : 'Lb'
    case 'run':     return String(runs)
    default:        return '?'
  }
}

function BallChip({ event }: { event: SportEvent }) {
  const { type, payload } = event
  const runs = typeof payload.runs === 'number' ? payload.runs : 0
  return (
    <span
      className={cn(
        'inline-flex h-7 w-7 items-center justify-center rounded-full text-label font-semibold',
        type === 'wicket' && 'bg-danger text-white',
        (type === 'wide' || type === 'no_ball') &&
          'bg-warning-soft text-warning border border-warning/30',
        type === 'run' && runs === 6 &&
          'bg-accent text-accent-fg ring-2 ring-accent ring-offset-1 ring-offset-bg',
        type === 'run' && runs === 4 && 'bg-accent text-accent-fg',
        type === 'run' && runs === 0 &&
          'bg-surface-overlay text-text-subtle border border-border',
        type === 'run' && runs > 0 && runs !== 4 && runs !== 6 &&
          'bg-surface text-text border border-border',
        (type === 'bye' || type === 'leg_bye') &&
          'bg-surface text-text-muted border border-border',
      )}
    >
      {ballLabel(type, payload)}
    </span>
  )
}

// ─── Current over events ───────────────────────────────────────────────────────

function getCurrentOverEvents(events: SportEvent[], legalBalls: number): SportEvent[] {
  const overStartBall = Math.floor(legalBalls / 6) * 6
  let count = 0
  const result: SportEvent[] = []
  for (const event of events) {
    if (count >= overStartBall) result.push(event)
    if (isLegalDelivery(event.type)) count++
  }
  return result
}

// ─── Scorer pad ────────────────────────────────────────────────────────────────

export function ScorerPad({ match, events, onAddEvent, onUndo }: ScorerPadProps) {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const score = computeScore(events, match)
  const overEvents = getCurrentOverEvents(events, score.balls)

  const maxOvers =
    typeof match.config.overs === 'number' ? match.config.overs : null
  const maxWickets =
    typeof match.config.max_wickets === 'number' ? match.config.max_wickets : 10

  const isOversComplete = maxOvers !== null && score.balls >= maxOvers * 6
  const isAllOut = score.wickets >= maxWickets
  const isMatchOver = isOversComplete || isAllOut

  async function send(type: CricketEventType, runs = 0) {
    if (submitting || isMatchOver) return
    setSubmitting(true)
    setError(null)
    try {
      await onAddEvent({ type, payload: { runs } })
    } catch {
      setError('Failed to record — tap again to retry.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleUndo() {
    if (submitting || events.length === 0) return
    setSubmitting(true)
    setError(null)
    try {
      await onUndo()
    } catch {
      setError('Undo failed — please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-5">

      {/* ── Score header ── */}
      <Card padding="lg">
        <div className="flex items-start justify-between gap-4">
          <Stat
            label={match.team_a}
            value={`${score.runs}/${score.wickets}`}
            size="score-xl"
            accent
          />
          <div className="flex gap-5 pt-1">
            <Stat
              label="Overs"
              value={`${score.overs}.${score.ballsInOver}`}
              size="lg"
              align="right"
            />
            <Stat
              label="RR"
              value={score.runRate > 0 ? score.runRate.toFixed(2) : '—'}
              size="lg"
              align="right"
            />
          </div>
        </div>

        {/* Over strip */}
        {overEvents.length > 0 && (
          <div className="mt-5 flex items-center gap-3">
            <span className="text-label uppercase text-text-subtle font-mono shrink-0">
              Over {score.overs + 1}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {overEvents.map((event) => (
                <BallChip key={event.client_id} event={event} />
              ))}
            </div>
          </div>
        )}

        {/* Next ball indicator */}
        <p className="mt-3 text-body-sm text-text-muted">
          {isMatchOver
            ? isAllOut
              ? 'All out'
              : `${maxOvers} overs complete`
            : `Ball ${score.ballsInOver + 1} · Over ${score.overs + 1}`}
          {score.extras.wides + score.extras.noBalls + score.extras.byes + score.extras.legByes > 0 && (
            <span className="ml-3 text-text-subtle">
              Extras: {score.extras.wides}wd {score.extras.noBalls}nb {score.extras.byes}b {score.extras.legByes}lb
            </span>
          )}
        </p>
      </Card>

      {/* ── Error notice ── */}
      {error && <Notice tone="danger">{error}</Notice>}

      {/* ── Match over notice ── */}
      {isMatchOver && (
        <Notice tone="info">
          {isAllOut ? 'All wickets down — innings complete.' : 'All overs bowled — innings complete.'}
        </Notice>
      )}

      {/* ── Run buttons ── */}
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {([0, 1, 2, 3, 4, 6] as const).map((runs) => (
          <button
            key={runs}
            type="button"
            disabled={submitting || isMatchOver}
            onClick={() => send('run', runs)}
            className={cn(
              'flex h-16 items-center justify-center rounded-lg',
              'text-display-sm font-bold border',
              'transition-all duration-150 active:scale-95',
              'disabled:opacity-40 disabled:pointer-events-none select-none',
              runs === 4 || runs === 6
                ? 'bg-accent-soft text-accent border-accent/30 hover:bg-accent hover:text-accent-fg'
                : 'bg-surface text-text border-border hover:bg-surface-overlay hover:border-border-strong'
            )}
          >
            {runs}
          </button>
        ))}
      </div>

      {/* ── Extras ── */}
      <Divider label="Extras" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {(
          [
            { type: 'wide' as CricketEventType, label: 'Wide', runs: 0 },
            { type: 'no_ball' as CricketEventType, label: 'No ball', runs: 0 },
            { type: 'bye' as CricketEventType, label: 'Bye', runs: 1 },
            { type: 'leg_bye' as CricketEventType, label: 'Leg bye', runs: 1 },
          ] as const
        ).map(({ type, label, runs }) => (
          <button
            key={type}
            type="button"
            disabled={submitting || isMatchOver}
            onClick={() => send(type, runs)}
            className={cn(
              'flex h-12 items-center justify-center rounded-lg',
              'text-body font-medium border border-border',
              'bg-surface text-text',
              'hover:bg-surface-overlay hover:border-border-strong',
              'transition-all duration-150 active:scale-95',
              'disabled:opacity-40 disabled:pointer-events-none select-none'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Wicket ── */}
      <button
        type="button"
        disabled={submitting || isMatchOver || score.wickets >= maxWickets}
        onClick={() => send('wicket', 0)}
        className={cn(
          'flex h-14 w-full items-center justify-center rounded-lg',
          'text-display-sm font-bold',
          'border border-danger/30 bg-danger-soft text-danger',
          'hover:bg-danger hover:text-white hover:border-danger',
          'transition-all duration-150 active:scale-[0.98]',
          'disabled:opacity-40 disabled:pointer-events-none select-none'
        )}
      >
        Wicket
      </button>

      {/* ── Controls ── */}
      <Divider />
      <div className="flex gap-3">
        <Button
          variant="secondary"
          onClick={handleUndo}
          disabled={submitting || events.length === 0}
          className="flex-1"
        >
          ↩ Undo
        </Button>
        <Button
          variant="ghost"
          disabled
          className="flex-1 cursor-not-allowed opacity-40"
        >
          End innings
        </Button>
      </div>
    </div>
  )
}
