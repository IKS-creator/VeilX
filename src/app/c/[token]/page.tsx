import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getUserByToken } from '@/lib/db'
import { buildVlessLink } from '@/lib/vless-link-builder'
import { Card } from '@/components/card'
import { ConfigPanel } from '@/components/config-panel'
import { NavBack } from '@/components/nav-back'
import { SiteFooter } from '@/components/site-footer'
import Link from 'next/link'

type Props = {
  params: Promise<{ token: string }>
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Твой конфиг',
    description: 'Персональная страница подключения к VeilX VPN.',
  }
}

export default async function ConfigPage({ params }: Props) {
  const { token } = await params

  // Validate token format before DB query
  if (!/^[a-z0-9]{16}$/.test(token)) {
    notFound()
  }

  const user = await getUserByToken(token)
  if (!user) notFound()

  if (user.status === 'disabled') {
    return (
      <main className="mx-auto max-w-[640px] px-[var(--space-md)] py-[var(--space-2xl)] md:px-[var(--space-lg)]">
        <NavBack />
        <Card muted center>
          <p className="font-[family-name:var(--font-mono)] text-[0.875rem] text-[var(--color-text-muted)]">
            Твой доступ приостановлен.
          </p>
          <p className="mt-[var(--space-sm)] text-[0.8125rem] text-[var(--color-text-muted)]/70">
            Напиши админу в Telegram:{' '}
            <a
              href="https://t.me/just_iks"
              className="text-[var(--color-accent)]/70 hover:text-[var(--color-accent)] transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              @just_iks
            </a>
          </p>
        </Card>
        <SiteFooter />
      </main>
    )
  }

  let vlessLink: string
  try {
    vlessLink = buildVlessLink(user.vless_uuid, user.name)
  } catch {
    return (
      <main className="mx-auto max-w-[640px] px-[var(--space-md)] py-[var(--space-2xl)] md:px-[var(--space-lg)]">
        <NavBack />
        <Card muted center>
          <p className="font-[family-name:var(--font-mono)] text-[0.875rem] text-[var(--color-text-muted)]">
            Сервис временно недоступен. Попробуй через пару минут.
          </p>
        </Card>
        <SiteFooter />
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-[640px] px-[var(--space-md)] py-[var(--space-2xl)] md:px-[var(--space-lg)]">
      <NavBack />

      <h1 className="font-[family-name:var(--font-mono)] text-[1.5rem] font-bold tracking-wider">
        <span className="text-[var(--color-text-muted)]">&gt;</span>{' '}
        <span className="text-[var(--color-accent)] neon-text">{user.name}</span>
      </h1>
      <p className="mt-[var(--space-xs)] text-[0.875rem] text-[var(--color-text-muted)]">
        Это твоя персональная страница. Скопируй ссылку или отсканируй QR-код.
      </p>

      <Card className="mt-[var(--space-xl)]" glow>
        <ConfigPanel vlessLink={vlessLink} />
      </Card>

      {/* Prominent setup link */}
      <Card muted className="mt-[var(--space-lg)]">
        <p className="font-[family-name:var(--font-mono)] text-[0.8125rem] text-[var(--color-text-muted)]">
          Первый раз? Посмотри пошаговую инструкцию:
        </p>
        <Link
          href="/setup"
          className="mt-[var(--space-sm)] inline-flex items-center gap-[var(--space-sm)] rounded-[var(--radius-sm)] border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/5 px-[var(--space-md)] py-[var(--space-sm)] min-h-[44px] font-[family-name:var(--font-mono)] text-[0.8125rem] font-medium tracking-wide text-[var(--color-accent)] transition-all duration-200 hover:bg-[var(--color-accent)]/15 hover:border-[var(--color-accent)]/60"
        >
          📖 Как подключиться за 2 минуты
        </Link>
      </Card>

      <SiteFooter />
    </main>
  )
}
