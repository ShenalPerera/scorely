import React from 'react'
import { AppShell, TopNav } from '@/components/shell'
import { NavAuth } from '@/components/shell/NavAuth'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell nav={<TopNav actions={<NavAuth />} />}>
      {children}
    </AppShell>
  )
}
