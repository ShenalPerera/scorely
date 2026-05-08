import Link from 'next/link'
import { Container, Section, PageHeader } from '@/components/shell'
import { Card, CardTitle, Pill } from '@/components/ui'
import { getAllSports } from '@/sports/registry'

export default function NewMatchPage() {
  const sports = getAllSports()

  return (
    <Container width="md">
      <Section spacing="lg">
        <PageHeader eyebrow="New Match" title="Choose a sport" />
      </Section>
      <Section>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {sports.map((sport) => {
            const Icon = sport.icon
            if (sport.status === 'coming-soon') {
              return (
                <div key={sport.id} className="cursor-not-allowed opacity-50">
                  <Card padding="lg" className="flex flex-col items-center gap-3 text-center">
                    <Icon className="h-8 w-8 text-text-muted" />
                    <CardTitle>{sport.name}</CardTitle>
                    <Pill variant="neutral" size="sm">Soon</Pill>
                  </Card>
                </div>
              )
            }
            return (
              <Link key={sport.id} href={`/match/new/${sport.id}`}>
                <Card interactive padding="lg" className="flex flex-col items-center gap-3 text-center">
                  <Icon className="h-8 w-8 text-accent" />
                  <CardTitle>{sport.name}</CardTitle>
                </Card>
              </Link>
            )
          })}
        </div>
      </Section>
    </Container>
  )
}
