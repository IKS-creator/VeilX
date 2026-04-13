import Link from 'next/link'
import { Card } from '@/components/card'
import { IconBolt, IconShield, IconSimple, IconLink, IconDownload, IconZap } from '@/components/neon-icons'
import { SiteFooter } from '@/components/site-footer'

const steps = [
  {
    num: '01',
    icon: <IconLink />,
    title: 'Получи ссылку',
    text: 'Напиши админу в Telegram — он создаст персональный инвайт и отправит тебе ссылку.',
    href: '/articles/how-to-join',
  },
  {
    num: '02',
    icon: <IconDownload />,
    title: 'Установи клиент',
    text: 'Скачай приложение для своей платформы — iOS, Android, Windows или macOS.',
    href: '/setup',
  },
  {
    num: '03',
    icon: <IconZap />,
    title: 'Подключайся',
    text: 'Отсканируй QR-код или вставь конфиг из буфера — и ты под защитой.',
    href: '/setup',
  },
]

const features = [
  {
    icon: <IconBolt />,
    title: 'Быстро',
    text: 'Протокол VLESS + Reality — минимальные задержки, максимальная скорость.',
    href: '/articles/vless-reality',
  },
  {
    icon: <IconShield />,
    title: 'Безопасно',
    text: 'Трафик неотличим от обычного HTTPS. Никаких логов, никаких утечек.',
    href: '/articles/security',
  },
  {
    icon: <IconSimple />,
    title: 'Просто',
    text: 'Персональная страница с QR-кодом. Настройка за 2 минуты.',
    href: '/setup',
  },
]

export default function HomePage() {
  return (
    <main className="mx-auto max-w-[1024px] px-[var(--space-md)] md:px-[var(--space-lg)]">
      {/* Hero */}
      <section className="flex flex-col items-center pt-[var(--space-2xl)] pb-[var(--space-2xl)] md:pt-[var(--space-3xl)] md:pb-[var(--space-3xl)] text-center">
        <h1 className="font-[family-name:var(--font-mono)] text-[2.5rem] font-bold tracking-wider uppercase leading-tight">
          <span className="text-[var(--color-accent)] neon-text glitch-text" data-text="VeilX">VeilX</span>
        </h1>
        <p className="mt-[var(--space-xs)] font-[family-name:var(--font-mono)] text-[0.875rem] tracking-[0.2em] uppercase text-[var(--color-text-muted)]">
          приватный vpn для своих
        </p>
        {/* Server status indicator */}
        <div className="mt-[var(--space-md)] inline-flex items-center gap-[var(--space-sm)] font-[family-name:var(--font-mono)] text-[0.6875rem] tracking-wider text-[var(--color-text-muted)]/60">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-success)] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-success)]" />
          </span>
          Stockholm / online
        </div>
        <p className="mt-[var(--space-lg)] max-w-[500px] text-[1rem] leading-relaxed text-[var(--color-text-muted)]">
          Быстрый и надёжный VPN на базе VLESS + Reality. Только для приглашённых.
        </p>
        <Link
          href="/setup"
          className="mt-[var(--space-xl)] inline-flex items-center justify-center rounded-[var(--radius-sm)] border border-[var(--color-accent)]/50 bg-[var(--color-accent)]/10 px-[var(--space-lg)] py-[var(--space-sm)] min-h-[44px] font-[family-name:var(--font-mono)] text-[0.8125rem] font-medium uppercase tracking-wider text-[var(--color-accent)] transition-all duration-200 hover:bg-[var(--color-accent)]/20 hover:border-[var(--color-accent)] hover:shadow-[var(--glow-cyan)] max-md:w-full"
        >
          Как подключиться
        </Link>
      </section>

      {/* How it works */}
      <section className="pb-[var(--space-3xl)]">
        <h2 className="mb-[var(--space-sm)] text-center font-[family-name:var(--font-mono)] text-[0.875rem] font-medium uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
          Как это работает
        </h2>

        {/* Admin contact banner */}
        <p className="mb-[var(--space-lg)] text-center text-[0.8125rem] text-[var(--color-text-muted)]">
          Чтобы получить доступ — сначала напиши{' '}
          <a
            href="https://t.me/iks_creator"
            target="_blank"
            rel="noopener noreferrer"
            className="font-[family-name:var(--font-mono)] text-[var(--color-accent)] transition-all duration-200 hover:text-[var(--color-accent-hover)] hover:drop-shadow-[0_0_8px_var(--color-accent)]"
          >
            @iks_creator
          </a>{' '}
          и попроси одобрить вступление.
        </p>

        <div className="grid gap-[var(--space-md)] md:grid-cols-3">
          {steps.map((s) => (
            <Link key={s.num} href={s.href} className="group block">
              <Card className="h-full transition-all duration-300 group-hover:border-[var(--color-accent)]/30 group-hover:shadow-[var(--glow-cyan-strong)] group-hover:scale-[1.02]">
                <div className="flex items-center gap-[var(--space-sm)] mb-[var(--space-sm)]">
                  <div className="group-hover:[&_.neon-icon-pulse]:animate-none group-hover:[&_svg]:drop-shadow-[0_0_12px_var(--color-accent)]">
                    {s.icon}
                  </div>
                  <span className="font-[family-name:var(--font-mono)] text-[0.6875rem] text-[var(--color-accent)] tracking-wider">
                    [{s.num}]
                  </span>
                </div>
                <h3 className="font-[family-name:var(--font-mono)] text-[1rem] font-semibold tracking-wide mb-[var(--space-sm)] group-hover:text-[var(--color-accent)] transition-colors">
                  {s.title}
                </h3>
                <p className="text-[0.875rem] leading-relaxed text-[var(--color-text-muted)]">{s.text}</p>
                <div className="mt-[var(--space-sm)] font-[family-name:var(--font-mono)] text-[0.6875rem] text-[var(--color-accent)]/40 md:text-[var(--color-accent)]/0 group-hover:text-[var(--color-accent)]/60 transition-all duration-200 tracking-wider">
                  подробнее &rarr;
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="pb-[var(--space-3xl)]">
        <h2 className="mb-[var(--space-lg)] text-center font-[family-name:var(--font-mono)] text-[0.875rem] font-medium uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
          Преимущества
        </h2>
        <div className="grid gap-[var(--space-md)] md:grid-cols-3">
          {features.map((f, i) => (
            <Link key={i} href={f.href} className="group block">
              <Card className="h-full transition-all duration-300 group-hover:border-[var(--color-accent)]/30 group-hover:shadow-[var(--glow-cyan-strong)] group-hover:scale-[1.02]">
                <div className="mb-[var(--space-md)] neon-icon-pulse group-hover:animate-none group-hover:drop-shadow-[0_0_12px_var(--color-accent)]">{f.icon}</div>
                <h3 className="font-[family-name:var(--font-mono)] text-[1rem] font-semibold tracking-wide mb-[var(--space-sm)] group-hover:text-[var(--color-accent)] transition-colors">
                  {f.title}
                </h3>
                <p className="text-[0.875rem] leading-relaxed text-[var(--color-text-muted)]">{f.text}</p>
                <div className="mt-[var(--space-sm)] font-[family-name:var(--font-mono)] text-[0.6875rem] text-[var(--color-accent)]/40 md:text-[var(--color-accent)]/0 group-hover:text-[var(--color-accent)]/60 transition-all duration-200 tracking-wider">
                  подробнее &rarr;
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
