import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// Mock external deps before importing route
vi.mock('@/lib/vps-api-client', () => ({
  getStats: vi.fn(),
}))

vi.mock('@/lib/db', () => ({
  updateTrafficStats: vi.fn(),
}))

import { GET } from './route'
import { getStats } from '@/lib/vps-api-client'
import { updateTrafficStats } from '@/lib/db'

const CRON_SECRET = 'test-cron-secret-123'

function makeRequest(authHeader?: string): NextRequest {
  const headers = new Headers()
  if (authHeader) headers.set('authorization', authHeader)
  return new NextRequest('http://localhost/api/cron/stats', { headers })
}

describe('GET /api/cron/stats', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.stubEnv('CRON_SECRET', CRON_SECRET)
  })

  it('returns 401 without authorization header', async () => {
    const res = await GET(makeRequest())
    expect(res.status).toBe(401)
    const body = await res.json()
    expect(body.success).toBe(false)
  })

  it('returns 401 with wrong token', async () => {
    const res = await GET(makeRequest('Bearer wrong-token'))
    expect(res.status).toBe(401)
  })

  it('returns 401 with empty bearer', async () => {
    const res = await GET(makeRequest('Bearer '))
    expect(res.status).toBe(401)
  })

  it('returns 200 and updates stats on valid token', async () => {
    const mockStats = {
      users: {
        'uuid-aaa': { up: 1000, down: 5000, online: true },
        'uuid-bbb': { up: 200, down: 300, online: false },
      },
    }
    vi.mocked(getStats).mockResolvedValue(mockStats)
    vi.mocked(updateTrafficStats).mockResolvedValue(2)

    const res = await GET(makeRequest(`Bearer ${CRON_SECRET}`))
    expect(res.status).toBe(200)

    const body = await res.json()
    expect(body.success).toBe(true)
    expect(body.data.updated).toBe(2)

    expect(updateTrafficStats).toHaveBeenCalledWith([
      { vless_uuid: 'uuid-aaa', up: 1000, down: 5000, online: true },
      { vless_uuid: 'uuid-bbb', up: 200, down: 300, online: false },
    ])
  })

  it('returns 200 with 0 updated when no users in stats', async () => {
    vi.mocked(getStats).mockResolvedValue({ users: {} })
    vi.mocked(updateTrafficStats).mockResolvedValue(0)

    const res = await GET(makeRequest(`Bearer ${CRON_SECRET}`))
    const body = await res.json()
    expect(body.success).toBe(true)
    expect(body.data.updated).toBe(0)
  })

  it('returns 502 when VPS API fails', async () => {
    vi.mocked(getStats).mockRejectedValue(new Error('VPS timeout'))

    const res = await GET(makeRequest(`Bearer ${CRON_SECRET}`))
    expect(res.status).toBe(502)

    const body = await res.json()
    expect(body.success).toBe(false)
    expect(body.error).toBe('Failed to collect stats')
  })

  it('returns 502 when DB update fails', async () => {
    vi.mocked(getStats).mockResolvedValue({
      users: { 'uuid-x': { up: 100, down: 200, online: true } },
    })
    vi.mocked(updateTrafficStats).mockRejectedValue(new Error('DB error'))

    const res = await GET(makeRequest(`Bearer ${CRON_SECRET}`))
    expect(res.status).toBe(502)
  })
})
