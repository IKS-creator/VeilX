import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { getStats, forAllServers } from '@/lib/vps-api-client'
import type { VpsStats } from '@/lib/vps-api-client'
import { updateTrafficStats, getAllUsers } from '@/lib/db'

export async function POST() {
  try {
    const denied = await requireAdmin()
    if (denied) return denied

    const { results } = await forAllServers((s) => getStats(s))

    // Merge stats from all servers by UUID
    const merged: Record<string, { up: number; down: number; online: boolean }> = {}
    for (const stats of results as VpsStats[]) {
      for (const [uuid, s] of Object.entries(stats.users)) {
        if (!merged[uuid]) merged[uuid] = { up: 0, down: 0, online: false }
        merged[uuid].up += s.up
        merged[uuid].down += s.down
        if (s.online) merged[uuid].online = true
      }
    }

    const entries = Object.entries(merged).map(([uuid, s]) => ({
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
