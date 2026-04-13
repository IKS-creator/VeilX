import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { getActiveUuids } from '@/lib/db'
import { syncUsers } from '@/lib/vps-api-client'

export async function POST() {
  try {
    const denied = await requireAdmin()
    if (denied) return denied

    const uuids = await getActiveUuids()
    await syncUsers(uuids)

    return NextResponse.json({
      success: true,
      data: { synced: uuids.length },
    })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Не удалось синхронизировать с сервером' },
      { status: 502 },
    )
  }
}
