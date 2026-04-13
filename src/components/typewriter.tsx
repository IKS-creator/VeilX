'use client'

import { useState, useEffect } from 'react'

type TypewriterProps = {
  text: string
  speed?: number
  className?: string
}

export function Typewriter({ text, speed = 30, className = '' }: TypewriterProps) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    // Respect prefers-reduced-motion
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) {
      setDisplayed(text)
      setDone(true)
      return
    }

    let i = 0
    const interval = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) {
        clearInterval(interval)
        setDone(true)
      }
    }, speed)
    return () => clearInterval(interval)
  }, [text, speed])

  return (
    <span className={className}>
      {displayed}
      {!done && <span className="animate-[blink_1s_step-end_infinite] text-[var(--color-accent)]">_</span>}
    </span>
  )
}
