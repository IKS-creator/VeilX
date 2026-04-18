import type { ApiResponse, User } from './types'

// Wraps fetch for admin API calls. Returns parsed JSON.
// Throws 'SESSION_EXPIRED' string on 401 so callers can detect session expiry.
async function adminFetch<T>(
  url: string,
  init?: RequestInit,
): Promise<ApiResponse<T>> {
  const res = await fetch(url, { ...init, credentials: 'same-origin' })

  if (res.status === 401) {
    throw 'SESSION_EXPIRED'
  }

  if (!res.ok) {
    return { success: false, error: `Ошибка сервера (${res.status})` } as ApiResponse<T>
  }

  return res.json() as Promise<ApiResponse<T>>
}

export async function login(password: string): Promise<ApiResponse<null>> {
  const res = await fetch('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
    credentials: 'same-origin',
  })

  if (!res.ok && res.status !== 401) {
    try {
      return await res.json() as ApiResponse<null>
    } catch {
      return { success: false, error: `Ошибка сервера (${res.status})` } as ApiResponse<null>
    }
  }

  return res.json() as Promise<ApiResponse<null>>
}

export async function fetchUsers(): Promise<ApiResponse<User[]>> {
  return adminFetch('/api/admin/users')
}

type CreateInviteData = {
  user: User
  inviteUrl: string
  warning?: string
}

export async function createInvite(
  name: string,
): Promise<ApiResponse<CreateInviteData>> {
  return adminFetch('/api/admin/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  })
}

type ToggleUserData = User & { warning?: string }

export async function toggleUserStatus(
  id: number,
  status: 'active' | 'disabled',
): Promise<ApiResponse<ToggleUserData>> {
  return adminFetch(`/api/admin/users/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  })
}

export async function deleteUser(id: number): Promise<ApiResponse<null>> {
  return adminFetch(`/api/admin/users/${id}`, {
    method: 'DELETE',
  })
}

export async function syncUsers(): Promise<ApiResponse<{ synced: number; users?: User[] }>> {
  return adminFetch('/api/admin/sync', {
    method: 'POST',
  })
}

export async function refreshStats(): Promise<ApiResponse<User[]>> {
  return adminFetch('/api/admin/stats', {
    method: 'POST',
  })
}

export async function logout(): Promise<void> {
  await fetch('/api/admin/logout', {
    method: 'POST',
    credentials: 'same-origin',
  })
}
