import { NavBack } from '@/components/nav-back'
import { SiteFooter } from '@/components/site-footer'

type ArticleLayoutProps = {
  title: string
  subtitle?: string
  updatedAt?: string
  children: React.ReactNode
}

export function ArticleLayout({ title, subtitle, updatedAt, children }: ArticleLayoutProps) {
  return (
    <main className="mx-auto max-w-[640px] px-[var(--space-md)] py-[var(--space-2xl)] md:px-[var(--space-lg)]">
      <NavBack />

      <h1 className="font-[family-name:var(--font-mono)] text-[1.5rem] font-bold tracking-wider uppercase text-[var(--color-accent)] neon-text">
        <span className="text-[var(--color-text-muted)]">&gt;</span> {title}
      </h1>
      {subtitle && (
        <p className="mt-[var(--space-sm)] text-[0.9375rem] text-[var(--color-text-muted)]">
          {subtitle}
        </p>
      )}
      {updatedAt && (
        <p className="mt-[var(--space-xs)] font-[family-name:var(--font-mono)] text-[0.6875rem] text-[var(--color-text-muted)]/50 tracking-wide">
          upd: {updatedAt}
        </p>
      )}

      <div className="mt-[var(--space-xl)] space-y-[var(--space-lg)]">
        {children}
      </div>

      <SiteFooter />
    </main>
  )
}
