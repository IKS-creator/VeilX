'use client'

import { useState, useEffect, useCallback } from 'react'
import { Spinner } from '@/components/spinner'
import { useToast } from '@/components/toast-provider'
import { AdminLoginForm } from './admin-login-form'
import { AdminDashboard } from './admin-dashboard'
import * as api from '@/lib/admin-api'
import type { User } from '@/lib/types'

export default function AdminPage() {
  const [checking, setChecking] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [usersLoading, setUsersLoading] = useState(false)
  const [usersError, setUsersError] = useState('')
  const [vpsError, setVpsError] = useState(false)
  // BUG-4: preserve invite name across session expiry
  const [savedInviteName, setSavedInviteName] = useState('')
  const { showError } = useToast()

  const handleSessionExpired = useCallback(() => {
    setIsLoggedIn(false)
    showError('Сессия истекла')
  }, [showError])

  const setVpsWarning = useCallback(() => setVpsError(true), [])

  const loadUsers = useCallback(async () => {
    setUsersLoading(true)
    setUsersError('')
    try {
      const res = await api.fetchUsers()
      if (res.success) {
        setUsers(res.data)
        setVpsError(false)
      } else {
        setUsersError(res.error)
      }
    } catch (e) {
      if (e === 'SESSION_EXPIRED') {
        handleSessionExpired()
        return
      }
      setUsersError('Ошибка сети. Попробуй ещё раз.')
      showError('Ошибка сети. Попробуй ещё раз.')
    } finally {
      setUsersLoading(false)
    }
  }, [handleSessionExpired, showError])

  // Check session on mount
  useEffect(() => {
    api.fetchUsers()
      .then((res) => {
        if (res.success) {
          setIsLoggedIn(true)
          setUsers(res.data)
        }
      })
      .catch(() => {
        // Not logged in or network error — show login
      })
      .finally(() => setChecking(false))
  }, [])

  // Auto-poll traffic stats every 60s while logged in
  useEffect(() => {
    if (!isLoggedIn) return

    const interval = setInterval(async () => {
      try {
        const res = await api.refreshStats()
        if (res.success) {
          setUsers(res.data)
        }
      } catch (e) {
        if (e === 'SESSION_EXPIRED') {
          handleSessionExpired()
        }
      }
    }, 60_000)

    return () => clearInterval(interval)
  }, [isLoggedIn, handleSessionExpired])

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <Spinner className="h-8 w-8" />
      </main>
    )
  }

  if (!isLoggedIn) {
    return (
      <main className="cyber-grid mx-auto flex min-h-screen max-w-[640px] items-center justify-center px-[var(--space-md)] md:px-[var(--space-lg)]">
        <AdminLoginForm
          onSuccess={() => {
            setIsLoggedIn(true)
            loadUsers()
          }}
        />
      </main>
    )
  }

  return (
    <main className="cyber-grid mx-auto max-w-[1024px] px-[var(--space-md)] py-[var(--space-2xl)] md:px-[var(--space-lg)]">
      <AdminDashboard
        users={users}
        loading={usersLoading}
        error={usersError}
        vpsError={vpsError}
        onRefresh={loadUsers}
        onSessionExpired={handleSessionExpired}
        onVpsWarning={setVpsWarning}
        savedInviteName={savedInviteName}
        onInviteNameChange={setSavedInviteName}
      />
    </main>
  )
}
