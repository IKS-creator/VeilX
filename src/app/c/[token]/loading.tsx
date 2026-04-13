import { Spinner } from '@/components/spinner'

export default function Loading() {
  return (
    <main className="mx-auto max-w-[640px] px-[var(--space-md)] py-[var(--space-2xl)] md:px-[var(--space-lg)]">
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-[var(--space-md)]">
        <Spinner className="h-6 w-6" />
        <p className="font-[family-name:var(--font-mono)] text-[0.8125rem] text-[var(--color-text-muted)]">
          {'> loading_config...'}
        </p>
      </div>
    </main>
  )
}
