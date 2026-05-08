'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getSportPlugin } from '@/sports/registry'
import { Notice } from '@/components/ui'
import type { Match, SportEvent, ScorerPadProps } from '@/sports/_types'
import type { ConnectionStatus } from './LiveEventLog'

interface ScorerControllerProps {
  match: Match
  initialEvents: SportEvent[]
  userId: string
}

export function ScorerController({ match, initialEvents, userId }: ScorerControllerProps) {
  const [events, setEvents] = useState<SportEvent[]>(initialEvents)
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting')
  const isAlreadyLive = useRef(match.status !== 'upcoming')
  const plugin = getSportPlugin(match.sport)

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel(`scorer:${match.id}`)
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
            if (prev.some((e) => e.client_id === incoming.client_id)) {
              return prev.map((e) =>
                e.client_id === incoming.client_id ? { ...e, id: incoming.id } : e
              )
            }
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

  const handleAddEvent: ScorerPadProps['onAddEvent'] = async (partial) => {
    const clientId = partial.client_id ?? crypto.randomUUID()
    const sequence = events.reduce((max, e) => Math.max(max, e.sequence), 0) + 1

    const optimistic: SportEvent = {
      client_id: clientId,
      match_id: match.id,
      sequence,
      type: partial.type,
      payload: partial.payload ?? {},
    }

    setEvents((prev) => [...prev, optimistic].sort((a, b) => a.sequence - b.sequence))

    const res = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: clientId,
        match_id: match.id,
        sequence,
        type: partial.type,
        payload: partial.payload ?? {},
      }),
    })

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setEvents((prev) => prev.filter((e) => e.client_id !== clientId))
      throw new Error((data as { error?: string }).error ?? 'Failed to record event')
    }

    if (!isAlreadyLive.current) {
      isAlreadyLive.current = true
      const supabase = createClient()
      supabase.from('matches').update({ status: 'live' }).eq('id', match.id)
    }
  }

  const handleUndo: ScorerPadProps['onUndo'] = async () => {
    if (events.length === 0) return
    const supabase = createClient()
    const last = [...events].sort((a, b) => b.sequence - a.sequence)[0]

    setEvents((prev) => prev.filter((e) => e.client_id !== last.client_id))

    const { error } = await supabase
      .from('events')
      .delete()
      .eq('client_id', last.client_id)
      .eq('match_id', match.id)

    if (error) {
      setEvents((prev) => [...prev, last].sort((a, b) => a.sequence - b.sequence))
      throw new Error(error.message)
    }
  }

  if (!plugin) return null
  const { ScorerPad } = plugin

  return (
    <div className="flex flex-col gap-4">
      {connectionStatus === 'disconnected' && (
        <Notice tone="warning">
          Connection lost — changes will still save, but live sync is paused. Refresh to reconnect.
        </Notice>
      )}
      <ScorerPad
        match={match}
        events={events}
        onAddEvent={handleAddEvent}
        onUndo={handleUndo}
      />
    </div>
  )
}
