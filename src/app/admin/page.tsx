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
  const [statsStale, setStatsStale] = useState(false)
  // BUG-4: preserve invite name across session expiry
  const [savedInviteName, setSavedInviteName] = useState('')
  const { showError } = useToast()

  const handleSessionExpired = useCallback(() => {
    setIsLoggedIn(false)
    showError('Сессия истекла')
  }, [showError])

  const handleLogout = useCallback(async () => {
    await api.logout()
    setIsLoggedIn(false)
    setUsers([])
  }, [])

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

  // Poll traffic stats: immediately on login, then every 60s
  useEffect(() => {
    if (!isLoggedIn) return

    async function pollStats() {
      try {
        const res = await api.refreshStats()
        if (res.success) {
          setUsers(res.data)
          setStatsStale(false)
        } else {
          setStatsStale(true)
        }
      } catch (e) {
        if (e === 'SESSION_EXPIRED') {
          handleSessionExpired()
        } else {
          setStatsStale(true)
        }
      }
    }

    // First poll immediately — don't wait 60s for fresh stats
    pollStats()
    const interval = setInterval(pollStats, 60_000)
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
        onLogout={handleLogout}
        statsStale={statsStale}
        savedInviteName={savedInviteName}
        onInviteNameChange={setSavedInviteName}
      />
    </main>
  )
}
