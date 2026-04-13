type BadgeProps = {
  status: 'active' | 'disabled'
}

export function Badge({ status }: BadgeProps) {
  const isActive = status === 'active'
  return (
    <span className="inline-flex items-center gap-2 font-[family-name:var(--font-mono)] text-[0.8125rem] tracking-wide">
      <span
        aria-hidden="true"
        className={[
          'inline-block h-1.5 w-1.5 rounded-full',
          isActive
            ? 'bg-[var(--color-success)] shadow-[var(--glow-green)]'
            : 'bg-[var(--color-text-muted)]/50',
        ].join(' ')}
      />
      <span className={isActive ? 'text-[var(--color-success)]' : 'text-[var(--color-text-muted)]'}>
        {isActive ? 'активен' : 'отключён'}
      </span>
    </span>
  )
}
