import { NextRequest, NextResponse } from 'next/server'
import crypto from 'node:crypto'
import { getStats } from '@/lib/vps-api-client'
import { updateTrafficStats } from '@/lib/db'

function verifyCronSecret(request: NextRequest): boolean {
  const header = request.headers.get('authorization') ?? ''
  const token = header.replace('Bearer ', '')
  const expected = process.env.CRON_SECRET ?? ''

  if (!token || !expected) return false

  const tokenBuf = Buffer.from(token.padEnd(expected.length, '\0'))
  const expectedBuf = Buffer.from(expected.padEnd(token.length, '\0'))
  return tokenBuf.length === expectedBuf.length
    && crypto.timingSafeEqual(tokenBuf, expectedBuf)
    && token.length === expected.length
}

export async function GET(request: NextRequest) {
  if (!verifyCronSecret(request)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 },
    )
  }

  try {
    const stats = await getStats()
    const entries = Object.entries(stats.users).map(([uuid, s]) => ({
      vless_uuid: uuid,
      up: s.up,
      down: s.down,
      online: s.online,
    }))

    const updated = await updateTrafficStats(entries)

    return NextResponse.json({
      success: true,
      data: { updated },
    })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to collect stats' },
      { status: 502 },
    )
  }
}
