import Link from 'next/link'
import { Card } from '@/components/card'
import { IconBolt, IconShield, IconSimple } from '@/components/neon-icons'
import { SiteFooter } from '@/components/site-footer'

const steps = [
  {
    num: '01',
    title: 'Получи ссылку',
    text: 'Админ создаёт персональный инвайт и отправляет тебе ссылку.',
  },
  {
    num: '02',
    title: 'Установи клиент',
    text: 'Скачай приложение для своей платформы — iOS, Android, Windows или macOS.',
  },
  {
    num: '03',
    title: 'Подключайся',
    text: 'Отсканируй QR-код или скопируй конфиг — и ты в сети.',
  },
]

const features = [
  {
    icon: <IconBolt />,
    title: 'Быстро',
    text: 'Протокол VLESS + Reality — минимальные задержки, максимальная скорость.',
  },
  {
    icon: <IconShield />,
    title: 'Безопасно',
    text: 'Трафик неотличим от обычного HTTPS. Никаких логов, никаких утечек.',
  },
  {
    icon: <IconSimple />,
    title: 'Просто',
    text: 'Персональная страница с QR-кодом. Настройка за 2 минуты.',
  },
]

export default function HomePage() {
  return (
    <main className="mx-auto max-w-[1024px] px-[var(--space-md)] md:px-[var(--space-lg)]">
      {/* Hero */}
      <section className="flex flex-col items-center pt-[var(--space-3xl)] pb-[var(--space-3xl)] text-center">
        <h1 className="font-[family-name:var(--font-mono)] text-[2.5rem] font-bold tracking-wider uppercase leading-tight">
          <span className="text-[var(--color-accent)] neon-text">VeilX</span>
        </h1>
        <p className="mt-[var(--space-xs)] font-[family-name:var(--font-mono)] text-[0.875rem] tracking-[0.2em] uppercase text-[var(--color-text-muted)]">
          приватный vpn для своих
        </p>
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
        <h2 className="mb-[var(--space-lg)] text-center font-[family-name:var(--font-mono)] text-[0.875rem] font-medium uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
          Как это работает
        </h2>
        <div className="grid gap-[var(--space-md)] md:grid-cols-3">
          {steps.map((s) => (
            <Card key={s.num}>
              <div className="font-[family-name:var(--font-mono)] text-[0.6875rem] text-[var(--color-accent)] tracking-wider mb-[var(--space-sm)]">
                [{s.num}]
              </div>
              <h3 className="font-[family-name:var(--font-mono)] text-[1rem] font-semibold tracking-wide mb-[var(--space-sm)]">
                {s.title}
              </h3>
              <p className="text-[0.875rem] leading-relaxed text-[var(--color-text-muted)]">{s.text}</p>
            </Card>
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
            <Card key={i}>
              <div className="mb-[var(--space-md)]">{f.icon}</div>
              <h3 className="font-[family-name:var(--font-mono)] text-[1rem] font-semibold tracking-wide mb-[var(--space-sm)]">
                {f.title}
              </h3>
              <p className="text-[0.875rem] leading-relaxed text-[var(--color-text-muted)]">{f.text}</p>
            </Card>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
