import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import crypto from 'node:crypto'

const COOKIE_NAME = 'veilx-admin'
const TTL_SECONDS = 86400 // 24h

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET env var is not set')
  return new TextEncoder().encode(secret)
}

export async function signJwt(): Promise<string> {
  return new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${TTL_SECONDS}s`)
    .sign(getSecret())
}

export async function verifyJwt(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, getSecret())
    return true
  } catch {
    return false
  }
}

export async function setAuthCookieResponse(): Promise<NextResponse> {
  const token = await signJwt()
  const response = NextResponse.json({ success: true, data: null })
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: TTL_SECONDS,
    path: '/',
  })
  return response
}

export async function getAuthFromCookies(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return false
  return verifyJwt(token)
}

// Constant-time comparison: pad shorter input to match expected length
// so timingSafeEqual always runs (no early return leaking password length)
export function verifyPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD
  if (!expected) throw new Error('ADMIN_PASSWORD env var is not set')
  const inputBuf = Buffer.from(input.padEnd(expected.length, '\0'))
  const expectedBuf = Buffer.from(expected.padEnd(input.length, '\0'))
  return inputBuf.length === expectedBuf.length
    && crypto.timingSafeEqual(inputBuf, expectedBuf)
    && input.length === expected.length
}

export async function requireAdmin(): Promise<NextResponse | null> {
  const isAuth = await getAuthFromCookies()
  if (!isAuth) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 },
    )
  }
  return null
}
