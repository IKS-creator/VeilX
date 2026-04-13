import { NextRequest, NextResponse } from 'next/server'
import { verifyPassword, setAuthCookieResponse } from '@/lib/auth'
import { isRateLimited, recordFailedAttempt, clearAttempts } from '@/lib/rate-limiter'

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    request.headers.get('x-real-ip') ??
    '127.0.0.1'
  )
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request)

    const limited = await isRateLimited(ip)
    if (limited) {
      return NextResponse.json(
        { success: false, error: 'Слишком много попыток. Подожди 15 минут.' },
        { status: 429 },
      )
    }

    const body = await request.json()
    const password = typeof body.password === 'string' ? body.password : ''

    if (!verifyPassword(password)) {
      await recordFailedAttempt(ip)
      return NextResponse.json(
        { success: false, error: 'Неверный пароль' },
        { status: 401 },
      )
    }

    await clearAttempts(ip)
    return setAuthCookieResponse()
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    )
  }
}
