import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Админ-панель',
  description: 'Панель управления VeilX VPN.',
  alternates: { canonical: '/admin' },
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
