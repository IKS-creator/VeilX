import type { Metadata } from 'next'
import { Card } from '@/components/card'
import { SiteFooter } from '@/components/site-footer'
import { SetupTabs } from './setup-tabs'

export const metadata: Metadata = {
  title: 'Настройка VPN',
  description: 'Инструкция по подключению к VeilX. Выбери платформу — iOS, Android, Windows или macOS.',
  alternates: { canonical: '/setup' },
}

export default function SetupPage() {
  return (
    <main className="mx-auto max-w-[640px] px-[var(--space-md)] py-[var(--space-2xl)] md:px-[var(--space-lg)]">
      <h1 className="font-[family-name:var(--font-mono)] text-[1.5rem] font-bold tracking-wider uppercase text-[var(--color-accent)] neon-text">
        <span className="text-[var(--color-text-muted)]">&gt;</span> Настройка VPN
      </h1>
      <p className="mt-[var(--space-sm)] text-[0.9375rem] text-[var(--color-text-muted)]">
        Выбери свою платформу и следуй инструкции.
      </p>
      <p className="mt-[var(--space-xs)] font-[family-name:var(--font-mono)] text-[0.6875rem] text-[var(--color-text-muted)]/50 tracking-wide">
        upd: 13.04.2026
      </p>

      <div className="mt-[var(--space-xl)]">
        <SetupTabs />
      </div>

      <Card muted className="mt-[var(--space-xl)]">
        <h3 className="font-[family-name:var(--font-mono)] text-[0.875rem] font-semibold uppercase tracking-wider text-[var(--color-warning)]">
          Не работает?
        </h3>
        <ul className="mt-[var(--space-sm)] list-inside list-disc space-y-1 text-[0.875rem] text-[var(--color-text-muted)]">
          <li>Убедись, что используешь актуальную версию клиента</li>
          <li>Проверь, что конфиг скопирован полностью</li>
          <li>Попробуй переключиться на мобильный интернет</li>
          <li>Свяжись с админом, если ничего не помогло</li>
        </ul>
      </Card>

      <SiteFooter />
    </main>
  )
}
