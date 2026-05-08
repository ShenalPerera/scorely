import { Container, Section } from '@/components/shell'
import { Skeleton } from '@/components/ui'

export default function MatchLoading() {
  return (
    <>
      <Section spacing="lg">
        <Container width="md">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="mt-3 h-9 w-64" />
        </Container>
      </Section>
      <Section>
        <Container width="md">
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="mt-6 h-64 w-full rounded-xl" />
        </Container>
      </Section>
    </>
  )
}
