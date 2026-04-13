'use client'

import { useState } from 'react'
import { Button } from '@/components/button'
import { Card } from '@/components/card'
import { CopyButton } from '@/components/copy-button'
import { QrCodeDisplay } from '@/components/qr-code-display'

type ConfigPanelProps = {
  vlessLink: string
}

export function ConfigPanel({ vlessLink }: ConfigPanelProps) {
  const [shown, setShown] = useState(false)

  // Mask the link: show first 15 chars + dots
  const masked = vlessLink.slice(0, 15) + '\u2022'.repeat(20)

  return (
    <div className="flex flex-col gap-[var(--space-lg)]">
      {/* VLESS link */}
      <div>
        <p className="mb-[var(--space-sm)] font-[family-name:var(--font-mono)] text-[0.6875rem] uppercase tracking-[0.15em] text-[var(--color-text-muted)]">
          vless-ссылка
        </p>
        <p className="break-all font-[family-name:var(--font-mono)] text-[0.8125rem] text-[var(--color-text-muted)]">
          {shown ? vlessLink : masked}
        </p>
        <div className="mt-[var(--space-md)] flex gap-[var(--space-sm)]">
          <Button
            variant="secondary"
            onClick={() => setShown(!shown)}
          >
            {shown ? 'Скрыть' : 'Показать'}
          </Button>
          <CopyButton text={vlessLink} />
        </div>
      </div>

      {/* QR code */}
      <Card center muted>
        <QrCodeDisplay value={vlessLink} />
      </Card>
    </div>
  )
}
