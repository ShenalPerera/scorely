import { Container, Section } from '@/components/shell'
import { Skeleton } from '@/components/ui'

export default function DashboardLoading() {
  return (
    <Container width="lg">
      <Section spacing="lg">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="mt-3 h-9 w-56" />
        <Skeleton className="mt-2 h-5 w-80" />
      </Section>
      <Section>
        <Skeleton className="mb-4 h-7 w-16" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      </Section>
    </Container>
  )
}
