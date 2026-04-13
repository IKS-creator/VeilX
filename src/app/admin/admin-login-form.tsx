'use client'

import { useState, type FormEvent } from 'react'
import { Button } from '@/components/button'
import * as api from '@/lib/admin-api'

type Props = {
  onSuccess: () => void
}

export function AdminLoginForm({ onSuccess }: Props) {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await api.login(password)
      if (res.success) {
        onSuccess()
      } else {
        setError(res.error)
      }
    } catch {
      setError('Ошибка сети. Попробуй ещё раз.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-[360px]">
      <div className="text-center">
        <h1 className="font-[family-name:var(--font-mono)] text-[1.5rem] font-bold tracking-widest uppercase text-[var(--color-accent)] neon-text">
          VeilX
        </h1>
        <p className="mt-[var(--space-xs)] font-[family-name:var(--font-mono)] text-[0.75rem] text-[var(--color-text-muted)] tracking-wide">
          admin access
        </p>
      </div>

      <div className="mt-[var(--space-xl)]">
        <label className="block font-[family-name:var(--font-mono)] text-[0.6875rem] uppercase tracking-[0.15em] text-[var(--color-text-muted)] mb-[var(--space-xs)]">
          password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          autoFocus
          className="w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-transparent px-[var(--space-md)] py-[var(--space-sm)] font-[family-name:var(--font-mono)] text-[0.875rem] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]/30 focus:border-[var(--color-accent)]/50 focus:shadow-[var(--glow-cyan)] focus:outline-none transition-all duration-200"
        />
      </div>

      {error && (
        <p className="mt-[var(--space-sm)] font-[family-name:var(--font-mono)] text-[0.8125rem] text-[var(--color-error)]">
          [err] {error}
        </p>
      )}

      <div className="mt-[var(--space-lg)]">
        <Button type="submit" full loading={loading}>
          Войти
        </Button>
      </div>
    </form>
  )
}
