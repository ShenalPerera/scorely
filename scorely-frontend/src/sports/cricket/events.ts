import type { SportEvent, Match } from '@/sports/_types'

// ─── Delivery types ───────────────────────────────────────────────────────────

export type DeliveryType = 'legal' | 'wide' | 'no_ball'

export type WicketType =
  | 'bowled'
  | 'caught'
  | 'lbw'
  | 'hit_wicket'
  | 'stumped'
  | 'run_out'
  | 'obstructing'
  | 'hit_twice'
  | 'timed_out'

export interface CricketDeliveryPayload {
  delivery: DeliveryType
  batsmanRuns: number
  byes: number
  legByes: number
  // Runs made while the ball is a wide (0–6). Penalty (1) is added on top.
  // e.g. wideRuns=0 → 1 extra; wideRuns=4 → 5 extras (boundary wide).
  wideRuns: number
  isBoundary: boolean
  boundaryValue: 0 | 4 | 6
  wicket: boolean
  wicketType: WicketType | null
  penaltyRuns: number
  penaltyTo: 'batting' | 'fielding' | null
}

// ─── Score shape ──────────────────────────────────────────────────────────────

export interface CricketExtras {
  wides: number
  noBalls: number
  byes: number
  legByes: number
}

export interface CricketScore {
  runs: number
  wickets: number
  balls: number        // legal deliveries only
  overs: number
  ballsInOver: number  // 0–5
  runRate: number
  extras: CricketExtras
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Total wide extras = 1 (penalty) + wideRuns (0 for plain wide, 1–3 run, 4/6 boundary).
function wideExtras(p: CricketDeliveryPayload): number {
  return 1 + p.wideRuns
}

export function isLegalDelivery(event: SportEvent): boolean {
  if (event.type === 'delivery') {
    return (event.payload as unknown as CricketDeliveryPayload).delivery === 'legal'
  }
  // Legacy event types
  return (
    event.type === 'run' ||
    event.type === 'wicket' ||
    event.type === 'bye' ||
    event.type === 'leg_bye'
  )
}

// ─── Score computation ────────────────────────────────────────────────────────

export function computeScore(events: SportEvent[], _match: Match): CricketScore {
  let runs = 0
  let wickets = 0
  let balls = 0
  const extras: CricketExtras = { wides: 0, noBalls: 0, byes: 0, legByes: 0 }

  for (const event of events) {
    if (event.type === 'delivery') {
      const p = event.payload as unknown as CricketDeliveryPayload

      runs += p.batsmanRuns
      runs += p.byes
      extras.byes += p.byes
      runs += p.legByes
      extras.legByes += p.legByes

      if (p.delivery === 'wide') {
        const w = wideExtras(p)
        runs += w
        extras.wides += w
      }

      if (p.delivery === 'no_ball') {
        runs += 1
        extras.noBalls += 1
      }

      if (p.wicket) wickets += 1

      if (p.penaltyRuns > 0 && p.penaltyTo === 'batting') {
        runs += p.penaltyRuns
      }

      if (p.delivery === 'legal') balls += 1
    } else {
      // Legacy event format (backward compatibility with pre-structured events)
      const type = event.type
      const payload = event.payload
      const eventRuns = typeof payload.runs === 'number' ? payload.runs : 0

      if (type === 'wide' || type === 'no_ball') runs += 1 + eventRuns
      else runs += eventRuns

      if (type === 'wicket') wickets += 1
      if (type === 'wide') extras.wides += 1 + eventRuns
      if (type === 'no_ball') extras.noBalls += 1 + eventRuns
      if (type === 'bye') extras.byes += eventRuns
      if (type === 'leg_bye') extras.legByes += eventRuns
      if (isLegalDelivery(event)) balls += 1
    }
  }

  const overs = Math.floor(balls / 6)
  const ballsInOver = balls % 6
  const runRate = balls > 0 ? parseFloat((runs / (balls / 6)).toFixed(2)) : 0

  return { runs, wickets, balls, overs, ballsInOver, runRate, extras }
}

// ─── Commentary ────────────────────────────────────────────────────────────────

const WICKET_COMMENTARY: Record<WicketType, string> = {
  bowled: 'Bowled!',
  caught: 'Caught!',
  lbw: 'LBW!',
  hit_wicket: 'Hit wicket!',
  stumped: 'Stumped!',
  run_out: 'Run out!',
  obstructing: 'Obstructing the field!',
  hit_twice: 'Hit ball twice!',
  timed_out: 'Timed out!',
}

export function formatCommentary(event: SportEvent, _match: Match): string {
  if (event.type === 'delivery') {
    const p = event.payload as unknown as CricketDeliveryPayload
    const parts: string[] = []

    if (p.delivery === 'wide') parts.push('Wide')
    if (p.delivery === 'no_ball') parts.push('No ball')
    if (p.wicket && p.wicketType) parts.push(WICKET_COMMENTARY[p.wicketType])

    if (p.batsmanRuns > 0) {
      if (p.isBoundary && p.boundaryValue === 6) parts.push('SIX!')
      else if (p.isBoundary && p.boundaryValue === 4) parts.push('FOUR!')
      else parts.push(p.batsmanRuns === 1 ? '1 run' : `${p.batsmanRuns} runs`)
    } else if (!p.wicket && p.delivery === 'legal' && p.byes === 0 && p.legByes === 0) {
      parts.push('Dot ball')
    }

    if (p.byes > 0) parts.push(`${p.byes} bye${p.byes !== 1 ? 's' : ''}`)
    if (p.legByes > 0) parts.push(`${p.legByes} leg bye${p.legByes !== 1 ? 's' : ''}`)
    if (p.penaltyRuns > 0) parts.push(`${p.penaltyRuns} penalty runs`)

    return parts.join(' · ') || 'Delivery'
  }

  // Legacy events
  const payload = event.payload
  const runs = typeof payload.runs === 'number' ? payload.runs : 0
  switch (event.type) {
    case 'run':     return runs === 0 ? 'Dot ball' : runs === 1 ? '1 run' : `${runs} runs`
    case 'wicket':  return 'Wicket!'
    case 'wide':    return 'Wide'
    case 'no_ball': return 'No ball'
    case 'bye':     return `${runs} bye${runs !== 1 ? 's' : ''}`
    case 'leg_bye': return `${runs} leg bye${runs !== 1 ? 's' : ''}`
    default:        return event.type
  }
}
