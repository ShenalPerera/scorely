import type { SportFormat } from '@/sports/_types'

export const CRICKET_FORMATS: SportFormat[] = [
  {
    id: 't20',
    label: 'T20',
    config: { overs: 20, maxWickets: 10 },
  },
  {
    id: 'odi',
    label: 'ODI',
    config: { overs: 50, maxWickets: 10 },
  },
  {
    id: 'test',
    label: 'Test',
    config: { overs: null, maxWickets: 10, innings: 4 },
  },
]

export const CRICKET_DEFAULT_FORMAT = 't20'
