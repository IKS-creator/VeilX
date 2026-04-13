'use client'

import { Tabs } from '@/components/tabs'

type Platform = {
  id: string
  label: string
  client: string
  link: string
  linkLabel: string
  altLink?: string
  altLinkLabel?: string
  steps: string[]
}

const platforms: Platform[] = [
  {
    id: 'ios',
    label: '📱 iOS',
    client: 'Streisand',
    link: 'https://apps.apple.com/app/streisand/id6450534064',
    linkLabel: 'Открыть App Store',
    steps: [
      'Скачай приложение Streisand (кнопка выше).',
      'Вернись на эту страницу и открой свою личную ссылку (её прислал админ).',
      'Нажми кнопку «Скопировать» на своей странице.',
      'Открой Streisand → нажми «+» → «Добавить из буфера».',
      'Включи переключатель — готово, VPN работает!',
    ],
  },
  {
    id: 'android',
    label: '🤖 Android',
    client: 'v2rayNG',
    link: 'https://github.com/2dust/v2rayNG/releases/latest',
    linkLabel: 'Скачать с GitHub',
    altLink: 'https://play.google.com/store/apps/details?id=com.v2ray.ang',
    altLinkLabel: 'Или из Google Play',
    steps: [
      'Скачай приложение v2rayNG (кнопка выше → файл .apk для Android).',
      'Вернись на эту страницу и открой свою личную ссылку (её прислал админ).',
      'Нажми кнопку «Скопировать» на своей странице.',
      'Открой v2rayNG → нажми «+» → «Импорт из буфера».',
      'Нажми большую кнопку подключения внизу экрана — готово!',
    ],
  },
  {
    id: 'windows',
    label: '💻 Windows',
    client: 'Hiddify',
    link: 'https://github.com/hiddify/hiddify-app/releases',
    linkLabel: 'Скачать с GitHub',
    steps: [
      'Скачай Hiddify (кнопка выше → выбери Windows-версию).',
      'Установи и запусти приложение.',
      'Открой свою личную ссылку VeilX (её прислал админ).',
      'Нажми «Скопировать» на своей странице.',
      'В Hiddify: «Новый профиль» → «Добавить из буфера».',
      'Нажми «Подключиться» — готово!',
    ],
  },
  {
    id: 'macos',
    label: '🍎 macOS',
    client: 'Streisand',
    link: 'https://apps.apple.com/app/streisand/id6450534064',
    linkLabel: 'Открыть Mac App Store',
    steps: [
      'Скачай Streisand из Mac App Store (кнопка выше).',
      'Открой свою личную ссылку VeilX (её прислал админ).',
      'Нажми «Скопировать» на своей странице.',
      'В Streisand нажми «+» → «Добавить из буфера».',
      'Включи переключатель — готово!',
    ],
  },
]

export function SetupTabs() {
  return (
    <Tabs
      tabs={platforms.map((p) => ({
        id: p.id,
        label: p.label,
        content: (
          <div>
            {/* Prominent download button */}
            <a
              href={p.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-[var(--space-sm)] rounded-[var(--radius-sm)] border border-[var(--color-accent)]/50 bg-[var(--color-accent)]/10 px-[var(--space-lg)] py-[var(--space-sm)] min-h-[44px] font-[family-name:var(--font-mono)] text-[0.8125rem] font-medium uppercase tracking-wider text-[var(--color-accent)] transition-all duration-200 hover:bg-[var(--color-accent)]/20 hover:border-[var(--color-accent)] hover:shadow-[var(--glow-cyan)] w-full sm:w-auto"
            >
              ⬇ {p.linkLabel}
            </a>
            {p.altLink && (
              <a
                href={p.altLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-[var(--space-xs)] inline-flex items-center gap-[var(--space-xs)] font-[family-name:var(--font-mono)] text-[0.75rem] text-[var(--color-accent)]/60 transition-colors hover:text-[var(--color-accent)]"
              >
                {p.altLinkLabel} &rarr;
              </a>
            )}
            <p className="mt-[var(--space-xs)] font-[family-name:var(--font-mono)] text-[0.6875rem] text-[var(--color-text-muted)]/60">
              Приложение: {p.client} (бесплатно)
            </p>

            {/* Steps */}
            <ol className="mt-[var(--space-lg)] space-y-3 text-[0.9375rem] text-[var(--color-text)]">
              {p.steps.map((step, i) => (
                <li key={i} className="flex gap-[var(--space-sm)]">
                  <span className="shrink-0 font-[family-name:var(--font-mono)] text-[0.75rem] text-[var(--color-accent)] mt-[2px]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        ),
      }))}
    />
  )
}
