'use client'

import { EmptyState } from '@/components/ui'

export function ComingSoon({ sport }: { sport: string }) {
  return (
    <EmptyState
      title="Coming soon"
      description={`${sport} scoring is on the way.`}
    />
  )
}
