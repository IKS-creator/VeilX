import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({ success: true, data: null })
  response.cookies.set('veilx-admin', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  })
  return response
}
