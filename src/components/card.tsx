import { HTMLAttributes } from 'react'

type CardProps = HTMLAttributes<HTMLDivElement> & {
  muted?: boolean
  center?: boolean
  glow?: boolean
}

export function Card({
  muted = false,
  center = false,
  glow = false,
  children,
  className = '',
  ...props
}: CardProps) {
  return (
    <div
      className={[
        'rounded-[var(--radius-md)] border border-[var(--color-border)] p-[var(--space-lg)]',
        muted ? 'bg-[var(--color-surface-dim)]' : 'bg-[var(--color-surface)]',
        center && 'text-center',
        glow && 'border-[var(--color-accent)]/20 shadow-[var(--glow-cyan)]',
        className,
      ].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
    </div>
  )
}
