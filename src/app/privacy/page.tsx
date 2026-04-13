import type { Metadata } from 'next'
import { Card } from '@/components/card'
import { SiteFooter } from '@/components/site-footer'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Политика конфиденциальности',
  description: 'Политика конфиденциальности VeilX VPN. No-logs, без отслеживания.',
  alternates: { canonical: '/privacy' },
}

const sections = [
  {
    title: 'О сервисе',
    content: (
      <p className="mt-[var(--space-sm)] text-[0.875rem] text-[var(--color-text-muted)]">
        VeilX — приватный VPN-сервис на базе протокола VLESS + Reality.
        Сервис работает исключительно по приглашениям и предназначен для
        ограниченного круга пользователей (семья и друзья).
      </p>
    ),
  },
  {
    title: 'Какие данные мы храним',
    content: (
      <ul className="mt-[var(--space-sm)] list-inside list-disc space-y-1 text-[0.875rem] text-[var(--color-text-muted)]">
        <li>Имя пользователя (для идентификации в панели управления)</li>
        <li>Персональный токен доступа (для генерации конфиг-ссылки)</li>
        <li>UUID для подключения к VPN-серверу</li>
        <li>Агрегированная статистика трафика (объём входящих/исходящих данных)</li>
        <li>Дата последнего подключения</li>
      </ul>
    ),
  },
  {
    title: 'Какие данные мы НЕ храним',
    content: (
      <>
        <ul className="mt-[var(--space-sm)] list-inside list-disc space-y-1 text-[0.875rem] text-[var(--color-text-muted)]">
          <li>Логи посещённых сайтов и DNS-запросов</li>
          <li>Содержимое трафика</li>
          <li>IP-адреса пользователей</li>
          <li>Историю подключений и временные метки сессий</li>
          <li>Cookies и данные браузера</li>
        </ul>
        <p className="mt-[var(--space-sm)] text-[0.875rem] text-[var(--color-text-muted)]">
          VeilX придерживается строгой политики <strong className="text-[var(--color-accent)]">no-logs</strong>.
          VPN-сервер не записывает и не хранит информацию о том, какие ресурсы
          вы посещаете через VPN.
        </p>
      </>
    ),
  },
  {
    title: 'Безопасность',
    content: (
      <p className="mt-[var(--space-sm)] text-[0.875rem] text-[var(--color-text-muted)]">
        Все подключения защищены протоколом VLESS + Reality (TLS 1.3).
        Трафик неотличим от обычного HTTPS-соединения. Доступ к
        панели управления защищён паролем и JWT-аутентификацией.
      </p>
    ),
  },
  {
    title: 'Передача данных третьим лицам',
    content: (
      <p className="mt-[var(--space-sm)] text-[0.875rem] text-[var(--color-text-muted)]">
        Мы не передаём, не продаём и не предоставляем данные пользователей
        третьим лицам. Сервис работает исключительно для приглашённых
        пользователей и не монетизируется.
      </p>
    ),
  },
  {
    title: 'Контакт',
    content: (
      <p className="mt-[var(--space-sm)] text-[0.875rem] text-[var(--color-text-muted)]">
        Вопросы, доступ, проблемы — <a href="https://t.me/just_iks" className="text-[var(--color-accent)]/70 hover:text-[var(--color-accent)] transition-colors">@just_iks</a> в Telegram.
      </p>
    ),
  },
]

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-[640px] px-[var(--space-md)] py-[var(--space-2xl)] md:px-[var(--space-lg)]">
      <h1 className="font-[family-name:var(--font-mono)] text-[1.5rem] font-bold tracking-wider uppercase text-[var(--color-accent)] neon-text">
        <span className="text-[var(--color-text-muted)]">&gt;</span> Конфиденциальность
      </h1>
      <p className="mt-[var(--space-sm)] font-[family-name:var(--font-mono)] text-[0.6875rem] text-[var(--color-text-muted)]/50 tracking-wide">
        upd: 13.04.2026
      </p>

      <div className="mt-[var(--space-xl)] space-y-[var(--space-md)]">
        {sections.map((s, i) => (
          <Card key={i}>
            <h2 className="font-[family-name:var(--font-mono)] text-[0.875rem] font-semibold uppercase tracking-wider">
              {s.title}
            </h2>
            {s.content}
          </Card>
        ))}
      </div>

      <p className="mt-[var(--space-xl)]">
        <Link
          href="/"
          className="font-[family-name:var(--font-mono)] text-[0.8125rem] text-[var(--color-accent)]/70 transition-colors hover:text-[var(--color-accent)]"
        >
          &lt;- На главную
        </Link>
      </p>

      <SiteFooter />
    </main>
  )
}
