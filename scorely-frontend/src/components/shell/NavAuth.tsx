import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { buttonVariants } from '@/components/ui/button-variants'
import { cn } from '@/lib/utils/cn'
import { UserMenuButton } from './UserMenuButton'

export async function NavAuth() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return (
      <Link href="/login" className={cn(buttonVariants({ variant: 'secondary', size: 'sm' }))}>
        Sign in
      </Link>
    )
  }

  const name =
    (user.user_metadata?.full_name as string | undefined) ||
    (user.user_metadata?.name as string | undefined) ||
    ''

  return <UserMenuButton name={name} email={user.email ?? ''} />
}
