import { Container, Section } from '@/components/shell'
import { Skeleton } from '@/components/ui'

export default function PublicLoading() {
  return (
    <Container width="lg">
      <Section spacing="lg">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-2 h-5 w-72" />
      </Section>
      <Section>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      </Section>
    </Container>
  )
}
