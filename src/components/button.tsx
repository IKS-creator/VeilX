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
    'bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)]',
  secondary:
    'bg-transparent text-[var(--color-text)] border border-[var(--color-border)] hover:bg-[var(--color-surface-hover)]',
  danger:
    'bg-[var(--color-error)] text-white hover:opacity-80',
  success:
    'bg-[var(--color-success)] text-white hover:opacity-80',
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
        'rounded-[var(--radius-sm)] px-[var(--space-md)] py-[var(--space-sm)] min-h-[44px]',
        'text-[0.875rem] font-medium leading-tight',
        'transition-[background-color,opacity] duration-150 ease-in-out',
        'cursor-pointer',
        variantClasses[variant],
        full && 'w-full',
        isDisabled && 'opacity-50 cursor-not-allowed pointer-events-none',
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
      className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
    />
  )
}
