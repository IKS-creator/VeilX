'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/card'
import { CopyButton } from '@/components/copy-button'
import { QrCodeDisplay } from '@/components/qr-code-display'
import type { ServerInfo } from '@/lib/servers'

type ServerLink = {
  serverId: string
  vlessLink: string
}

type ConfigPanelProps = {
  links: ServerLink[]
  servers: ServerInfo[]
}

export function ConfigPanel({ links, servers }: ConfigPanelProps) {
  const [activeServer, setActiveServer] = useState(servers[0]?.id ?? '')
  const activeLink = links.find((l) => l.serverId === activeServer)
  const vlessLink = activeLink?.vlessLink ?? ''

  return (
    <div className="flex flex-col gap-[var(--space-lg)]">
      {/* Server selector — only show if multiple servers */}
      {servers.length > 1 && (
        <div>
          <p className="mb-[var(--space-sm)] font-[family-name:var(--font-mono)] text-[0.75rem] uppercase tracking-[0.15em] text-[var(--color-text-muted)]">
            Сервер
          </p>
          <div className="flex gap-[var(--space-xs)]">
            {servers.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveServer(s.id)}
                className={`flex-1 rounded-[var(--radius-sm)] border px-[var(--space-md)] py-[var(--space-sm)] min-h-[44px] font-[family-name:var(--font-mono)] text-[0.8125rem] font-medium tracking-wide transition-all duration-200 cursor-pointer ${
                  activeServer === s.id
                    ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)] neon-text'
                    : 'border-[var(--color-border)] bg-transparent text-[var(--color-text-muted)] hover:border-[var(--color-accent)]/40 hover:text-[var(--color-text-primary)]'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* QR code */}
      <div>
        <p className="mb-[var(--space-sm)] font-[family-name:var(--font-mono)] text-[0.75rem] uppercase tracking-[0.15em] text-[var(--color-text-muted)]">
          QR-код для приложения
        </p>
        <Card center muted>
          <QrCodeDisplay value={vlessLink} />
        </Card>
        <p className="mt-[var(--space-xs)] text-[0.75rem] text-[var(--color-text-muted)]/60 text-center">
          Отсканируй камерой или из VPN-приложения
        </p>
      </div>

      {/* Copy link */}
      <div>
        <p className="mb-[var(--space-sm)] font-[family-name:var(--font-mono)] text-[0.75rem] uppercase tracking-[0.15em] text-[var(--color-text-muted)]">
          Или скопируй ссылку
        </p>
        <CopyButton text={vlessLink} label="Скопировать ссылку" full />
        <p className="mt-[var(--space-xs)] text-[0.75rem] text-[var(--color-text-muted)]/60 text-center">
          Скопировал? Теперь вставь в приложение.{' '}
          <Link href="/setup" className="text-[var(--color-accent)]/60 hover:text-[var(--color-accent)] transition-colors">
            Инструкция &rarr;
          </Link>
        </p>
      </div>

      {/* Raw link — collapsible */}
      <details className="group">
        <summary className="cursor-pointer font-[family-name:var(--font-mono)] text-[0.6875rem] text-[var(--color-text-muted)]/50 hover:text-[var(--color-text-muted)] transition-colors tracking-wide uppercase select-none list-none [&::-webkit-details-marker]:hidden">
          <span className="inline-block transition-transform duration-150 group-open:rotate-90 mr-[var(--space-xs)]">&#9656;</span>
          Показать ссылку целиком
        </summary>
        <p className="mt-[var(--space-sm)] break-all font-[family-name:var(--font-mono)] text-[0.75rem] text-[var(--color-text-muted)]/70 bg-[var(--color-surface-dim)] rounded-[var(--radius-sm)] p-[var(--space-sm)] border border-[var(--color-border)]">
          {vlessLink}
        </p>
      </details>
    </div>
  )
}
