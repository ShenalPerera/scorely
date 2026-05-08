import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface EventBody {
  match_id: string
  client_id: string
  sequence: number
  type: string
  payload: Record<string, unknown>
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: EventBody
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { match_id, client_id, sequence, type, payload } = body

  if (!match_id || !client_id || typeof sequence !== 'number' || !type) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // Authorization: must be the match creator or an assigned scorer
  const { data: matchRow } = await supabase
    .from('matches')
    .select('created_by')
    .eq('id', match_id)
    .single()

  if (!matchRow) {
    return NextResponse.json({ error: 'Match not found' }, { status: 404 })
  }

  const isCreator = matchRow.created_by === user.id
  if (!isCreator) {
    const { data: scorerRow } = await supabase
      .from('match_scorers')
      .select('user_id')
      .eq('match_id', match_id)
      .eq('user_id', user.id)
      .single()

    if (!scorerRow) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
  }

  const { error } = await supabase.from('events').insert({
    client_id,
    match_id,
    sequence,
    type,
    payload: payload ?? {},
    created_by: user.id,
  })

  if (error) {
    // Duplicate client_id — idempotent success
    if (error.code === '23505') {
      return NextResponse.json({ ok: true, idempotent: true })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
