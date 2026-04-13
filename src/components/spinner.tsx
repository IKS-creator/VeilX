export function Spinner({ className = '' }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block h-4 w-4 animate-spin rounded-full border-[1.5px] border-[var(--color-accent)] border-t-transparent ${className}`}
    />
  )
}
