type AppStoreHelpProps = {
  platform: 'ios' | 'macos'
}

const method1Steps = (settings: string) => [
  `Открой ${settings} → [твоё имя] → Медиаматериалы и покупки → Выйти (из App Store, не из iCloud!)`,
  'Создай новый Apple ID на appleid.apple.com — регион Казахстан',
  'Адрес — любой казахстанский (погугли). Способ оплаты — «Нет»',
  'Войди в App Store под новым Apple ID → скачай Streisand',
  'Выйди, вернись в основной — Streisand останется',
]

const method2Steps = (settings: string) => [
  `${settings} → [твоё имя] → Медиаматериалы и покупки → Просмотреть → Страна/регион`,
  'Выбери Казахстан (или Армению, Турцию, ОАЭ)',
  'Скачай Streisand',
  'При желании верни регион обратно',
]

const altClients = ['FoXray', 'V2Box', 'Sing-Box']

function StepList({ steps }: { steps: string[] }) {
  return (
    <ol className="mt-[var(--space-sm)] space-y-2 text-[0.8125rem] text-[var(--color-text)]">
      {steps.map((text, i) => (
        <li key={i} className="flex gap-[var(--space-sm)]">
          <span className="shrink-0 font-[family-name:var(--font-mono)] text-[0.6875rem] text-[var(--color-accent)] mt-[2px]">
            {String(i + 1).padStart(2, '0')}
          </span>
          <span>{text}</span>
        </li>
      ))}
    </ol>
  )
}

export function AppStoreHelp({ platform }: AppStoreHelpProps) {
  const settings = platform === 'ios' ? 'Настройки' : 'Системные настройки'

  return (
    <details className="mt-[var(--space-md)] group">
      <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden font-[family-name:var(--font-mono)] text-[0.8125rem] text-[var(--color-warning)] hover:text-[var(--color-accent)] transition-colors">
        <span className="inline-flex items-center gap-[var(--space-xs)]">
          <span className="inline-block transition-transform duration-200 group-open:rotate-90">▸</span>
          Не находится Streisand в App Store?
        </span>
      </summary>

      <div className="mt-[var(--space-md)] space-y-[var(--space-lg)] border-l border-[var(--color-border)] pl-[var(--space-md)]">
        <p className="text-[0.8125rem] text-[var(--color-text-muted)]">
          Apple убрали Streisand из российского App Store. Вот как скачать:
        </p>

        {/* Method 1: new Apple ID */}
        <div>
          <h4 className="font-[family-name:var(--font-mono)] text-[0.8125rem] font-semibold text-[var(--color-accent)]">
            Способ 1 — второй Apple ID (проще)
          </h4>
          <p className="mt-[var(--space-xs)] text-[0.8125rem] text-[var(--color-text-muted)]">
            Основной аккаунт, iCloud и подписки не пострадают. Создаёшь отдельный Apple ID только для загрузки приложений.
          </p>
          <StepList steps={method1Steps(settings)} />
        </div>

        {/* Method 2: change region */}
        <div>
          <h4 className="font-[family-name:var(--font-mono)] text-[0.8125rem] font-semibold text-[var(--color-accent)]">
            Способ 2 — сменить регион основного Apple ID (быстрее)
          </h4>
          <div className="mt-[var(--space-sm)] flex gap-[var(--space-sm)] rounded-[var(--radius-sm)] border border-[var(--color-warning)]/30 bg-[var(--color-warning)]/5 px-[var(--space-sm)] py-[var(--space-xs)]">
            <span className="shrink-0">⚠️</span>
            <span className="text-[0.8125rem] text-[var(--color-warning)]">
              Сначала отмени подписки и потрать баланс до 0 — иначе Apple не даст сменить страну.
            </span>
          </div>
          <StepList steps={method2Steps(settings)} />
        </div>

        {/* Alternative VLESS clients */}
        <div>
          <h4 className="font-[family-name:var(--font-mono)] text-[0.8125rem] font-semibold text-[var(--color-accent)]">
            Альтернативные клиенты
          </h4>
          <p className="mt-[var(--space-xs)] text-[0.8125rem] text-[var(--color-text-muted)]">
            Менять Apple ID не хочется? Эти VLESS-клиенты работают с тем же конфигом VeilX:
          </p>
          <ul className="mt-[var(--space-sm)] space-y-1 text-[0.8125rem] text-[var(--color-text)]">
            {altClients.map((name) => (
              <li key={name} className="flex gap-[var(--space-sm)]">
                <span className="text-[var(--color-accent)]">—</span>
                {name} (бесплатно)
              </li>
            ))}
          </ul>
          <p className="mt-[var(--space-xs)] text-[0.75rem] text-[var(--color-text-muted)]/60">
            Шаги те же — скопируй ссылку VeilX и добавь из буфера.
          </p>
        </div>

        {/* Apple support link */}
        <a
          href="https://support.apple.com/ru-ru/108247"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-[0.75rem] text-[var(--color-accent)]/60 hover:text-[var(--color-accent)] transition-colors"
        >
          Подробнее у Apple →
        </a>
      </div>
    </details>
  )
}
