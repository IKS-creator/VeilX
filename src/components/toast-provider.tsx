'use client'

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react'

type ToastVariant = 'success' | 'error'

type Toast = {
  id: number
  message: string
  variant: ToastVariant
  phase: 'entering' | 'visible' | 'leaving'
}

type ToastCtx = {
  showSuccess: (msg: string) => void
  showError: (msg: string) => void
}

const ToastContext = createContext<ToastCtx>({
  showSuccess: () => {},
  showError: () => {},
})

export function useToast() {
  return useContext(ToastContext)
}

let nextId = 0

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const push = useCallback((message: string, variant: ToastVariant) => {
    const id = nextId++
    setToasts((prev) => [...prev, { id, message, variant, phase: 'entering' }])

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setToasts((prev) =>
          prev.map((t) => (t.id === id ? { ...t, phase: 'visible' } : t)),
        )
      })
    })

    setTimeout(() => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, phase: 'leaving' } : t)),
      )
    }, 2800)
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }, [])

  const showSuccess = useCallback((msg: string) => push(msg, 'success'), [push])
  const showError = useCallback((msg: string) => push(msg, 'error'), [push])

  return (
    <ToastContext value={{ showSuccess, showError }}>
      {children}
      <div
        aria-live="polite"
        role="status"
        className="fixed bottom-[var(--space-md)] right-[var(--space-md)] z-50 flex flex-col gap-[var(--space-sm)] max-md:left-[var(--space-md)] max-md:right-[var(--space-md)]"
      >
        {toasts.map((t) => {
          const hidden = t.phase === 'entering' || t.phase === 'leaving'
          return (
            <div
              key={t.id}
              className={[
                'rounded-[var(--radius-sm)] border bg-[var(--color-surface)] px-[var(--space-md)] py-[var(--space-sm)]',
                'font-[family-name:var(--font-mono)] text-[0.8125rem] text-[var(--color-text)]',
                'transition-all duration-200 ease-out',
                t.variant === 'success' && 'border-[var(--color-success)]/30 shadow-[var(--glow-green)]',
                t.variant === 'error' && 'border-[var(--color-error)]/30 shadow-[var(--glow-red)]',
                hidden ? 'translate-x-full opacity-0 md:translate-x-full max-md:translate-y-4 max-md:translate-x-0' : 'translate-x-0 translate-y-0 opacity-100',
              ].filter(Boolean).join(' ')}
            >
              {t.message}
            </div>
          )
        })}
      </div>
    </ToastContext>
  )
}
