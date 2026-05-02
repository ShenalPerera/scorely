import type { SportEvent, Match } from '@/sports/_types'

// ─── Event payload types ───────────────────────────────────────────────────────

export type CricketEventType =
  | 'run'
  | 'wicket'
  | 'wide'
  | 'no_ball'
  | 'bye'
  | 'leg_bye'

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
  overs: number        // completed overs
  ballsInOver: number  // 0–5
  runRate: number
  extras: CricketExtras
}

// ─── Pure helpers ──────────────────────────────────────────────────────────────

export function isLegalDelivery(type: string): boolean {
  return type === 'run' || type === 'wicket' || type === 'bye' || type === 'leg_bye'
}

export function runsFromEvent(type: string, payload: Record<string, unknown>): number {
  const runs = typeof payload.runs === 'number' ? payload.runs : 0
  if (type === 'wide' || type === 'no_ball') {
    // 1 penalty + any additional runs
    return 1 + runs
  }
  return runs
}

export function eventLabel(type: string, payload: Record<string, unknown>): string {
  const runs = typeof payload.runs === 'number' ? payload.runs : 0
  switch (type as CricketEventType) {
    case 'run':
      return runs === 0 ? 'Dot ball' : runs === 1 ? '1 run' : `${runs} runs`
    case 'wicket':
      return `Wicket! ${runs > 0 ? `(${runs} runs)` : ''}`
    case 'wide':
      return `Wide${runs > 0 ? ` +${runs}` : ''}`
    case 'no_ball':
      return `No ball${runs > 0 ? ` +${runs}` : ''}`
    case 'bye':
      return `Bye${runs > 0 ? ` (${runs})` : ''}`
    case 'leg_bye':
      return `Leg bye${runs > 0 ? ` (${runs})` : ''}`
    default:
      return type
  }
}

// ─── Score computation ─────────────────────────────────────────────────────────

export function computeScore(events: SportEvent[], _match: Match): CricketScore {
  let runs = 0
  let wickets = 0
  let balls = 0
  const extras: CricketExtras = { wides: 0, noBalls: 0, byes: 0, legByes: 0 }

  for (const event of events) {
    const type = event.type as CricketEventType
    const payload = event.payload
    const eventRuns = typeof payload.runs === 'number' ? payload.runs : 0

    runs += runsFromEvent(type, payload)

    if (type === 'wicket') wickets += 1
    if (type === 'wide') extras.wides += 1 + eventRuns
    if (type === 'no_ball') extras.noBalls += 1 + eventRuns
    if (type === 'bye') extras.byes += eventRuns
    if (type === 'leg_bye') extras.legByes += eventRuns

    if (isLegalDelivery(type)) balls += 1
  }

  const overs = Math.floor(balls / 6)
  const ballsInOver = balls % 6
  const oversDecimal = overs + ballsInOver / 10
  const runRate = oversDecimal > 0 ? parseFloat((runs / (balls / 6)).toFixed(2)) : 0

  return { runs, wickets, balls, overs, ballsInOver, runRate, extras }
}

// ─── Commentary ────────────────────────────────────────────────────────────────

export function formatCommentary(event: SportEvent, _match: Match): string {
  return eventLabel(event.type, event.payload)
}
