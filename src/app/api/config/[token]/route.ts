import { NextRequest, NextResponse } from 'next/server'
import { getUserByToken } from '@/lib/db'
import { buildVlessLink } from '@/lib/vless-link-builder'
import { getServers, getServerInfos } from '@/lib/servers'

const TOKEN_REGEX = /^[a-z0-9]{16}$/

type RouteContext = { params: Promise<{ token: string }> }

export async function GET(_request: NextRequest, context: RouteContext) {
  const { token } = await context.params

  if (!TOKEN_REGEX.test(token)) {
    return NextResponse.json(
      { success: false, error: 'Not found' },
      { status: 404 },
    )
  }

  try {
    const user = await getUserByToken(token)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Not found' },
        { status: 404 },
      )
    }

    if (user.status === 'disabled') {
      return NextResponse.json({
        success: true,
        data: { status: 'disabled', name: user.name },
      })
    }

    const servers = getServers()
    const links = servers.map((s) => ({
      serverId: s.id,
      vlessLink: buildVlessLink(user.vless_uuid, user.name, s),
    }))

    return NextResponse.json({
      success: true,
      data: {
        status: 'active',
        name: user.name,
        links,
        servers: getServerInfos(),
      },
    })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    )
  }
}
