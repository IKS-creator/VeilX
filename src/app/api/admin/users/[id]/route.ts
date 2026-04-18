import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { getUserById, updateUserStatus, deleteUser } from '@/lib/db'
import { addUser, removeUser, forAllServers } from '@/lib/vps-api-client'

type RouteContext = { params: Promise<{ id: string }> }

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const denied = await requireAdmin()
    if (denied) return denied

    const { id } = await context.params
    const userId = parseInt(id, 10)
    if (isNaN(userId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid user ID' },
        { status: 400 },
      )
    }

    const body = await request.json()
    const status = body.status
    if (status !== 'active' && status !== 'disabled') {
      return NextResponse.json(
        { success: false, error: 'Status must be active or disabled' },
        { status: 400 },
      )
    }

    const existing = await getUserById(userId)
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 },
      )
    }

    const updated = await updateUserStatus(userId, status)
    console.log(`[audit] User ${existing.name}: status → ${status}`)

    const { errors } = await forAllServers((s) =>
      status === 'disabled'
        ? removeUser(s, existing.vless_uuid)
        : addUser(s, existing.vless_uuid),
    )
    const warning = errors.length > 0
      ? `Некоторые серверы недоступны: ${errors.join('; ')}`
      : undefined

    const data: Record<string, unknown> = { ...updated }
    if (warning) data.warning = warning

    return NextResponse.json({ success: true, data })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to update user' },
      { status: 500 },
    )
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const denied = await requireAdmin()
    if (denied) return denied

    const { id } = await context.params
    const userId = parseInt(id, 10)
    if (isNaN(userId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid user ID' },
        { status: 400 },
      )
    }

    const existing = await getUserById(userId)
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 },
      )
    }

    await forAllServers((s) => removeUser(s, existing.vless_uuid))

    await deleteUser(userId)
    console.log(`[audit] Deleted user: ${existing.name}`)

    return NextResponse.json({ success: true, data: null })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to delete user' },
      { status: 500 },
    )
  }
}
