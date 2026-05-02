import { cricketPlugin } from './cricket'
import { footballPlugin } from './football'
import { basketballPlugin } from './basketball'
import { tennisPlugin } from './tennis'
import type { SportPlugin } from './_types'

const registry: SportPlugin[] = [
  cricketPlugin,
  footballPlugin,
  basketballPlugin,
  tennisPlugin,
]

export type SportId = 'cricket' | 'football' | 'basketball' | 'tennis'

export function getAllSports(): SportPlugin[] {
  return registry
}

export function getSportPlugin(id: string): SportPlugin | undefined {
  return registry.find((p) => p.id === id)
}
