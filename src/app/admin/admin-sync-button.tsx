'use client'

import { useState } from 'react'
import { Button } from '@/components/button'
import { useToast } from '@/components/toast-provider'
import * as api from '@/lib/admin-api'

type Props = {
  onRefresh: () => Promise<void>
  onSessionExpired: () => void
}

function formatTime(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function AdminSyncButton({ onRefresh, onSessionExpired }: Props) {
  const [loading, setLoading] = useState(false)
  const [lastSync, setLastSync] = useState<string | null>(null)
  const { showSuccess, showError } = useToast()

  async function handleSync() {
    setLoading(true)
    try {
      const res = await api.syncUsers()
      if (res.success) {
        showSuccess(`Синхронизировано: ${res.data.synced}`)
        setLastSync(formatTime(new Date()))
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
    <div className="flex items-center gap-[var(--space-sm)]">
      {lastSync && (
        <span className="font-[family-name:var(--font-mono)] text-[0.6875rem] text-[var(--color-text-muted)] tabular-nums">
          синхр: {lastSync}
        </span>
      )}
      <Button variant="secondary" loading={loading} onClick={handleSync}>
        Sync
      </Button>
    </div>
  )
}
