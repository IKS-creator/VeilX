'use client'

import { QRCodeSVG } from 'qrcode.react'

type QrCodeDisplayProps = {
  value: string
}

export function QrCodeDisplay({ value }: QrCodeDisplayProps) {
  return (
    <figure className="inline-flex rounded-[var(--radius-sm)] bg-white p-[var(--space-sm)]">
      <QRCodeSVG
        value={value}
        size={280}
        level="M"
        bgColor="#ffffff"
        fgColor="#000000"
        title="QR-код для подключения к VeilX VPN"
      />
      <figcaption className="sr-only">QR-код для подключения к VeilX VPN</figcaption>
    </figure>
  )
}
