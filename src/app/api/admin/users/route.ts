import { NextRequest, NextResponse } from 'next/server'
import crypto from 'node:crypto'
import { requireAdmin } from '@/lib/auth'
import { getAllUsers, getUserCount, createUser } from '@/lib/db'
import { addUser, forAllServers } from '@/lib/vps-api-client'

export async function GET() {
  try {
    const denied = await requireAdmin()
    if (denied) return denied

    const users = await getAllUsers()
    return NextResponse.json({ success: true, data: users })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const denied = await requireAdmin()
    if (denied) return denied

    const body = await request.json()
    const name = typeof body.name === 'string' ? body.name.trim() : ''

    if (!name || name.length > 50) {
      return NextResponse.json(
        { success: false, error: 'Имя обязательно (макс. 50 символов)' },
        { status: 400 },
      )
    }

    const count = await getUserCount()
    if (count >= 20) {
      return NextResponse.json(
        { success: false, error: 'Лимит 20 пользователей' },
        { status: 400 },
      )
    }

    const token = BigInt('0x' + crypto.randomBytes(12).toString('hex'))
      .toString(36)
      .padStart(16, '0')
      .slice(0, 16)
    const uuid = crypto.randomUUID()

    const user = await createUser(name, token, uuid)
    console.log(`[audit] Created invite: ${name} (token=${token})`)

    const { errors } = await forAllServers((s) => addUser(s, uuid))
    const warning = errors.length > 0
      ? `Некоторые серверы недоступны: ${errors.join('; ')}`
      : undefined

    const data: Record<string, unknown> = {
      user,
      inviteUrl: `https://veilx.app/c/${token}`,
    }
    if (warning) data.warning = warning

    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to create user' },
      { status: 500 },
    )
  }
}
