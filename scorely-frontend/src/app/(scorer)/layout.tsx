import { AppShell, TopNav } from '@/components/shell'
import { NavAuth } from '@/components/shell/NavAuth'
import React from "react";

export default function ScorerLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell nav={<TopNav actions={<NavAuth />} />}>
      {children}
    </AppShell>
  )
}
