import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'VeilX — приватный VPN'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)',
          color: '#e5e5e5',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            fontSize: '72px',
            fontWeight: 700,
            letterSpacing: '-2px',
          }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '40px',
              fontWeight: 700,
              color: 'white',
            }}
          >
            V
          </div>
          VeilX
        </div>
        <div
          style={{
            marginTop: '24px',
            fontSize: '28px',
            color: '#a3a3a3',
            textAlign: 'center',
            maxWidth: '700px',
          }}
        >
          Приватный VLESS+Reality VPN для семьи и друзей
        </div>
        <div
          style={{
            marginTop: '40px',
            display: 'flex',
            gap: '32px',
            fontSize: '18px',
            color: '#737373',
          }}
        >
          <span>Быстро</span>
          <span>•</span>
          <span>Безопасно</span>
          <span>•</span>
          <span>Просто</span>
        </div>
      </div>
    ),
    { ...size },
  )
}
