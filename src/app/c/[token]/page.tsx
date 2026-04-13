import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getUserByToken } from '@/lib/db'
import { buildVlessLink } from '@/lib/vless-link-builder'
import { Card } from '@/components/card'
import { ConfigPanel } from '@/components/config-panel'
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
        <Card muted center>
          <p className="font-[family-name:var(--font-mono)] text-[0.875rem] text-[var(--color-text-muted)]">
            [blocked] Твой доступ приостановлен. Свяжись с админом.
          </p>
        </Card>
      </main>
    )
  }

  let vlessLink: string
  try {
    vlessLink = buildVlessLink(user.vless_uuid, user.name)
  } catch {
    return (
      <main className="mx-auto max-w-[640px] px-[var(--space-md)] py-[var(--space-2xl)] md:px-[var(--space-lg)]">
        <Card muted center>
          <p className="font-[family-name:var(--font-mono)] text-[0.875rem] text-[var(--color-text-muted)]">
            [error] Сервис временно недоступен. Попробуй позже.
          </p>
        </Card>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-[640px] px-[var(--space-md)] py-[var(--space-2xl)] md:px-[var(--space-lg)]">
      <h1 className="font-[family-name:var(--font-mono)] text-[1.5rem] font-bold tracking-wider">
        <span className="text-[var(--color-text-muted)]">&gt;</span>{' '}
        <span className="text-[var(--color-accent)] neon-text">{user.name}</span>
      </h1>

      <Card className="mt-[var(--space-xl)]" glow>
        <ConfigPanel vlessLink={vlessLink} />
      </Card>

      <p className="mt-[var(--space-lg)]">
        <Link
          href="/setup"
          className="font-[family-name:var(--font-mono)] text-[0.8125rem] text-[var(--color-accent)]/70 transition-colors hover:text-[var(--color-accent)]"
        >
          Как подключиться?
        </Link>
      </p>
    </main>
  )
}
