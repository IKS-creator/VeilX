import Link from 'next/link'

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--color-border)] py-[var(--space-2xl)] text-center text-[0.8125rem] text-[var(--color-text-muted)]">
      <p className="font-mono text-[1rem] font-semibold tracking-widest text-[var(--color-text)]">
        VeilX
      </p>
      <p className="mt-[var(--space-sm)] font-mono tracking-wide">
        <a
          href="https://t.me/just_iks"
          className="text-[var(--color-accent)] transition-colors hover:text-[var(--color-accent-hover)]"
          target="_blank"
          rel="noopener noreferrer"
        >
          @just_iks
        </a>
        <span className="mx-2 text-[var(--color-border)]">•</span>
        <span className="uppercase tracking-widest text-[0.75rem]">invite-only</span>
      </p>
      <p className="mt-[var(--space-xs)] font-mono text-[0.6875rem] lowercase tracking-[0.2em] text-[var(--color-text-muted)]/50">
        privacy first.
      </p>
      <p className="mt-[var(--space-sm)]">
        <Link
          href="/privacy"
          className="text-[0.75rem] text-[var(--color-accent)] transition-colors hover:text-[var(--color-accent-hover)]"
        >
          Конфиденциальность
        </Link>
      </p>
    </footer>
  )
}
