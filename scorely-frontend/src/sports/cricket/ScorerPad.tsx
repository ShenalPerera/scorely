'use client'

import { useState } from 'react'
import { Button, Card, Stat, Notice, Divider } from '@/components/ui'
import { cn } from '@/lib/utils/cn'
import {
  computeScore,
  isLegalDelivery,
  type DeliveryType,
  type WicketType,
  type CricketDeliveryPayload,
} from './events'
import type { ScorerPadProps, SportEvent } from '@/sports/_types'

// ─── Types ────────────────────────────────────────────────────────────────────

type ExtrasMode = 'none' | 'bye' | 'leg_bye'
type RunMode = 'batsman' | 'wide' | 'bye' | 'leg_bye'

// ─── Wicket config ────────────────────────────────────────────────────────────

const WICKET_LABELS: Record<WicketType, string> = {
  bowled:      'Bowled',
  caught:      'Caught',
  lbw:         'LBW',
  hit_wicket:  'Hit Wicket',
  stumped:     'Stumped',
  run_out:     'Run Out',
  obstructing: 'Obstructing',
  hit_twice:   'Hit Twice',
  timed_out:   'Timed Out',
}

// What dismissals are possible depends on the delivery type.
// Stumped is only possible off a wide (not a no ball).
// Off a no ball only run out / obstructing / hit twice are valid.
const WICKETS_BY_DELIVERY: Record<DeliveryType, WicketType[]> = {
  legal:   ['bowled', 'caught', 'lbw', 'hit_wicket', 'stumped', 'run_out', 'obstructing', 'hit_twice'],
  wide:    ['stumped', 'run_out'],
  no_ball: ['run_out', 'obstructing', 'hit_twice'],
}

// ─── Ball chip ────────────────────────────────────────────────────────────────

function BallChip({ event }: { event: SportEvent }) {
  let label = '?'
  let cls = 'bg-surface text-text border border-border'

  if (event.type === 'delivery') {
    const p = event.payload as unknown as CricketDeliveryPayload

    if (p.wicket) {
      label = 'W'
      cls = 'bg-danger text-white'
    } else if (p.delivery === 'wide') {
      label = p.wideRuns === 0 ? 'Wd' : `${p.wideRuns}W`
      cls = 'bg-warning-soft text-warning border border-warning/30'
    } else if (p.delivery === 'no_ball') {
      if (p.batsmanRuns > 0)   label = `${p.batsmanRuns}N`
      else if (p.byes > 0)     label = `${p.byes}B`
      else if (p.legByes > 0)  label = `${p.legByes}L`
      else                     label = 'Nb'
      cls = 'bg-warning-soft text-warning border border-warning/30'
    } else if (p.byes > 0) {
      label = `${p.byes}B`
      cls = 'bg-surface text-text-muted border border-border'
    } else if (p.legByes > 0) {
      label = `${p.legByes}L`
      cls = 'bg-surface text-text-muted border border-border'
    } else if (p.batsmanRuns === 6) {
      label = '6'
      cls = 'bg-accent text-accent-fg ring-2 ring-accent ring-offset-1 ring-offset-bg'
    } else if (p.batsmanRuns === 4) {
      label = '4'
      cls = 'bg-accent text-accent-fg'
    } else if (p.batsmanRuns === 0) {
      label = '•'
      cls = 'bg-surface-overlay text-text-subtle border border-border'
    } else {
      label = String(p.batsmanRuns)
    }
  } else {
    // Legacy event format
    const runs = typeof event.payload.runs === 'number' ? event.payload.runs : 0
    switch (event.type) {
      case 'wicket':
        label = 'W'; cls = 'bg-danger text-white'; break
      case 'wide':
        label = 'Wd'; cls = 'bg-warning-soft text-warning border border-warning/30'; break
      case 'no_ball':
        label = 'Nb'; cls = 'bg-warning-soft text-warning border border-warning/30'; break
      case 'bye':
        label = `${runs}B`; cls = 'bg-surface text-text-muted border border-border'; break
      case 'leg_bye':
        label = `${runs}L`; cls = 'bg-surface text-text-muted border border-border'; break
      case 'run':
        if (runs === 6)      { label = '6'; cls = 'bg-accent text-accent-fg ring-2 ring-accent ring-offset-1 ring-offset-bg' }
        else if (runs === 4) { label = '4'; cls = 'bg-accent text-accent-fg' }
        else if (runs === 0) { label = '•'; cls = 'bg-surface-overlay text-text-subtle border border-border' }
        else                 { label = String(runs) }
        break
    }
  }

  return (
    <span className={cn(
      'inline-flex h-7 min-w-7 px-1 items-center justify-center rounded-full text-label font-semibold',
      cls
    )}>
      {label}
    </span>
  )
}

// ─── Over strip helper ────────────────────────────────────────────────────────

function getCurrentOverEvents(events: SportEvent[], legalBalls: number): SportEvent[] {
  const overStart = Math.floor(legalBalls / 6) * 6
  let count = 0
  const result: SportEvent[] = []
  for (const event of events) {
    if (count >= overStart) result.push(event)
    if (isLegalDelivery(event)) count++
  }
  return result
}

// ─── Payload builder ──────────────────────────────────────────────────────────

function buildPayload(
  delivery: DeliveryType,
  extrasMode: ExtrasMode,
  runs: number,
  wicket: boolean,
  wicketType: WicketType | null,
): CricketDeliveryPayload {
  let batsmanRuns = 0
  let byes = 0
  let legByes = 0
  let wideRuns = 0
  let isBoundary = false
  let boundaryValue: 0 | 4 | 6 = 0

  if (delivery === 'wide') {
    // runs = extra runs made off the wide (0–6); penalty (1) added in computeScore.
    // All of these go to wides extras, never to the batsman.
    wideRuns = runs
    isBoundary = runs === 4 || runs === 6
    boundaryValue = runs === 4 ? 4 : runs === 6 ? 6 : 0
  } else if (extrasMode === 'bye') {
    byes = runs
    isBoundary = runs === 4
    boundaryValue = runs === 4 ? 4 : 0
  } else if (extrasMode === 'leg_bye') {
    legByes = runs
    isBoundary = runs === 4
    boundaryValue = runs === 4 ? 4 : 0
  } else {
    batsmanRuns = runs
    isBoundary = runs === 4 || runs === 6
    boundaryValue = runs === 4 ? 4 : runs === 6 ? 6 : 0
  }

  return {
    delivery,
    batsmanRuns,
    byes,
    legByes,
    wideRuns,
    isBoundary,
    boundaryValue,
    wicket,
    wicketType,
    penaltyRuns: 0,
    penaltyTo: null,
  }
}

// ─── Scorer pad ───────────────────────────────────────────────────────────────

export function ScorerPad({ match, events, onAddEvent, onUndo }: ScorerPadProps) {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deliveryMode, setDeliveryMode] = useState<DeliveryType>('legal')
  const [extrasMode, setExtrasMode] = useState<ExtrasMode>('none')
  const [showWicketPicker, setShowWicketPicker] = useState(false)

  const score = computeScore(events, match)
  const overEvents = getCurrentOverEvents(events, score.balls)

  const maxOvers = typeof match.config.overs === 'number' ? match.config.overs : null
  const maxWickets = typeof match.config.max_wickets === 'number' ? match.config.max_wickets : 10

  const isOversComplete = maxOvers !== null && score.balls >= maxOvers * 6
  const isAllOut = score.wickets >= maxWickets
  const isMatchOver = isOversComplete || isAllOut

  const runMode: RunMode =
    deliveryMode === 'wide'   ? 'wide'    :
    extrasMode === 'bye'      ? 'bye'     :
    extrasMode === 'leg_bye'  ? 'leg_bye' :
    'batsman'

  // Run button values change based on the active mode:
  // wide → only boundary options (0 = plain wide, 4, 6)
  // bye / leg_bye → 1–4 (byes to the boundary)
  // batsman → standard run values
  const runOptions: readonly number[] =
    runMode === 'wide'                          ? [0, 1, 2, 3, 4, 6] :
    runMode === 'bye' || runMode === 'leg_bye'  ? [1, 2, 3, 4] :
    [0, 1, 2, 3, 4, 6]

  const runModeLabel: string =
    runMode === 'wide'    ? 'Wide' :
    runMode === 'bye'     ? 'Byes' :
    runMode === 'leg_bye' ? 'Leg byes' :
    'Runs'

  const availableWickets = WICKETS_BY_DELIVERY[deliveryMode]

  // ── Modifier toggles ───────────────────────────────────────────────────────

  function selectDelivery(mode: DeliveryType) {
    setDeliveryMode(prev => prev === mode ? 'legal' : mode)
    if (mode === 'wide') setExtrasMode('none') // wides can't have byes
    setShowWicketPicker(false)
  }

  function selectExtras(mode: ExtrasMode) {
    setExtrasMode(prev => prev === mode ? 'none' : mode)
    setShowWicketPicker(false)
  }

  function resetModifiers() {
    setDeliveryMode('legal')
    setExtrasMode('none')
    setShowWicketPicker(false)
  }

  // ── Submission ─────────────────────────────────────────────────────────────

  async function submitDelivery(runs: number, wicket: boolean, wicketType: WicketType | null) {
    if (submitting || isMatchOver) return
    // Capture modifier state before resetting so the payload is correct.
    const payload = buildPayload(deliveryMode, extrasMode, runs, wicket, wicketType)
    setSubmitting(true)
    setError(null)
    resetModifiers()
    try {
      await onAddEvent({ type: 'delivery', payload: payload as unknown as Record<string, unknown> })
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

  // ── Button shared styles ───────────────────────────────────────────────────

  const modifierBtn = (active: boolean) => cn(
    'flex h-11 flex-1 items-center justify-center rounded-lg',
    'text-body font-medium border',
    'transition-all duration-150 active:scale-95',
    'disabled:opacity-40 disabled:pointer-events-none select-none',
    active
      ? 'bg-warning text-white border-warning'
      : 'bg-surface text-text-muted border-border hover:bg-surface-overlay hover:border-border-strong hover:text-text'
  )

  const extrasBtn = (active: boolean) => cn(
    'flex h-10 flex-1 items-center justify-center rounded-lg',
    'text-body-sm font-medium border',
    'transition-all duration-150 active:scale-95',
    'disabled:opacity-40 disabled:pointer-events-none select-none',
    active
      ? 'bg-surface-elevated text-text border-border-strong ring-1 ring-border-strong'
      : 'bg-surface text-text-muted border-border hover:bg-surface-overlay hover:text-text'
  )

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
            <Stat label="Overs" value={`${score.overs}.${score.ballsInOver}`} size="lg" align="right" />
            <Stat
              label="RR"
              value={score.runRate > 0 ? score.runRate.toFixed(2) : '—'}
              size="lg"
              align="right"
            />
          </div>
        </div>

        {overEvents.length > 0 && (
          <div className="mt-5 flex items-center gap-3">
            <span className="shrink-0 font-mono text-label uppercase text-text-subtle">
              Over {score.overs + 1}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {overEvents.map((event) => (
                <BallChip key={event.client_id} event={event} />
              ))}
            </div>
          </div>
        )}

        <p className="mt-3 text-body-sm text-text-muted">
          {isMatchOver
            ? isAllOut ? 'All out' : `${maxOvers} overs complete`
            : `Ball ${score.ballsInOver + 1} · Over ${score.overs + 1}`}
          {(score.extras.wides + score.extras.noBalls + score.extras.byes + score.extras.legByes) > 0 && (
            <span className="ml-3 text-text-subtle">
              Extras: {score.extras.wides}wd {score.extras.noBalls}nb {score.extras.byes}b {score.extras.legByes}lb
            </span>
          )}
        </p>
      </Card>

      {/* ── Notices ── */}
      {error && <Notice tone="danger">{error}</Notice>}
      {isMatchOver && (
        <Notice tone="info">
          {isAllOut ? 'All wickets down — innings complete.' : 'All overs bowled — innings complete.'}
        </Notice>
      )}

      {/* ── Delivery modifiers (Wide / No Ball) ── */}
      <div>
        <p className="mb-2 font-mono text-label uppercase text-text-subtle">Delivery</p>
        <div className="flex gap-3">
          <button
            type="button"
            disabled={submitting || isMatchOver}
            onClick={() => selectDelivery('wide')}
            className={modifierBtn(deliveryMode === 'wide')}
          >
            Wide
          </button>
          <button
            type="button"
            disabled={submitting || isMatchOver}
            onClick={() => selectDelivery('no_ball')}
            className={modifierBtn(deliveryMode === 'no_ball')}
          >
            No Ball
          </button>
        </div>
      </div>

      {/* ── Extras mode (Bye / Leg bye) — hidden when Wide active ── */}
      {deliveryMode !== 'wide' && (
        <div className="flex gap-3">
          <button
            type="button"
            disabled={submitting || isMatchOver}
            onClick={() => selectExtras('bye')}
            className={extrasBtn(extrasMode === 'bye')}
          >
            Bye
          </button>
          <button
            type="button"
            disabled={submitting || isMatchOver}
            onClick={() => selectExtras('leg_bye')}
            className={extrasBtn(extrasMode === 'leg_bye')}
          >
            Leg bye
          </button>
        </div>
      )}

      {/* ── Run / outcome buttons ── */}
      <div>
        <p className="mb-2 font-mono text-label uppercase text-text-subtle">{runModeLabel}</p>
        <div className={cn(
          'grid gap-3',
          runMode === 'bye' || runMode === 'leg_bye'
            ? 'grid-cols-4'
            : 'grid-cols-3 sm:grid-cols-6'
        )}>
          {runOptions.map((runs) => {
            // Accent = boundary hit (4 or 6), whether off the bat or off a wide
            const isAccent = (runs === 4 || runs === 6)
            return (
              <button
                key={runs}
                type="button"
                disabled={submitting || isMatchOver}
                onClick={() => submitDelivery(runs, false, null)}
                className={cn(
                  'flex h-16 items-center justify-center rounded-lg',
                  'text-display-sm font-bold border',
                  'transition-all duration-150 active:scale-95',
                  'disabled:opacity-40 disabled:pointer-events-none select-none',
                  isAccent
                    ? 'bg-accent-soft text-accent border-accent/30 hover:bg-accent hover:text-accent-fg'
                    : 'bg-surface text-text border-border hover:bg-surface-overlay hover:border-border-strong'
                )}
              >
                {runMode === 'wide' ? (runs === 0 ? 'Wd' : String(runs)) : String(runs)}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Wicket ── */}
      <div>
        <button
          type="button"
          disabled={submitting || isMatchOver || score.wickets >= maxWickets}
          onClick={() => setShowWicketPicker(prev => !prev)}
          className={cn(
            'flex h-14 w-full items-center justify-center gap-2 rounded-lg',
            'text-display-sm font-bold border',
            'transition-all duration-150 active:scale-[0.98]',
            'disabled:opacity-40 disabled:pointer-events-none select-none',
            showWicketPicker
              ? 'bg-danger text-white border-danger'
              : 'border-danger/30 bg-danger-soft text-danger hover:bg-danger hover:text-white hover:border-danger'
          )}
        >
          Wicket
          {deliveryMode !== 'legal' && (
            <span className="text-body-sm font-normal opacity-75">
              ({deliveryMode === 'wide' ? 'stumped / run out' : 'run out only'})
            </span>
          )}
        </button>

        {/* Inline dismissal type picker */}
        {showWicketPicker && (
          <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {availableWickets.map((wt) => (
              <button
                key={wt}
                type="button"
                disabled={submitting}
                onClick={() => submitDelivery(0, true, wt)}
                className={cn(
                  'flex h-10 items-center justify-center rounded-lg',
                  'text-body-sm font-medium border',
                  'bg-surface text-text border-border',
                  'hover:bg-danger-soft hover:text-danger hover:border-danger/30',
                  'transition-all duration-150 active:scale-95',
                  'disabled:opacity-40 disabled:pointer-events-none select-none'
                )}
              >
                {WICKET_LABELS[wt]}
              </button>
            ))}
          </div>
        )}
      </div>

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
