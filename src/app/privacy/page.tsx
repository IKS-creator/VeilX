import type { Metadata } from 'next'
import { ArticleLayout } from '@/components/article-layout'
import { Card } from '@/components/card'

export const metadata: Metadata = {
  title: 'Конфиденциальность — VeilX',
  description: 'Политика конфиденциальности VeilX VPN. No-logs, без отслеживания, без компромиссов.',
  alternates: { canonical: '/privacy' },
}

export default function PrivacyPage() {
  return (
    <ArticleLayout
      title="Privacy First"
      subtitle="Мы не знаем, что ты делаешь в сети. И так должно быть."
      updatedAt="13.04.2026"
    >
      <Card glow>
        <h2 className="font-[family-name:var(--font-mono)] text-[0.875rem] font-semibold uppercase tracking-wider text-[var(--color-accent)] mb-[var(--space-sm)]">
          Zero-logs политика
        </h2>
        <p className="text-[0.9375rem] leading-relaxed text-[var(--color-text-muted)]">
          VeilX придерживается строгой политики{' '}
          <code className="text-[var(--color-accent)] text-[0.8125rem]">no-logs</code>.
          Сервер не записывает и не хранит информацию о посещённых ресурсах,
          DNS-запросах или содержимом трафика. Точка.
        </p>
      </Card>

      <Card>
        <h2 className="font-[family-name:var(--font-mono)] text-[0.875rem] font-semibold uppercase tracking-wider text-[var(--color-accent)] mb-[var(--space-sm)]">
          Что мы НЕ собираем
        </h2>
        <div className="space-y-3 text-[0.9375rem] text-[var(--color-text-muted)]">
          <div className="flex gap-[var(--space-sm)]">
            <span className="shrink-0 text-[var(--color-success)]">~</span>
            <span>Логи посещённых сайтов и DNS-запросов</span>
          </div>
          <div className="flex gap-[var(--space-sm)]">
            <span className="shrink-0 text-[var(--color-success)]">~</span>
            <span>Содержимое трафика</span>
          </div>
          <div className="flex gap-[var(--space-sm)]">
            <span className="shrink-0 text-[var(--color-success)]">~</span>
            <span>IP-адреса пользователей</span>
          </div>
          <div className="flex gap-[var(--space-sm)]">
            <span className="shrink-0 text-[var(--color-success)]">~</span>
            <span>Историю подключений и временные метки сессий</span>
          </div>
          <div className="flex gap-[var(--space-sm)]">
            <span className="shrink-0 text-[var(--color-success)]">~</span>
            <span>Cookies и данные браузера</span>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="font-[family-name:var(--font-mono)] text-[0.875rem] font-semibold uppercase tracking-wider text-[var(--color-accent)] mb-[var(--space-sm)]">
          Минимум данных
        </h2>
        <p className="text-[0.9375rem] leading-relaxed text-[var(--color-text-muted)] mb-3">
          Мы храним только то, без чего сервис не может работать:
        </p>
        <div className="space-y-3 text-[0.9375rem] text-[var(--color-text-muted)]">
          <div className="flex gap-[var(--space-sm)]">
            <span className="shrink-0 text-[var(--color-text-muted)]/40">&gt;</span>
            <span>Имя пользователя — для идентификации в панели</span>
          </div>
          <div className="flex gap-[var(--space-sm)]">
            <span className="shrink-0 text-[var(--color-text-muted)]/40">&gt;</span>
            <span>Токен доступа и UUID — для подключения к серверу</span>
          </div>
          <div className="flex gap-[var(--space-sm)]">
            <span className="shrink-0 text-[var(--color-text-muted)]/40">&gt;</span>
            <span>Агрегированный объём трафика — обнуляется ежедневно</span>
          </div>
          <div className="flex gap-[var(--space-sm)]">
            <span className="shrink-0 text-[var(--color-text-muted)]/40">&gt;</span>
            <span>Дата последнего подключения</span>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="font-[family-name:var(--font-mono)] text-[0.875rem] font-semibold uppercase tracking-wider text-[var(--color-accent)] mb-[var(--space-sm)]">
          Шифрование и Reality
        </h2>
        <p className="text-[0.9375rem] leading-relaxed text-[var(--color-text-muted)]">
          Все подключения защищены{' '}
          <strong className="text-[var(--color-text)]">TLS 1.3</strong> — тот же стандарт,
          что используют банки. Протокол{' '}
          <code className="text-[var(--color-accent)] text-[0.8125rem]">VLESS + Reality</code>{' '}
          с flow <code className="text-[var(--color-accent)] text-[0.8125rem]">xtls-rprx-vision</code>{' '}
          делает трафик неотличимым от обычного HTTPS.
          Провайдер, DPI-система или фаервол видят стандартное TLS-соединение
          с легитимным сайтом. Определить, что используется VPN — невозможно.
        </p>
      </Card>

      <Card>
        <h2 className="font-[family-name:var(--font-mono)] text-[0.875rem] font-semibold uppercase tracking-wider text-[var(--color-accent)] mb-[var(--space-sm)]">
          Третьи стороны
        </h2>
        <div className="space-y-3 text-[0.9375rem] text-[var(--color-text-muted)]">
          <div className="flex gap-[var(--space-sm)]">
            <span className="shrink-0 text-[var(--color-success)]">+</span>
            <span><strong className="text-[var(--color-text)]">Не передаём данные</strong> — никому, никогда, ни при каких обстоятельствах</span>
          </div>
          <div className="flex gap-[var(--space-sm)]">
            <span className="shrink-0 text-[var(--color-success)]">+</span>
            <span><strong className="text-[var(--color-text)]">Не монетизируемся</strong> — нет рекламы, нет аналитики, нет продажи данных</span>
          </div>
          <div className="flex gap-[var(--space-sm)]">
            <span className="shrink-0 text-[var(--color-success)]">+</span>
            <span><strong className="text-[var(--color-text)]">Invite-only</strong> — только люди, которых знает админ лично</span>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="font-[family-name:var(--font-mono)] text-[0.875rem] font-semibold uppercase tracking-wider text-[var(--color-accent)] mb-[var(--space-sm)]">
          Оператор
        </h2>
        <p className="text-[0.9375rem] leading-relaxed text-[var(--color-text-muted)]">
          VeilX — частный сервис, работающий на приватном сервере в Стокгольме (Швеция, ЕС).
          Администратор —{' '}
          <a
            href="https://t.me/iks_creator"
            target="_blank"
            rel="noopener noreferrer"
            className="font-[family-name:var(--font-mono)] text-[var(--color-accent)] transition-all duration-200 hover:text-[var(--color-accent-hover)] hover:drop-shadow-[0_0_8px_var(--color-accent)]"
          >
            @iks_creator
          </a>
          . Вопросы, доступ, проблемы — пиши в Telegram.
        </p>
      </Card>

      <Card muted>
        <p className="font-[family-name:var(--font-mono)] text-[0.8125rem] text-[var(--color-text-muted)]">
          <span className="text-[var(--color-accent)]">tl;dr</span> — мы не знаем, что ты делаешь
          в сети. Не храним логи. Не передаём данные. Шифруем всё. Работаем только для своих.
        </p>
      </Card>
    </ArticleLayout>
  )
}
