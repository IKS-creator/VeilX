'use client'

import { useState, useEffect } from 'react'

const TITLE = '> НАСТРОЙКА VPN'
const TYPING_SPEED = 45

export function SetupHeading() {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) {
      setDisplayed(TITLE)
      setDone(true)
      return
    }

    let i = 0
    const interval = setInterval(() => {
      i++
      setDisplayed(TITLE.slice(0, i))
      if (i >= TITLE.length) {
        clearInterval(interval)
        setDone(true)
      }
    }, TYPING_SPEED)
    return () => clearInterval(interval)
  }, [])

  return (
    <h1
      className="glitch-text font-[family-name:var(--font-mono)] text-[1.5rem] font-bold tracking-wider uppercase text-[var(--color-accent)] neon-text"
      data-text={displayed}
    >
      {displayed}
      {!done && (
        <span className="animate-[blink_1s_step-end_infinite] text-[var(--color-accent)]">
          _
        </span>
      )}
      {done && (
        <span className="animate-[blink_1s_step-end_infinite] text-[var(--color-accent)]/50">
          _
        </span>
      )}
    </h1>
  )
}
