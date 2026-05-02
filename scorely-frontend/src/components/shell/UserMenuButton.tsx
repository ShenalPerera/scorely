'use client'

import { useEffect, useRef, useState } from 'react'
import { Avatar } from '@/components/ui'
import { cn } from '@/lib/utils/cn'

interface UserMenuButtonProps {
  name: string
  email: string
}

export function UserMenuButton({ name, email }: UserMenuButtonProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="User menu"
        className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
      >
        <Avatar name={name || email} size="sm" />
      </button>

      {open && (
        <div
          className={cn(
            'absolute right-0 top-full mt-2 w-56 z-50',
            'rounded-lg border border-border bg-surface-elevated shadow-lg',
            'flex flex-col overflow-hidden'
          )}
        >
          <div className="px-4 py-3 border-b border-border">
            <p className="text-body-sm font-medium text-text truncate">{name || 'Account'}</p>
            <p className="text-body-sm text-text-muted truncate">{email}</p>
          </div>

          <form action="/auth/signout" method="POST" className="p-1">
            <button
              type="submit"
              className={cn(
                'w-full rounded-md px-3 py-2 text-left text-body-sm text-text-muted',
                'hover:bg-surface-overlay hover:text-text transition-colors'
              )}
            >
              Sign out
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
