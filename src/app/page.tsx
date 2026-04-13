import Link from 'next/link'
import { Card } from '@/components/card'
import { SiteFooter } from '@/components/site-footer'

const steps = [
  {
    title: 'Получи ссылку',
    text: 'Админ создаёт персональный инвайт и отправляет тебе ссылку.',
  },
  {
    title: 'Установи клиент',
    text: 'Скачай приложение для своей платформы — iOS, Android, Windows или macOS.',
  },
  {
    title: 'Подключайся',
    text: 'Отсканируй QR-код или скопируй конфиг — и ты в сети.',
  },
]

const features = [
  {
    title: 'Быстро',
    text: 'Протокол VLESS + Reality — минимальные задержки, максимальная скорость.',
  },
  {
    title: 'Безопасно',
    text: 'Трафик неотличим от обычного HTTPS. Никаких логов, никаких утечек.',
  },
  {
    title: 'Просто',
    text: 'Персональная страница с QR-кодом. Настройка за 2 минуты.',
  },
]

export default function HomePage() {
  return (
    <main className="mx-auto max-w-[1024px] px-[var(--space-md)] md:px-[var(--space-lg)]">
      {/* Hero */}
      <section className="flex flex-col items-center pt-[var(--space-3xl)] pb-[var(--space-3xl)] text-center">
        <h1 className="text-[2rem] font-bold leading-tight">
          VeilX — приватный VPN для своих
        </h1>
        <p className="mt-[var(--space-md)] max-w-[640px] text-[1.125rem] text-[var(--color-text-muted)]">
          Быстрый и надёжный VPN на базе VLESS + Reality. Только для приглашённых.
        </p>
        <Link
          href="/setup"
          className="mt-[var(--space-xl)] inline-flex items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-accent)] px-[var(--space-lg)] py-[var(--space-sm)] min-h-[44px] text-[0.875rem] font-medium text-white transition-colors duration-150 hover:bg-[var(--color-accent-hover)] max-md:w-full"
        >
          Как подключиться
        </Link>
      </section>

      {/* How it works */}
      <section className="pb-[var(--space-3xl)]">
        <h2 className="mb-[var(--space-lg)] text-center text-[1.5rem] font-bold">
          Как это работает
        </h2>
        <div className="grid gap-[var(--space-lg)] md:grid-cols-3">
          {steps.map((s, i) => (
            <Card key={i}>
              <h3 className="mb-[var(--space-sm)] text-[1.25rem] font-semibold">
                {s.title}
              </h3>
              <p className="text-[var(--color-text-muted)]">{s.text}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="pb-[var(--space-3xl)]">
        <h2 className="mb-[var(--space-lg)] text-center text-[1.5rem] font-bold">
          Преимущества
        </h2>
        <div className="grid gap-[var(--space-lg)] md:grid-cols-3">
          {features.map((f, i) => (
            <Card key={i}>
              <h3 className="mb-[var(--space-sm)] text-[1.25rem] font-semibold">
                {f.title}
              </h3>
              <p className="text-[var(--color-text-muted)]">{f.text}</p>
            </Card>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
