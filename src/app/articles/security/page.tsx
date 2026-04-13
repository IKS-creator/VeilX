import type { Metadata } from 'next'
import { ArticleLayout } from '@/components/article-layout'
import { Card } from '@/components/card'

export const metadata: Metadata = {
  title: 'Безопасность VeilX',
  description: 'Как VeilX защищает твои данные: no-logs, Reality-маскировка, приватная инфраструктура.',
  alternates: { canonical: '/articles/security' },
}

export default function SecurityPage() {
  return (
    <ArticleLayout
      title="Безопасность"
      subtitle="Как VeilX защищает твои данные и почему ему можно доверять."
      updatedAt="13.04.2026"
    >
      <Card>
        <h2 className="font-[family-name:var(--font-mono)] text-[0.875rem] font-semibold uppercase tracking-wider text-[var(--color-accent)] mb-[var(--space-sm)]">
          Zero-logs политика
        </h2>
        <p className="text-[0.9375rem] leading-relaxed text-[var(--color-text-muted)]">
          VeilX не хранит логи подключений, DNS-запросов или трафика. Сервер знает только
          факт подключения (для статистики трафика) — но не знает, какие сайты ты посещаешь.
          Статистика трафика обнуляется ежедневно.
        </p>
      </Card>

      <Card>
        <h2 className="font-[family-name:var(--font-mono)] text-[0.875rem] font-semibold uppercase tracking-wider text-[var(--color-accent)] mb-[var(--space-sm)]">
          Reality-маскировка
        </h2>
        <p className="text-[0.9375rem] leading-relaxed text-[var(--color-text-muted)]">
          Технология Reality делает VPN-трафик неотличимым от обычного HTTPS. Провайдер,
          государственный фаервол или DPI-система видят стандартное TLS-соединение с легитимным
          сайтом. Определить, что используется VPN — невозможно.
        </p>
      </Card>

      <Card>
        <h2 className="font-[family-name:var(--font-mono)] text-[0.875rem] font-semibold uppercase tracking-wider text-[var(--color-accent)] mb-[var(--space-sm)]">
          Приватная инфраструктура
        </h2>
        <div className="space-y-3 text-[0.9375rem] text-[var(--color-text-muted)]">
          <div className="flex gap-[var(--space-sm)]">
            <span className="shrink-0 text-[var(--color-success)]">+</span>
            <span><strong className="text-[var(--color-text)]">Свой сервер</strong> — выделенный VPS в Стокгольме, не shared-хостинг. Никто кроме админа не имеет доступа.</span>
          </div>
          <div className="flex gap-[var(--space-sm)]">
            <span className="shrink-0 text-[var(--color-success)]">+</span>
            <span><strong className="text-[var(--color-text)]">Максимум 20 пользователей</strong> — маленькая группа = контроль и скорость. Никаких перегрузок.</span>
          </div>
          <div className="flex gap-[var(--space-sm)]">
            <span className="shrink-0 text-[var(--color-success)]">+</span>
            <span><strong className="text-[var(--color-text)]">Invite-only</strong> — только люди, которых знает админ лично. Нет публичной регистрации.</span>
          </div>
          <div className="flex gap-[var(--space-sm)]">
            <span className="shrink-0 text-[var(--color-success)]">+</span>
            <span><strong className="text-[var(--color-text)]">Швеция (ЕС)</strong> — строгие законы о защите данных. Сервер не в юрисдикции, которая может потребовать выдачу логов.</span>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="font-[family-name:var(--font-mono)] text-[0.875rem] font-semibold uppercase tracking-wider text-[var(--color-accent)] mb-[var(--space-sm)]">
          Шифрование
        </h2>
        <p className="text-[0.9375rem] leading-relaxed text-[var(--color-text-muted)]">
          Весь трафик защищён TLS 1.3 — тот же стандарт, что используют банки и Google.
          Протокол VLESS с flow <code className="text-[var(--color-accent)] text-[0.8125rem]">xtls-rprx-vision</code> убирает
          паттерны двойного TLS, что делает соединение ещё менее заметным для анализаторов.
        </p>
      </Card>

      <Card>
        <h2 className="font-[family-name:var(--font-mono)] text-[0.875rem] font-semibold uppercase tracking-wider text-[var(--color-accent)] mb-[var(--space-sm)]">
          От чего защищает VeilX
        </h2>
        <div className="space-y-3 text-[0.9375rem] text-[var(--color-text-muted)]">
          <div className="flex gap-[var(--space-sm)]">
            <span className="shrink-0 text-[var(--color-accent)]">~</span>
            <span>Блокировки сайтов и сервисов по IP/домену</span>
          </div>
          <div className="flex gap-[var(--space-sm)]">
            <span className="shrink-0 text-[var(--color-accent)]">~</span>
            <span>Слежка провайдера за DNS-запросами и трафиком</span>
          </div>
          <div className="flex gap-[var(--space-sm)]">
            <span className="shrink-0 text-[var(--color-accent)]">~</span>
            <span>DPI-фильтрация (глубокий анализ пакетов)</span>
          </div>
          <div className="flex gap-[var(--space-sm)]">
            <span className="shrink-0 text-[var(--color-accent)]">~</span>
            <span>Перехват данных в публичных Wi-Fi сетях</span>
          </div>
          <div className="flex gap-[var(--space-sm)]">
            <span className="shrink-0 text-[var(--color-accent)]">~</span>
            <span>Гео-ограничения на контент (Netflix, Spotify, YouTube Premium)</span>
          </div>
        </div>
      </Card>

      <Card muted>
        <p className="font-[family-name:var(--font-mono)] text-[0.8125rem] text-[var(--color-text-muted)]">
          <span className="text-[var(--color-accent)]">tl;dr</span> — VeilX не хранит логи, маскирует трафик под обычный HTTPS,
          работает на приватном сервере в Швеции и доступен только по приглашению.
        </p>
      </Card>
    </ArticleLayout>
  )
}
