import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { getStats } from '@/lib/vps-api-client'
import { updateTrafficStats, getAllUsers } from '@/lib/db'

export async function POST() {
  try {
    const denied = await requireAdmin()
    if (denied) return denied

    const stats = await getStats()
    const entries = Object.entries(stats.users).map(([uuid, s]) => ({
      vless_uuid: uuid,
      up: s.up,
      down: s.down,
      online: s.online,
    }))

    await updateTrafficStats(entries)
    const users = await getAllUsers()

    return NextResponse.json({ success: true, data: users })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Не удалось получить статистику' },
      { status: 502 },
    )
  }
}
