import Link from 'next/link'

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--color-border)] py-[var(--space-2xl)] text-center">
      <p className="font-[family-name:var(--font-mono)] text-[1.125rem] font-bold tracking-[0.3em] uppercase text-[var(--color-accent)] neon-text">
        VeilX
      </p>
      <p className="mt-[var(--space-sm)] font-[family-name:var(--font-mono)] text-[0.8125rem] tracking-wide text-[var(--color-text-muted)]">
        <a
          href="https://t.me/just_iks"
          className="text-[var(--color-accent)]/70 transition-colors hover:text-[var(--color-accent)]"
          target="_blank"
          rel="noopener noreferrer"
        >
          @just_iks
        </a>
        <span className="mx-2 text-[var(--color-border)]">/</span>
        <span className="uppercase tracking-[0.2em] text-[0.75rem]">invite-only</span>
      </p>
      <p className="mt-[var(--space-xs)] font-[family-name:var(--font-mono)] text-[0.625rem] lowercase tracking-[0.3em] text-[var(--color-text-muted)]/40">
        privacy first.
      </p>
      <nav className="mt-[var(--space-md)] flex flex-wrap items-center justify-center gap-x-[var(--space-md)] gap-y-[var(--space-xs)] font-[family-name:var(--font-mono)] text-[0.6875rem] uppercase tracking-wider">
        <Link
          href="/setup"
          className="text-[var(--color-text-muted)]/50 transition-colors hover:text-[var(--color-text-muted)] min-h-[44px] inline-flex items-center"
        >
          Инструкция
        </Link>
        <span className="text-[var(--color-border)]">·</span>
        <Link
          href="/articles/security"
          className="text-[var(--color-text-muted)]/50 transition-colors hover:text-[var(--color-text-muted)] min-h-[44px] inline-flex items-center"
        >
          Безопасность
        </Link>
        <span className="text-[var(--color-border)]">·</span>
        <Link
          href="/privacy"
          className="text-[var(--color-text-muted)]/50 transition-colors hover:text-[var(--color-text-muted)] min-h-[44px] inline-flex items-center"
        >
          Конфиденциальность
        </Link>
      </nav>
    </footer>
  )
}
