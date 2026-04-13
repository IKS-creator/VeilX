import type { Metadata } from 'next'
import { Card } from '@/components/card'
import { SiteFooter } from '@/components/site-footer'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Политика конфиденциальности',
  description: 'Политика конфиденциальности VeilX VPN. No-logs, без отслеживания.',
  alternates: { canonical: '/privacy' },
}

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-[640px] px-[var(--space-md)] py-[var(--space-2xl)] md:px-[var(--space-lg)]">
      <h1 className="text-[2rem] font-bold">Политика конфиденциальности</h1>
      <p className="mt-[var(--space-sm)] text-[var(--color-text-muted)]">
        Последнее обновление: 13 апреля 2026
      </p>

      <div className="mt-[var(--space-xl)] space-y-[var(--space-xl)]">
        <Card>
          <h2 className="text-[1.25rem] font-semibold">О сервисе</h2>
          <p className="mt-[var(--space-sm)] text-[var(--color-text-muted)]">
            VeilX — приватный VPN-сервис на базе протокола VLESS + Reality.
            Сервис работает исключительно по приглашениям и предназначен для
            ограниченного круга пользователей (семья и друзья).
          </p>
        </Card>

        <Card>
          <h2 className="text-[1.25rem] font-semibold">Какие данные мы храним</h2>
          <ul className="mt-[var(--space-sm)] list-inside list-disc space-y-1 text-[var(--color-text-muted)]">
            <li>Имя пользователя (для идентификации в панели управления)</li>
            <li>Персональный токен доступа (для генерации конфиг-ссылки)</li>
            <li>UUID для подключения к VPN-серверу</li>
            <li>Агрегированная статистика трафика (объём входящих/исходящих данных)</li>
            <li>Дата последнего подключения</li>
          </ul>
        </Card>

        <Card>
          <h2 className="text-[1.25rem] font-semibold">Какие данные мы НЕ храним</h2>
          <ul className="mt-[var(--space-sm)] list-inside list-disc space-y-1 text-[var(--color-text-muted)]">
            <li>Логи посещённых сайтов и DNS-запросов</li>
            <li>Содержимое трафика</li>
            <li>IP-адреса пользователей</li>
            <li>Историю подключений и временные метки сессий</li>
            <li>Cookies и данные браузера</li>
          </ul>
          <p className="mt-[var(--space-sm)] text-[var(--color-text-muted)]">
            VeilX придерживается строгой политики <strong className="text-[var(--color-text)]">no-logs</strong>.
            VPN-сервер не записывает и не хранит информацию о том, какие ресурсы
            вы посещаете через VPN.
          </p>
        </Card>

        <Card>
          <h2 className="text-[1.25rem] font-semibold">Безопасность</h2>
          <p className="mt-[var(--space-sm)] text-[var(--color-text-muted)]">
            Все подключения защищены протоколом VLESS + Reality (TLS 1.3).
            Трафик неотличим от обычного HTTPS-соединения. Доступ к
            панели управления защищён паролем и JWT-аутентификацией.
          </p>
        </Card>

        <Card>
          <h2 className="text-[1.25rem] font-semibold">Передача данных третьим лицам</h2>
          <p className="mt-[var(--space-sm)] text-[var(--color-text-muted)]">
            Мы не передаём, не продаём и не предоставляем данные пользователей
            третьим лицам. Сервис работает исключительно для приглашённых
            пользователей и не монетизируется.
          </p>
        </Card>

        <Card>
          <h2 className="text-[1.25rem] font-semibold">Оператор сервиса</h2>
          <p className="mt-[var(--space-sm)] text-[var(--color-text-muted)]">
            Сервис обслуживается Кириллом в личном порядке.
            По любым вопросам: <a href="https://t.me/just_iks1488" className="text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors">@just_iks1488</a> в Telegram.
          </p>
        </Card>
      </div>

      <p className="mt-[var(--space-xl)]">
        <Link
          href="/"
          className="text-[var(--color-accent)] transition-colors hover:text-[var(--color-accent-hover)]"
        >
          ← На главную
        </Link>
      </p>

      <SiteFooter />
    </main>
  )
}
