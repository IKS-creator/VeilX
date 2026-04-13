'use client'

import { useState } from 'react'
import { Button } from '@/components/button'
import { useToast } from '@/components/toast-provider'
import * as api from '@/lib/admin-api'

type Props = {
  onRefresh: () => Promise<void>
  onSessionExpired: () => void
}

export function AdminSyncButton({ onRefresh, onSessionExpired }: Props) {
  const [loading, setLoading] = useState(false)
  const { showSuccess, showError } = useToast()

  async function handleSync() {
    setLoading(true)
    try {
      const res = await api.syncUsers()
      if (res.success) {
        showSuccess(`Синхронизировано: ${res.data.synced}`)
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
    <Button variant="secondary" loading={loading} onClick={handleSync}>
      Sync
    </Button>
  )
}
