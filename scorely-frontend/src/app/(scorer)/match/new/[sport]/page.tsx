import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getSportPlugin } from '@/sports/registry'
import { Container, Section, PageHeader } from '@/components/shell'
import { NewMatchClient } from './NewMatchClient'

interface NewMatchSportPageProps {
  params: Promise<{ sport: string }>
}

export default async function NewMatchSportPage({ params }: NewMatchSportPageProps) {
  const { sport } = await params
  const plugin = getSportPlugin(sport)
  if (!plugin) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <Container width="sm">
      <Section spacing="lg">
        <PageHeader
          eyebrow={plugin.name}
          title="Set up your match"
          description="Fill in the details below. You can start scoring as soon as the match is created."
        />
      </Section>
      <Section>
        <NewMatchClient sport={sport} userId={user.id} />
      </Section>
    </Container>
  )
}
