'use client'

import { useEffect, useId, useRef, type ReactNode } from 'react'

type ModalProps = {
  open: boolean
  onClose: () => void
  titleId?: string
  children: ReactNode
}

export function Modal({ open, onClose, titleId, children }: ModalProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const fallbackId = useId()
  const labelId = titleId ?? fallbackId

  // Esc to close
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  // Focus trap: keep focus inside modal
  useEffect(() => {
    if (!open || !contentRef.current) return
    const el = contentRef.current
    const focusable = el.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    )
    if (focusable.length) focusable[0].focus()

    const trap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', trap)
    return () => document.removeEventListener('keydown', trap)
  }, [open])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-overlay)] backdrop-blur-[6px] animate-[fadeIn_150ms_ease]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        ref={contentRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelId}
        className={[
          'bg-[var(--color-surface)] border border-[var(--color-border)] p-[var(--space-lg)] animate-[slideUp_200ms_ease-out]',
          'md:max-w-[400px] md:w-full md:rounded-[var(--radius-md)]',
          'max-md:fixed max-md:bottom-0 max-md:left-0 max-md:right-0 max-md:rounded-t-[var(--radius-md)]',
          'shadow-[0_0_40px_rgba(0,240,255,0.08)]',
        ].join(' ')}
      >
        {children}
      </div>
    </div>
  )
}
