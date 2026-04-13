'use client'

import { Card } from '@/components/card'

export default function ConfigError() {
  return (
    <main className="mx-auto max-w-[640px] px-[var(--space-md)] py-[var(--space-2xl)] md:px-[var(--space-lg)]">
      <Card muted center>
        <p className="font-[family-name:var(--font-mono)] text-[0.875rem] text-[var(--color-text-muted)]">
          [error] Что-то пошло не так. Попробуй обновить страницу.
        </p>
      </Card>
    </main>
  )
}
