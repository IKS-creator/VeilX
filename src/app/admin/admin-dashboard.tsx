'use client'

import type { User } from '@/lib/types'
import { AdminInviteForm } from './admin-invite-form'
import { AdminUserTable } from './admin-user-table'
import { AdminSyncButton } from './admin-sync-button'

type Props = {
  users: User[]
  loading: boolean
  error: string
  vpsError: boolean
  onRefresh: () => Promise<void>
  onSessionExpired: () => void
  onVpsWarning: () => void
  savedInviteName: string
  onInviteNameChange: (name: string) => void
}

export function AdminDashboard({
  users,
  loading,
  error,
  vpsError,
  onRefresh,
  onSessionExpired,
  onVpsWarning,
  savedInviteName,
  onInviteNameChange,
}: Props) {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-[var(--space-lg)]">
        <div>
          <h1 className="font-[family-name:var(--font-mono)] text-[1.5rem] font-bold tracking-wider uppercase text-[var(--color-accent)] neon-text">
            <span className="text-[var(--color-text-muted)]">&gt;</span> Панель управления
          </h1>
          <p className="mt-[var(--space-xs)] font-[family-name:var(--font-mono)] text-[0.75rem] text-[var(--color-text-muted)] tracking-wide">
            {users.length}/20 пользователей
          </p>
        </div>
        <AdminSyncButton
          onRefresh={onRefresh}
          onSessionExpired={onSessionExpired}
        />
      </div>

      {vpsError && (
        <div className="mt-[var(--space-md)] rounded-[var(--radius-sm)] border border-[var(--color-warning)]/30 bg-[var(--color-warning)]/5 px-[var(--space-md)] py-[var(--space-sm)] font-[family-name:var(--font-mono)] text-[0.8125rem] text-[var(--color-warning)]">
          [warn] Не удалось получить статистику с сервера. Данные о трафике могут быть неактуальны.
        </div>
      )}

      <div className="mt-[var(--space-xl)]">
        <AdminInviteForm
          userCount={users.length}
          onRefresh={onRefresh}
          onSessionExpired={onSessionExpired}
          onVpsWarning={onVpsWarning}
          name={savedInviteName}
          onNameChange={onInviteNameChange}
        />
      </div>

      <div className="mt-[var(--space-xl)]">
        <AdminUserTable
          users={users}
          loading={loading}
          error={error}
          onRefresh={onRefresh}
          onSessionExpired={onSessionExpired}
          onVpsWarning={onVpsWarning}
        />
      </div>
    </div>
  )
}
