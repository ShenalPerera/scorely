import Link from 'next/link'
import { AppShell, TopNav, Container, Section } from '@/components/shell'
import { EmptyState } from '@/components/ui'
import { buttonVariants } from '@/components/ui/button-variants'
import { cn } from '@/lib/utils/cn'

export default function NotFound() {
  return (
    <AppShell nav={<TopNav />}>
      <Container width="sm">
        <Section spacing="lg">
          <EmptyState
            title="Page not found"
            description="This page doesn't exist or has been moved."
            action={
              <Link href="/" className={cn(buttonVariants({ variant: 'primary', size: 'md' }))}>
                Go home
              </Link>
            }
          />
        </Section>
      </Container>
    </AppShell>
  )
}
