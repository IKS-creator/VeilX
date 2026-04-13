'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/button'

type CopyButtonProps = {
  text: string
  label?: string
  variant?: 'primary' | 'secondary'
  full?: boolean
}

export function CopyButton({
  text,
  label = 'Скопировать',
  variant = 'primary',
  full = false,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback: noop — clipboard may be blocked
    }
  }, [text])

  return (
    <Button
      variant={copied ? 'success' : variant}
      full={full}
      onClick={handleCopy}
    >
      {copied ? 'OK' : label}
    </Button>
  )
}
