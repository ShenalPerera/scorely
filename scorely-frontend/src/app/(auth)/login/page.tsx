'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AppShell, TopNav, Container, Section, PageHeader } from '@/components/shell'
import { Button, Input, Notice, Divider } from '@/components/ui'
import { createClient } from '@/lib/supabase/client'

type Mode = 'signin' | 'signup'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [mode, setMode] = useState<Mode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    if (searchParams.get('error') === 'auth') {
      setError('Authentication failed — please try again.')
    }
  }, [searchParams])

  async function handleGoogleSignIn() {
    setError(null)
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/auth/callback` },
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setInfo(null)
    setLoading(true)

    try {
      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) { setError(error.message); return }
        router.push('/dashboard')
        router.refresh()
      } else {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) { setError(error.message); return }
        setInfo('Check your email for a confirmation link, then sign in.')
        setMode('signin')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppShell nav={<TopNav />}>
      <Container width="sm">
        <Section spacing="lg">
          <PageHeader
            eyebrow={mode === 'signin' ? 'Welcome back' : 'Get started'}
            title={mode === 'signin' ? 'Sign in to Scorely' : 'Create your account'}
          />

          <div className="flex flex-col gap-6">
            {/* Google OAuth */}
            <Button variant="secondary" block onClick={handleGoogleSignIn}>
              Continue with Google
            </Button>

            <Divider label="or" />

            {/* Error / info */}
            {error && <Notice tone="danger">{error}</Notice>}
            {info && <Notice tone="info">{info}</Notice>}

            {/* Email + password form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                hint={mode === 'signup' ? 'At least 6 characters' : undefined}
              />
              <Button type="submit" variant="primary" block disabled={loading}>
                {loading
                  ? mode === 'signin' ? 'Signing in…' : 'Creating account…'
                  : mode === 'signin' ? 'Sign in' : 'Create account'}
              </Button>
            </form>

            {/* Mode toggle */}
            <p className="text-body-sm text-text-muted text-center">
              {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
              <button
                type="button"
                className="text-accent underline-offset-2 hover:underline"
                onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(null); setInfo(null) }}
              >
                {mode === 'signin' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </Section>
      </Container>
    </AppShell>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
