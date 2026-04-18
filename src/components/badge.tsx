type BadgeProps = {
  status: 'active' | 'disabled'
  lastConnectedAt: string | null
}

type ConnectionState = 'online' | 'recent' | 'offline' | 'disabled'

function getConnectionState(status: string, lastConnectedAt: string | null): ConnectionState {
  if (status === 'disabled') return 'disabled'
  if (!lastConnectedAt) return 'offline'

  const ago = Date.now() - new Date(lastConnectedAt).getTime()
  const minutes = ago / 60_000

  if (minutes < 3) return 'online'
  if (minutes < 10) return 'recent'
  return 'offline'
}

function formatAgo(lastConnectedAt: string): string {
  const ago = Date.now() - new Date(lastConnectedAt).getTime()
  const min = Math.round(ago / 60_000)
  if (min < 1) return '\u0442\u043e\u043b\u044c\u043a\u043e \u0447\u0442\u043e'
  if (min < 60) return `${min} \u043c\u0438\u043d \u043d\u0430\u0437\u0430\u0434`
  const hrs = Math.round(min / 60)
  if (hrs < 24) return `${hrs} \u0447 \u043d\u0430\u0437\u0430\u0434`
  const days = Math.round(hrs / 24)
  return `${days} \u0434\u043d \u043d\u0430\u0437\u0430\u0434`
}

const config: Record<ConnectionState, { dot: string; label: (lc: string | null) => string; text: string }> = {
  online: {
    dot: 'bg-[var(--color-success)] shadow-[var(--glow-green)]',
    label: () => '\u043e\u043d\u043b\u0430\u0439\u043d',
    text: 'text-[var(--color-success)]',
  },
  recent: {
    dot: 'bg-[var(--color-warning)]',
    label: (lc) => lc ? formatAgo(lc) : '',
    text: 'text-[var(--color-warning)]',
  },
  offline: {
    dot: 'bg-[var(--color-text-muted)]/40',
    label: () => '\u043d\u0435 \u0432 \u0441\u0435\u0442\u0438',
    text: 'text-[var(--color-text-muted)]/60',
  },
  disabled: {
    dot: 'bg-[var(--color-text-muted)]/30',
    label: () => '\u043e\u0442\u043a\u043b\u044e\u0447\u0451\u043d',
    text: 'text-[var(--color-text-muted)]/50',
  },
}

export function Badge({ status, lastConnectedAt }: BadgeProps) {
  const state = getConnectionState(status, lastConnectedAt)
  const c = config[state]

  return (
    <span className="inline-flex items-center gap-2 font-[family-name:var(--font-mono)] text-[0.8125rem] tracking-wide">
      <span
        aria-hidden="true"
        className={`inline-block h-1.5 w-1.5 rounded-full ${c.dot}`}
      />
      <span className={c.text}>
        {c.label(lastConnectedAt)}
      </span>
    </span>
  )
}
