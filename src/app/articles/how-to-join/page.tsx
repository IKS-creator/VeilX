import type { Metadata } from 'next'
import { ArticleLayout } from '@/components/article-layout'
import { Card } from '@/components/card'

export const metadata: Metadata = {
  title: 'Как присоединиться',
  description: 'Инструкция по получению доступа к VeilX — приватному VPN для своих.',
  alternates: { canonical: '/articles/how-to-join' },
}

export default function HowToJoinPage() {
  return (
    <ArticleLayout
      title="Как присоединиться"
      subtitle="VeilX — закрытый VPN. Доступ только по приглашению от админа."
      updatedAt="13.04.2026"
    >
      <Card>
        <div className="font-[family-name:var(--font-mono)] text-[0.6875rem] text-[var(--color-accent)] tracking-wider mb-[var(--space-sm)]">
          [01] Напиши админу
        </div>
        <p className="text-[0.9375rem] leading-relaxed text-[var(--color-text-muted)]">
          Открой Telegram и напиши{' '}
          <a
            href="https://t.me/iks_creator"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-accent)] transition-all hover:text-[var(--color-accent-hover)] hover:underline"
          >
            @iks_creator
          </a>
          . Это Кирилл — он управляет VeilX.
        </p>
      </Card>

      <Card>
        <div className="font-[family-name:var(--font-mono)] text-[0.6875rem] text-[var(--color-accent)] tracking-wider mb-[var(--space-sm)]">
          [02] Пример сообщения
        </div>
        <div className="rounded-[var(--radius-sm)] border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/5 p-[var(--space-md)] font-[family-name:var(--font-mono)] text-[0.875rem] leading-relaxed text-[var(--color-text)]">
          <p>Привет, Кирилл!</p>
          <p className="mt-2">Хочу присоединиться к VeilX.</p>
          <p>Меня зовут <span className="text-[var(--color-accent)]">[Имя]</span>.</p>
          <p>Разреши пожалуйста.</p>
        </div>
        <p className="mt-[var(--space-sm)] text-[0.8125rem] text-[var(--color-text-muted)]/60">
          Замени <span className="text-[var(--color-accent)]">[Имя]</span> на своё настоящее имя, чтобы админ знал, кто ты.
        </p>
      </Card>

      <Card>
        <div className="font-[family-name:var(--font-mono)] text-[0.6875rem] text-[var(--color-accent)] tracking-wider mb-[var(--space-sm)]">
          [03] Что будет дальше
        </div>
        <ol className="space-y-3 text-[0.9375rem] text-[var(--color-text-muted)]">
          <li className="flex gap-[var(--space-sm)]">
            <span className="shrink-0 font-[family-name:var(--font-mono)] text-[0.75rem] text-[var(--color-accent)] mt-[2px]">01</span>
            <span>Кирилл одобрит запрос и создаст твой аккаунт.</span>
          </li>
          <li className="flex gap-[var(--space-sm)]">
            <span className="shrink-0 font-[family-name:var(--font-mono)] text-[0.75rem] text-[var(--color-accent)] mt-[2px]">02</span>
            <span>Ты получишь личную ссылку вида <code className="text-[var(--color-accent)] text-[0.8125rem]">veilx.app/c/твой_код</code>.</span>
          </li>
          <li className="flex gap-[var(--space-sm)]">
            <span className="shrink-0 font-[family-name:var(--font-mono)] text-[0.75rem] text-[var(--color-accent)] mt-[2px]">03</span>
            <span>На этой странице будет QR-код и конфиг для подключения.</span>
          </li>
          <li className="flex gap-[var(--space-sm)]">
            <span className="shrink-0 font-[family-name:var(--font-mono)] text-[0.75rem] text-[var(--color-accent)] mt-[2px]">04</span>
            <span>Дальше — просто следуй инструкции на странице настройки.</span>
          </li>
        </ol>
      </Card>

      <div className="text-center pt-[var(--space-md)]">
        <a
          href="https://t.me/iks_creator"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-[var(--radius-sm)] border border-[var(--color-accent)]/50 bg-[var(--color-accent)]/10 px-[var(--space-lg)] py-[var(--space-sm)] min-h-[44px] font-[family-name:var(--font-mono)] text-[0.8125rem] font-medium uppercase tracking-wider text-[var(--color-accent)] transition-all duration-200 hover:bg-[var(--color-accent)]/20 hover:border-[var(--color-accent)] hover:shadow-[var(--glow-cyan)]"
        >
          Написать @iks_creator в Telegram
        </a>
      </div>
    </ArticleLayout>
  )
}
