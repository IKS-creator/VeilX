'use client'

import Link from 'next/link'
import { Card } from '@/components/card'

export default function ConfigError() {
  return (
    <main className="mx-auto max-w-[640px] px-[var(--space-md)] py-[var(--space-2xl)] md:px-[var(--space-lg)]">
      <Card muted center>
        <p className="font-[family-name:var(--font-mono)] text-[0.875rem] text-[var(--color-text-muted)]">
          [error] Что-то пошло не так. Попробуй обновить страницу.
        </p>
        <p className="mt-[var(--space-sm)] text-[0.8125rem] text-[var(--color-text-muted)]/70">
          Если проблема повторяется — напиши{' '}
          <a
            href="https://t.me/iks_creator"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-accent)]/70 hover:text-[var(--color-accent)] transition-colors"
          >
            @iks_creator
          </a>
        </p>
        <Link
          href="/"
          className="mt-[var(--space-md)] inline-flex items-center min-h-[44px] font-[family-name:var(--font-mono)] text-[0.8125rem] text-[var(--color-accent)] transition-colors hover:text-[var(--color-accent-hover)]"
        >
          &larr; На главную
        </Link>
      </Card>
    </main>
  )
}
