'use client'

import { ButtonHTMLAttributes } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  full?: boolean
  loading?: boolean
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]/50 hover:bg-[var(--color-accent)]/20 hover:border-[var(--color-accent)] hover:shadow-[var(--glow-cyan)]',
  secondary:
    'bg-transparent text-[var(--color-text-muted)] border border-[var(--color-border)] hover:text-[var(--color-text)] hover:border-[var(--color-text-muted)]/50 hover:bg-[var(--color-surface-hover)]',
  danger:
    'bg-[var(--color-error)]/10 text-[var(--color-error)] border border-[var(--color-error)]/30 hover:bg-[var(--color-error)]/20 hover:border-[var(--color-error)]/60 hover:shadow-[var(--glow-red)]',
  success:
    'bg-[var(--color-success)]/10 text-[var(--color-success)] border border-[var(--color-success)]/30 hover:bg-[var(--color-success)]/20 hover:shadow-[var(--glow-green)]',
}

export function Button({
  variant = 'primary',
  full = false,
  loading = false,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading

  return (
    <button
      disabled={isDisabled}
      className={[
        'inline-flex items-center justify-center gap-[var(--space-sm)]',
        'rounded-[var(--radius-sm)] px-[var(--space-md)] py-[var(--space-sm)] min-h-[40px]',
        'font-[family-name:var(--font-mono)] text-[0.8125rem] font-medium tracking-wide uppercase',
        'transition-all duration-200 ease-out',
        'cursor-pointer',
        variantClasses[variant],
        full && 'w-full',
        isDisabled && 'opacity-40 cursor-not-allowed pointer-events-none',
        className,
      ].filter(Boolean).join(' ')}
      {...props}
    >
      {loading && <Spinner />}
      {children}
    </button>
  )
}

function Spinner() {
  return (
    <span
      aria-hidden="true"
      className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-[1.5px] border-current border-t-transparent"
    />
  )
}
