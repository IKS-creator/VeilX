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
      <h1 className="text-[2rem] font-bold">Настройка VPN</h1>
      <p className="mt-[var(--space-sm)] text-[1.125rem] text-[var(--color-text-muted)]">
        Выбери свою платформу и следуй инструкции.
      </p>
      <p className="mt-[var(--space-xs)] text-[0.75rem] text-[var(--color-text-muted)]">
        Обновлено: 13 апреля 2026
      </p>

      <div className="mt-[var(--space-xl)]">
        <SetupTabs />
      </div>

      <Card muted className="mt-[var(--space-xl)]">
        <h3 className="text-[1.25rem] font-semibold">Не работает?</h3>
        <ul className="mt-[var(--space-sm)] list-inside list-disc space-y-1 text-[var(--color-text-muted)]">
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
