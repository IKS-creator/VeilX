'use client'

import { useState, type ReactNode } from 'react'

type Tab = {
  id: string
  label: string
  content: ReactNode
}

type TabsProps = {
  tabs: Tab[]
  defaultTab?: string
}

export function Tabs({ tabs, defaultTab }: TabsProps) {
  const [active, setActive] = useState(defaultTab ?? tabs[0]?.id)
  const current = tabs.find((t) => t.id === active) ?? tabs[0]

  return (
    <div>
      <div
        role="tablist"
        className="flex gap-[var(--space-xs)] overflow-x-auto border-b border-[var(--color-border)] whitespace-nowrap"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={tab.id === active}
            aria-controls={`panel-${tab.id}`}
            onClick={() => setActive(tab.id)}
            className={[
              'cursor-pointer px-[var(--space-md)] py-[var(--space-sm)]',
              'font-[family-name:var(--font-mono)] text-[0.8125rem] uppercase tracking-wider',
              'transition-all duration-200',
              tab.id === active
                ? 'border-b-[1.5px] border-[var(--color-accent)] text-[var(--color-accent)] neon-text'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]',
            ].join(' ')}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div
        id={`panel-${current.id}`}
        role="tabpanel"
        className="pt-[var(--space-lg)]"
      >
        {current.content}
      </div>
    </div>
  )
}
