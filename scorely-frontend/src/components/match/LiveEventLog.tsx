'use client'

import { useState, useEffect } from 'react'
import { Pill, LiveDot } from '@/components/ui'
import { createClient } from '@/lib/supabase/client'
import { getSportPlugin } from '@/sports/registry'
import type { Match, SportEvent } from '@/sports/_types'

export interface LiveEventLogProps {
  match: Match
  initialEvents: SportEvent[]
}

type ConnectionStatus = 'connecting' | 'connected' | 'disconnected'

export function LiveEventLog({ match, initialEvents }: LiveEventLogProps) {
  const [events, setEvents] = useState<SportEvent[]>(initialEvents)
  const [status, setStatus] = useState<ConnectionStatus>('connecting')

  const plugin = getSportPlugin(match.sport)

  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel(`match-events:${match.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'events',
          filter: `match_id=eq.${match.id}`,
        },
        (payload) => {
          const row = payload.new as Record<string, unknown>
          const incoming: SportEvent = {
            id: row.id as string,
            client_id: row.client_id as string,
            match_id: row.match_id as string,
            sequence: row.sequence as number,
            type: row.type as string,
            payload: (row.payload as Record<string, unknown>) ?? {},
            created_at: row.created_at as string | undefined,
          }
          setEvents((prev) => {
            if (prev.some((e) => e.client_id === incoming.client_id)) return prev
            return [...prev, incoming].sort((a, b) => a.sequence - b.sequence)
          })
        }
      )
      .subscribe((s) => {
        if (s === 'SUBSCRIBED') setStatus('connected')
        else if (s === 'CLOSED' || s === 'CHANNEL_ERROR') setStatus('disconnected')
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [match.id])

  const reversed = [...events].reverse()

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-display-sm text-text">Ball-by-ball</h2>
        {status === 'connected' && (
          <Pill variant="live" size="sm">
            <LiveDot />
            Connected
          </Pill>
        )}
        {status === 'connecting' && (
          <Pill variant="neutral" size="sm">
            Connecting…
          </Pill>
        )}
        {status === 'disconnected' && (
          <Pill variant="danger" size="sm">
            Disconnected
          </Pill>
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
                {plugin?.formatCommentary(event, match) ?? event.type}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
