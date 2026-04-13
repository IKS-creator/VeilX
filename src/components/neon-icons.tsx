const glowFilter = (
  <defs>
    <filter id="neon" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
)

const svgProps = {
  xmlns: 'http://www.w3.org/2000/svg',
  width: 32,
  height: 32,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  className: 'text-[var(--color-accent)] drop-shadow-[0_0_6px_var(--color-accent)]',
  'aria-hidden': true as const,
}

/** Lightning bolt — speed */
export function IconBolt() {
  return (
    <svg {...svgProps}>
      {glowFilter}
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" filter="url(#neon)" />
    </svg>
  )
}

/** Shield with check — security */
export function IconShield() {
  return (
    <svg {...svgProps}>
      {glowFilter}
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" filter="url(#neon)" />
      <path d="M9 12l2 2 4-4" filter="url(#neon)" />
    </svg>
  )
}

/** QR code / checkmark — simplicity */
export function IconSimple() {
  return (
    <svg {...svgProps}>
      {glowFilter}
      <rect x="3" y="3" width="7" height="7" rx="1" filter="url(#neon)" />
      <rect x="14" y="3" width="7" height="7" rx="1" filter="url(#neon)" />
      <rect x="3" y="14" width="7" height="7" rx="1" filter="url(#neon)" />
      <rect x="14" y="14" width="3" height="3" rx="0.5" filter="url(#neon)" />
      <path d="M21 14v3h-3" filter="url(#neon)" />
      <path d="M18 21h3v-3" filter="url(#neon)" />
    </svg>
  )
}
