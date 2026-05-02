import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Container, Section, PageHeader } from '@/components/shell'
import { Notice } from '@/components/ui'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const name =
    (user.user_metadata?.full_name as string | undefined) ||
    (user.user_metadata?.name as string | undefined) ||
    user.email?.split('@')[0] ||
    'Scorer'

  return (
    <Container width="lg">
      <Section spacing="lg">
        <PageHeader
          eyebrow="Dashboard"
          title={`Welcome, ${name}`}
          description="Your matches will appear here."
        />
        <Notice tone="info" title="Coming in Phase 4">
          The full dashboard — live matches, upcoming fixtures, and scoring controls — will be built next.
        </Notice>
      </Section>
    </Container>
  )
}
