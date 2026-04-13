import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '404 — Страница не найдена',
}

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-[var(--space-md)]">
      <h1 className="text-[2rem] font-bold">404</h1>
      <p className="mt-[var(--space-sm)] text-[1.125rem] text-[var(--color-text-muted)]">
        Страница не найдена
      </p>
      <Link
        href="/"
        className="mt-[var(--space-lg)] text-[var(--color-accent)] transition-colors hover:text-[var(--color-accent-hover)]"
      >
        На главную
      </Link>
    </main>
  )
}
