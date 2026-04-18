import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { getActiveUuids } from '@/lib/db'
import { syncUsers, forAllServers } from '@/lib/vps-api-client'

export async function POST() {
  try {
    const denied = await requireAdmin()
    if (denied) return denied

    const uuids = await getActiveUuids()
    const { errors } = await forAllServers((s) => syncUsers(s, uuids))

    if (errors.length > 0) {
      return NextResponse.json({
        success: true,
        data: { synced: uuids.length, warnings: errors },
      })
    }

    return NextResponse.json({
      success: true,
      data: { synced: uuids.length },
    })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Не удалось синхронизировать с серверами' },
      { status: 502 },
    )
  }
}
