import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { ToastProvider } from '@/components/toast-provider'
import './globals.css'

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-mono',
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
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  manifest: '/site.webmanifest',
}

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'VeilX',
    url: siteUrl,
    description: siteDescription,
    inLanguage: 'ru',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'VeilX',
    url: siteUrl,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'iOS, Android, Windows, macOS',
    description: siteDescription,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'RUB',
      availability: 'https://schema.org/LimitedAvailability',
    },
  },
]

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" className={`${inter.variable} ${jetbrainsMono.variable} dark`}>
      <body className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] font-[family-name:var(--font-inter)]">
        <ToastProvider>
          {children}
        </ToastProvider>
        {/* Static JSON-LD structured data — no user input, safe to inline */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  )
}
