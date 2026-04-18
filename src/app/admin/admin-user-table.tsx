'use client'

import { useState } from 'react'
import type { User } from '@/lib/types'
import { Badge } from '@/components/badge'
import { Button } from '@/components/button'
import { CopyButton } from '@/components/copy-button'
import { Card } from '@/components/card'
import { Modal } from '@/components/modal'
import { useToast } from '@/components/toast-provider'
import { formatTrafficPair, formatTrafficExact } from '@/lib/format-traffic'
import * as api from '@/lib/admin-api'

type Props = {
  users: User[]
  loading: boolean
  error: string
  onRefresh: () => Promise<void>
  onSessionExpired: () => void
  onVpsWarning: () => void
}

function formatDate(iso: string | null, createdAt: string): { text: string; dim: boolean } {
  if (!iso) {
    const age = Date.now() - new Date(createdAt).getTime()
    const isNew = age < 24 * 60 * 60 * 1000
    return { text: isNew ? '\u043d\u043e\u0432\u044b\u0439' : '\u043d\u0438\u043a\u043e\u0433\u0434\u0430', dim: !isNew }
  }
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  // UTC+3
  const utc3 = new Date(d.getTime() + 3 * 60 * 60 * 1000)
  return {
    text: `${pad(utc3.getUTCDate())}.${pad(utc3.getUTCMonth() + 1)}.${utc3.getUTCFullYear()} ${pad(utc3.getUTCHours())}:${pad(utc3.getUTCMinutes())}`,
    dim: false,
  }
}

function SkeletonRow() {
  return (
    <tr className="border-b border-[var(--color-border)]/50">
      <td className="px-[var(--space-sm)] py-[var(--space-sm)]">
        <span className="block h-3 w-[60%] animate-pulse rounded bg-[var(--color-border)]" />
      </td>
      <td className="px-[var(--space-sm)] py-[var(--space-sm)]">
        <span className="block h-3 w-12 animate-pulse rounded bg-[var(--color-border)]" />
      </td>
      <td className="px-[var(--space-sm)] py-[var(--space-sm)]">
        <span className="block h-3 w-[60%] animate-pulse rounded bg-[var(--color-border)]" />
      </td>
      <td className="px-[var(--space-sm)] py-[var(--space-sm)]">
        <span className="block h-3 w-[60%] animate-pulse rounded bg-[var(--color-border)]" />
      </td>
      <td className="px-[var(--space-sm)] py-[var(--space-sm)]">
        <span className="block ml-auto h-3 w-[120px] animate-pulse rounded bg-[var(--color-border)]" />
      </td>
    </tr>
  )
}

export function AdminUserTable({ users, loading, error, onRefresh, onSessionExpired, onVpsWarning }: Props) {
  const [actionId, setActionId] = useState<number | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')
  const { showSuccess, showError: toastError } = useToast()

  async function withAction(id: number, fn: () => Promise<boolean>) {
    setActionId(id)
    try {
      const ok = await fn()
      if (ok) await onRefresh()
    } catch (err) {
      if (err === 'SESSION_EXPIRED') {
        onSessionExpired()
        return
      }
      toastError('Ошибка сети. Попробуй ещё раз.')
    } finally {
      setActionId(null)
    }
  }

  async function handleToggle(user: User) {
    const newStatus = user.status === 'active' ? 'disabled' : 'active'
    await withAction(user.id, async () => {
      const res = await api.toggleUserStatus(user.id, newStatus)
      if (res.success) {
        if (res.data.warning) {
          toastError(res.data.warning)
          onVpsWarning()
        } else {
          showSuccess(newStatus === 'active' ? 'Пользователь включён' : 'Пользователь отключён')
        }
        return true
      }
      toastError(res.error)
      return false
    })
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    setDeleteError('')
    try {
      const res = await api.deleteUser(deleteTarget.id)
      if (res.success) {
        const name = deleteTarget.name
        setDeleteTarget(null)
        showSuccess(`${name} удалён`)
        await onRefresh()
      } else {
        setDeleteError(res.error)
      }
    } catch (err) {
      if (err === 'SESSION_EXPIRED') {
        setDeleteTarget(null)
        onSessionExpired()
        return
      }
      setDeleteError('Ошибка сети. Попробуй ещё раз.')
    } finally {
      setDeleting(false)
    }
  }

  if (error) {
    return (
      <div className="rounded-[var(--radius-sm)] border border-[var(--color-warning)]/30 bg-[var(--color-warning)]/5 px-[var(--space-md)] py-[var(--space-sm)] font-[family-name:var(--font-mono)] text-[0.8125rem] text-[var(--color-warning)]">
        [error] Не удалось загрузить данные. Попробуй обновить страницу.
      </div>
    )
  }

  if (!loading && users.length === 0) {
    return (
      <Card muted center>
        <p className="font-[family-name:var(--font-mono)] text-[0.875rem] text-[var(--color-text-muted)]">
          Пока никого нет. Создай первый инвайт.
        </p>
      </Card>
    )
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] border-collapse">
          <thead>
            <tr className="border-b border-[var(--color-accent)]/10">
              <th className="px-[var(--space-sm)] py-[var(--space-sm)] text-left font-[family-name:var(--font-mono)] text-[0.6875rem] font-normal uppercase tracking-[0.15em] text-[var(--color-text-muted)]">
                Имя
              </th>
              <th className="px-[var(--space-sm)] py-[var(--space-sm)] text-left font-[family-name:var(--font-mono)] text-[0.6875rem] font-normal uppercase tracking-[0.15em] text-[var(--color-text-muted)]">
                Статус
              </th>
              <th className="px-[var(--space-sm)] py-[var(--space-sm)] text-left font-[family-name:var(--font-mono)] text-[0.6875rem] font-normal uppercase tracking-[0.15em] text-[var(--color-text-muted)]">
                Трафик
              </th>
              <th className="px-[var(--space-sm)] py-[var(--space-sm)] text-left font-[family-name:var(--font-mono)] text-[0.6875rem] font-normal uppercase tracking-[0.15em] text-[var(--color-text-muted)]">
                Подключение
              </th>
              <th className="px-[var(--space-sm)] py-[var(--space-sm)] text-right font-[family-name:var(--font-mono)] text-[0.6875rem] font-normal uppercase tracking-[0.15em] text-[var(--color-text-muted)]">
                Действия
              </th>
            </tr>
          </thead>
          <tbody>
            {loading && users.length === 0 && Array.from({ length: 5 }).map((_, i) => (
              <SkeletonRow key={i} />
            ))}
            {users.map((user) => {
              const busy = actionId === user.id
              return (
                <tr
                  key={user.id}
                  className="border-b border-[var(--color-border)]/50 transition-colors duration-150 hover:bg-[var(--color-surface-dim)]"
                >
                  <td className="px-[var(--space-sm)] py-[var(--space-sm)] font-[family-name:var(--font-mono)] text-[0.875rem] text-[var(--color-text)]">
                    {user.name}
                  </td>
                  <td className="px-[var(--space-sm)] py-[var(--space-sm)]">
                    <Badge status={user.status} />
                  </td>
                  <td
                    className="px-[var(--space-sm)] py-[var(--space-sm)] font-[family-name:var(--font-mono)] text-[0.8125rem] text-[var(--color-text-muted)] tabular-nums"
                    title={`\u2191 ${formatTrafficExact(user.traffic_up)}\n\u2193 ${formatTrafficExact(user.traffic_down)}`}
                  >
                    {formatTrafficPair(user.traffic_up, user.traffic_down)}
                  </td>
                  {(() => {
                    const conn = formatDate(user.last_connected_at, user.created_at)
                    return (
                      <td className={`px-[var(--space-sm)] py-[var(--space-sm)] font-[family-name:var(--font-mono)] text-[0.8125rem] tabular-nums ${conn.dim ? 'text-[var(--color-text-muted)]/50' : 'text-[var(--color-text-muted)]'}`}>
                        {conn.text}
                      </td>
                    )
                  })()}
                  <td className="px-[var(--space-sm)] py-[var(--space-sm)]">
                    <div className="flex items-center justify-end gap-[var(--space-sm)]">
                      <CopyButton
                        text={`https://veilx.app/c/${user.token}`}
                        label="Ссылка"
                        variant="secondary"
                      />
                      <Button
                        variant="secondary"
                        loading={busy}
                        disabled={busy}
                        onClick={() => handleToggle(user)}
                      >
                        {user.status === 'active' ? 'Откл' : 'Вкл'}
                      </Button>
                      <Button
                        variant="danger"
                        disabled={busy}
                        onClick={() => setDeleteTarget(user)}
                      >
                        Удалить
                      </Button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Delete confirmation modal */}
      <Modal open={!!deleteTarget} onClose={() => { if (!deleting) { setDeleteTarget(null); setDeleteError('') } }} titleId="delete-modal-title">
        <h3 id="delete-modal-title" className="font-[family-name:var(--font-mono)] text-[1rem] font-semibold text-[var(--color-error)]">
          <span className="text-[var(--color-text-muted)]">&gt;</span> Удалить {deleteTarget?.name}?
        </h3>
        <p className="mt-[var(--space-sm)] font-[family-name:var(--font-mono)] text-[0.8125rem] text-[var(--color-text-muted)]">
          Это действие необратимо. Пользователь будет удалён с сервера.
        </p>
        {deleteError && (
          <p className="mt-[var(--space-sm)] font-[family-name:var(--font-mono)] text-[0.8125rem] text-[var(--color-error)]">
            [err] {deleteError}
          </p>
        )}
        <div className="mt-[var(--space-lg)] flex gap-[var(--space-sm)] justify-end">
          <Button variant="secondary" onClick={() => { setDeleteTarget(null); setDeleteError('') }} disabled={deleting}>
            Отмена
          </Button>
          <Button variant="danger" onClick={handleDelete} loading={deleting}>
            Удалить
          </Button>
        </div>
      </Modal>
    </>
  )
}
