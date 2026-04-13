'use client'

import { useState, type FormEvent } from 'react'
import { Button } from '@/components/button'
import { CopyButton } from '@/components/copy-button'
import { useToast } from '@/components/toast-provider'
import * as api from '@/lib/admin-api'

const MAX_USERS = 20

type Props = {
  userCount: number
  onRefresh: () => Promise<void>
  onSessionExpired: () => void
  onVpsWarning: () => void
  name: string
  onNameChange: (name: string) => void
}

export function AdminInviteForm({
  userCount,
  onRefresh,
  onSessionExpired,
  onVpsWarning,
  name,
  onNameChange,
}: Props) {
  const [loading, setLoading] = useState(false)
  const [inviteUrl, setInviteUrl] = useState('')
  const { showSuccess, showError } = useToast()

  if (userCount >= MAX_USERS) {
    return (
      <p className="font-[family-name:var(--font-mono)] text-[0.8125rem] text-[var(--color-text-muted)]">
        [limit] Достигнут лимит в {MAX_USERS} пользователей. Удали неактивных, чтобы создать новых.
      </p>
    )
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return

    setLoading(true)
    setInviteUrl('')

    try {
      const res = await api.createInvite(trimmed)
      if (res.success) {
        setInviteUrl(res.data.inviteUrl)
        onNameChange('')
        if (res.data.warning) {
          showError(res.data.warning)
          onVpsWarning()
        } else {
          showSuccess('Инвайт создан')
        }
        await onRefresh()
      } else {
        showError(res.error)
      }
    } catch (err) {
      if (err === 'SESSION_EXPIRED') {
        onSessionExpired()
        return
      }
      showError('Ошибка сети. Попробуй ещё раз.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="mb-[var(--space-md)] font-[family-name:var(--font-mono)] text-[0.875rem] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
        <span className="text-[var(--color-accent)]">+</span> Создать инвайт
      </h2>
      <form onSubmit={handleSubmit} className="flex gap-[var(--space-sm)]">
        <input
          id="invite-name"
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="имя_пользователя"
          aria-label="Имя пользователя"
          maxLength={50}
          className="flex-1 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-transparent px-[var(--space-md)] py-[var(--space-sm)] font-[family-name:var(--font-mono)] text-[0.875rem] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]/50 focus:border-[var(--color-accent)]/50 focus:shadow-[var(--glow-cyan)] focus:outline-none transition-all duration-200"
        />
        <Button
          type="submit"
          loading={loading}
          disabled={!name.trim()}
        >
          Создать
        </Button>
      </form>

      {inviteUrl && (
        <div className="mt-[var(--space-md)] flex items-center gap-[var(--space-sm)] rounded-[var(--radius-sm)] border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/5 px-[var(--space-md)] py-[var(--space-sm)]">
          <span className="flex-1 truncate font-[family-name:var(--font-mono)] text-[0.8125rem] text-[var(--color-accent)]">
            {inviteUrl}
          </span>
          <CopyButton text={inviteUrl} variant="secondary" />
        </div>
      )}
    </div>
  )
}
