import { Pill, LiveDot } from '@/components/ui'
import type { Match, SportEvent } from '@/sports/_types'

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected'

export interface LiveEventLogProps {
  events: SportEvent[]
  match: Match
  formatCommentary: (event: SportEvent, match: Match) => string
  connectionStatus: ConnectionStatus
}

export function LiveEventLog({
  events,
  match,
  formatCommentary,
  connectionStatus,
}: LiveEventLogProps) {
  const reversed = [...events].reverse()

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-display-sm text-text">Ball-by-ball</h2>
        {connectionStatus === 'connected' && (
          <Pill variant="live" size="sm">
            <LiveDot />
            Connected
          </Pill>
        )}
        {connectionStatus === 'connecting' && (
          <Pill variant="neutral" size="sm">Connecting…</Pill>
        )}
        {connectionStatus === 'disconnected' && (
          <Pill variant="danger" size="sm">Disconnected</Pill>
        )}
      </div>

      {reversed.length === 0 ? (
        <p className="py-8 text-center text-body-sm text-text-muted">
          No events yet — the match hasn&apos;t started.
        </p>
      ) : (
        <div className="flex flex-col">
          {reversed.map((event) => (
            <div
              key={event.client_id}
              className="flex items-center gap-3 border-b border-border py-2.5 last:border-0"
            >
              <span className="text-body-sm text-text">
                {formatCommentary(event, match)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
