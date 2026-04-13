import type { Metadata } from 'next'
import { ArticleLayout } from '@/components/article-layout'
import { Card } from '@/components/card'

export const metadata: Metadata = {
  title: 'Почему VLESS + Reality',
  description: 'Почему VLESS + Reality — самый быстрый и незаметный VPN-протокол в 2026 году.',
  alternates: { canonical: '/articles/vless-reality' },
}

export default function VlessRealityPage() {
  return (
    <ArticleLayout
      title="VLESS + Reality"
      subtitle="Почему это самый быстрый и незаметный VPN-протокол в 2026 году."
      updatedAt="13.04.2026"
    >
      <Card>
        <h2 className="font-[family-name:var(--font-mono)] text-[0.875rem] font-semibold uppercase tracking-wider text-[var(--color-accent)] mb-[var(--space-sm)]">
          Что такое VLESS
        </h2>
        <p className="text-[0.9375rem] leading-relaxed text-[var(--color-text-muted)]">
          VLESS — лёгкий протокол передачи данных. В отличие от VMess, он не шифрует трафик повторно —
          эту задачу берёт на себя TLS. Результат: меньше нагрузки на процессор, выше скорость, ниже задержки.
        </p>
      </Card>

      <Card>
        <h2 className="font-[family-name:var(--font-mono)] text-[0.875rem] font-semibold uppercase tracking-wider text-[var(--color-accent)] mb-[var(--space-sm)]">
          Что такое Reality
        </h2>
        <p className="text-[0.9375rem] leading-relaxed text-[var(--color-text-muted)]">
          Reality — это технология маскировки от Xray-core. Она позволяет VPN-серверу выглядеть
          как обычный веб-сайт (например, google.com или yahoo.com). Провайдер видит стандартное
          TLS-соединение — отличить его от обычного HTTPS невозможно.
        </p>
      </Card>

      <Card>
        <h2 className="font-[family-name:var(--font-mono)] text-[0.875rem] font-semibold uppercase tracking-wider text-[var(--color-accent)] mb-[var(--space-sm)]">
          Преимущества перед аналогами
        </h2>
        <div className="space-y-3 text-[0.9375rem] text-[var(--color-text-muted)]">
          <div className="flex gap-[var(--space-sm)]">
            <span className="shrink-0 text-[var(--color-success)]">+</span>
            <span><strong className="text-[var(--color-text)]">Быстрее WireGuard</strong> — нет двойного шифрования, минимальный overhead. Идеален для стриминга и игр.</span>
          </div>
          <div className="flex gap-[var(--space-sm)]">
            <span className="shrink-0 text-[var(--color-success)]">+</span>
            <span><strong className="text-[var(--color-text)]">Незаметнее OpenVPN</strong> — трафик идентичен HTTPS. DPI-системы не могут его отфильтровать.</span>
          </div>
          <div className="flex gap-[var(--space-sm)]">
            <span className="shrink-0 text-[var(--color-success)]">+</span>
            <span><strong className="text-[var(--color-text)]">Стабильнее Shadowsocks</strong> — Reality не требует отдельного TLS-сертификата, работает с любым доменом-прикрытием.</span>
          </div>
          <div className="flex gap-[var(--space-sm)]">
            <span className="shrink-0 text-[var(--color-success)]">+</span>
            <span><strong className="text-[var(--color-text)]">Нет fingerprint</strong> — xtls-rprx-vision убирает характерные паттерны TLS-in-TLS, что делает обнаружение практически невозможным.</span>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="font-[family-name:var(--font-mono)] text-[0.875rem] font-semibold uppercase tracking-wider text-[var(--color-accent)] mb-[var(--space-sm)]">
          Как это работает в VeilX
        </h2>
        <ol className="space-y-3 text-[0.9375rem] text-[var(--color-text-muted)]">
          <li className="flex gap-[var(--space-sm)]">
            <span className="shrink-0 font-[family-name:var(--font-mono)] text-[0.75rem] text-[var(--color-accent)] mt-[2px]">01</span>
            <span>Твой клиент устанавливает TLS-соединение с сервером VeilX в Стокгольме.</span>
          </li>
          <li className="flex gap-[var(--space-sm)]">
            <span className="shrink-0 font-[family-name:var(--font-mono)] text-[0.75rem] text-[var(--color-accent)] mt-[2px]">02</span>
            <span>Провайдер видит обычный HTTPS-трафик к легитимному домену — ничего подозрительного.</span>
          </li>
          <li className="flex gap-[var(--space-sm)]">
            <span className="shrink-0 font-[family-name:var(--font-mono)] text-[0.75rem] text-[var(--color-accent)] mt-[2px]">03</span>
            <span>Внутри TLS-туннеля данные передаются по протоколу VLESS — быстро и без лишних слоёв шифрования.</span>
          </li>
          <li className="flex gap-[var(--space-sm)]">
            <span className="shrink-0 font-[family-name:var(--font-mono)] text-[0.75rem] text-[var(--color-accent)] mt-[2px]">04</span>
            <span>Сервер в Швеции обеспечивает доступ к контенту ЕС с минимальным пингом для RU/CIS.</span>
          </li>
        </ol>
      </Card>

      <Card muted>
        <p className="font-[family-name:var(--font-mono)] text-[0.8125rem] text-[var(--color-text-muted)]">
          <span className="text-[var(--color-accent)]">tl;dr</span> — VLESS + Reality = максимальная скорость + полная невидимость.
          Это лучшее, что есть в 2026 году для обхода блокировок.
        </p>
      </Card>
    </ArticleLayout>
  )
}
