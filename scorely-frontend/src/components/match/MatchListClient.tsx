'use client'

import { useState } from 'react'
import { Trophy } from 'lucide-react'
import { Segmented, type SegmentedOption, EmptyState } from '@/components/ui'
import { MatchCard } from './MatchCard'
import type { Match } from '@/sports/_types'

export interface SportFilterOption {
  id: string
  name: string
  disabled: boolean
}

type FilterValue = 'all' | string

interface MatchListClientProps {
  matches: Match[]
  sportOptions: SportFilterOption[]
  defaultFilter?: string
}

export function MatchListClient({
  matches,
  sportOptions,
  defaultFilter = 'all',
}: MatchListClientProps) {
  const [filter, setFilter] = useState<FilterValue>(defaultFilter)

  const segmentedOptions: SegmentedOption<FilterValue>[] = [
    { value: 'all', label: 'All' },
    ...sportOptions.map((s) => ({
      value: s.id,
      label: s.name,
      disabled: s.disabled,
    })),
  ]

  const filtered =
    filter === 'all' ? matches : matches.filter((m) => m.sport === filter)

  return (
    <div className="flex flex-col gap-6">
      <Segmented
        options={segmentedOptions}
        value={filter}
        onChange={setFilter}
      />

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Trophy />}
          title="No matches yet"
          description="Matches will appear here once a scorer creates one."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      )}
    </div>
  )
}
