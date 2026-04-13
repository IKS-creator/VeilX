'use client'

import { Card } from '@/components/card'
import { CopyButton } from '@/components/copy-button'
import { QrCodeDisplay } from '@/components/qr-code-display'

type ConfigPanelProps = {
  vlessLink: string
}

export function ConfigPanel({ vlessLink }: ConfigPanelProps) {

  return (
    <div className="flex flex-col gap-[var(--space-lg)]">
      {/* QR code — first, most visual and intuitive */}
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

      {/* Copy link — prominent button */}
      <div>
        <p className="mb-[var(--space-sm)] font-[family-name:var(--font-mono)] text-[0.75rem] uppercase tracking-[0.15em] text-[var(--color-text-muted)]">
          Или скопируй ссылку
        </p>
        <CopyButton text={vlessLink} label="Скопировать ссылку" full />
      </div>

      {/* Raw link — collapsible, for advanced users */}
      <details className="group">
        <summary className="cursor-pointer font-[family-name:var(--font-mono)] text-[0.6875rem] text-[var(--color-text-muted)]/50 hover:text-[var(--color-text-muted)] transition-colors tracking-wide uppercase select-none">
          Показать ссылку целиком
        </summary>
        <p className="mt-[var(--space-sm)] break-all font-[family-name:var(--font-mono)] text-[0.75rem] text-[var(--color-text-muted)]/70 bg-white/[0.02] rounded-[var(--radius-sm)] p-[var(--space-sm)] border border-[var(--color-border)]">
          {vlessLink}
        </p>
      </details>
    </div>
  )
}
