'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getSportPlugin } from '@/sports/registry'
import { LiveEventLog, type ConnectionStatus } from './LiveEventLog'
import type { Match, SportEvent } from '@/sports/_types'

interface SpectatorViewProps {
  match: Match
  initialEvents: SportEvent[]
}

export function SpectatorView({ match, initialEvents }: SpectatorViewProps) {
  const [events, setEvents] = useState<SportEvent[]>(initialEvents)
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting')

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
        if (s === 'SUBSCRIBED') setConnectionStatus('connected')
        else if (s === 'CLOSED' || s === 'CHANNEL_ERROR') setConnectionStatus('disconnected')
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [match.id])

  if (!plugin) return null

  const { ScoreDisplay } = plugin

  return (
    <div className="flex flex-col gap-10">
      {/* ScoreDisplay receives the same live events array — updates on every new event */}
      <ScoreDisplay match={match} events={events} />

      {/* LiveEventLog is purely presentational — SpectatorView owns the subscription */}
      <LiveEventLog
        events={events}
        match={match}
        formatCommentary={plugin.formatCommentary}
        connectionStatus={connectionStatus}
      />
    </div>
  )
}
