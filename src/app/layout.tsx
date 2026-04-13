import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ToastProvider } from '@/components/toast-provider'
import './globals.css'

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
})

const siteUrl = 'https://veilx.app'
const siteDescription = 'Приватный VLESS+Reality VPN для семьи и друзей. Простая настройка в FoXray.'

export const metadata: Metadata = {
  title: {
    default: 'VeilX — приватный VPN',
    template: '%s | VeilX',
  },
  description: siteDescription,
  robots: 'noindex,nofollow',
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: 'VeilX — приватный VPN',
    description: siteDescription,
    url: siteUrl,
    siteName: 'VeilX',
    type: 'website',
    locale: 'ru_RU',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VeilX — приватный VPN',
    description: siteDescription,
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" className={`${inter.variable} dark`}>
      <body className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] font-[family-name:var(--font-inter)]">
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  )
}
