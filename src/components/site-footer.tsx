import Link from 'next/link'

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--color-border)] py-[var(--space-2xl)] text-center text-[0.875rem] text-[var(--color-text-muted)]">
      <p>VeilX — приватный VPN-сервис</p>
      <p className="mt-[var(--space-xs)]">
        Оператор: Кирилл •{' '}
        <a
          href="https://t.me/just_iks1488"
          className="text-[var(--color-accent)] transition-colors hover:text-[var(--color-accent-hover)]"
          target="_blank"
          rel="noopener noreferrer"
        >
          Telegram: @just_iks1488
        </a>
        {' '}• Только для приглашённых
      </p>
      <p className="mt-[var(--space-xs)]">
        <Link
          href="/privacy"
          className="text-[var(--color-accent)] transition-colors hover:text-[var(--color-accent-hover)]"
        >
          Конфиденциальность
        </Link>
      </p>
    </footer>
  )
}
