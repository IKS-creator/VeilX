import Link from 'next/link'

type NavBackProps = {
  href?: string
  label?: string
}

export function NavBack({ href = '/', label = 'На главную' }: NavBackProps) {
  return (
    <nav className="mb-[var(--space-lg)]">
      <Link
        href={href}
        className="inline-flex items-center gap-[var(--space-sm)] font-[family-name:var(--font-mono)] text-[0.8125rem] text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-accent)] min-h-[44px]"
      >
        <span aria-hidden="true">&larr;</span>
        {label}
      </Link>
    </nav>
  )
}
