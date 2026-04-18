import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { getActiveUuids, updateTrafficStats, getAllUsers } from '@/lib/db'
import { getStats, syncUsers, forAllServers } from '@/lib/vps-api-client'
import type { VpsStats } from '@/lib/vps-api-client'

export async function POST() {
  try {
    const denied = await requireAdmin()
    if (denied) return denied

    // Collect stats BEFORE sync — sync restarts Xray which resets all counters.
    // Without this, any accumulated traffic since last poll is permanently lost.
    try {
      const { results } = await forAllServers((s) => getStats(s))
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
        vless_uuid: uuid, up: s.up, down: s.down, online: s.online,
      }))
      if (entries.length > 0) await updateTrafficStats(entries)
    } catch {
      // Stats collection is best-effort — don't block sync if it fails
    }

    const uuids = await getActiveUuids()
    const { errors } = await forAllServers((s) => syncUsers(s, uuids))

    // Return fresh user list so UI updates immediately
    const users = await getAllUsers()

    return NextResponse.json({
      success: true,
      data: { synced: uuids.length, users, ...(errors.length > 0 ? { warnings: errors } : {}) },
    })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Не удалось синхронизировать с серверами' },
      { status: 502 },
    )
  }
}
