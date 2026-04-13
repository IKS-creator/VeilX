'use client'

import { Tabs } from '@/components/tabs'

const platforms = [
  {
    id: 'ios',
    label: 'iOS',
    client: 'Streisand',
    link: 'https://apps.apple.com/app/streisand/id6450534064',
    steps: [
      'Скачай Streisand из App Store.',
      'Открой свою персональную страницу VeilX.',
      'Нажми «Скопировать» — ссылка скопируется в буфер.',
      'В Streisand нажми «+» → «Добавить из буфера».',
      'Включи подключение — готово.',
    ],
  },
  {
    id: 'android',
    label: 'Android',
    client: 'v2rayNG',
    link: 'https://play.google.com/store/apps/details?id=com.v2ray.ang',
    steps: [
      'Скачай v2rayNG из Google Play.',
      'Открой свою персональную страницу VeilX.',
      'Нажми «Скопировать» — ссылка скопируется в буфер.',
      'В v2rayNG нажми «+» → «Импорт из буфера».',
      'Нажми кнопку подключения внизу экрана.',
    ],
  },
  {
    id: 'windows',
    label: 'Windows',
    client: 'Hiddify',
    link: 'https://github.com/hiddify/hiddify-app/releases',
    steps: [
      'Скачай Hiddify с GitHub (Windows версия).',
      'Установи и запусти приложение.',
      'Открой свою персональную страницу VeilX.',
      'Скопируй VLESS-ссылку.',
      'В Hiddify: «Новый профиль» → «Добавить из буфера».',
      'Нажми «Подключиться».',
    ],
  },
  {
    id: 'macos',
    label: 'macOS',
    client: 'Streisand',
    link: 'https://apps.apple.com/app/streisand/id6450534064',
    steps: [
      'Скачай Streisand из Mac App Store.',
      'Открой свою персональную страницу VeilX.',
      'Скопируй VLESS-ссылку.',
      'В Streisand нажми «+» → «Добавить из буфера».',
      'Включи подключение.',
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
            <h3 className="font-[family-name:var(--font-mono)] text-[1rem] font-semibold tracking-wide">
              {p.client}
            </h3>
            <a
              href={p.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-[var(--space-xs)] inline-block font-[family-name:var(--font-mono)] text-[0.8125rem] text-[var(--color-accent)]/70 transition-colors hover:text-[var(--color-accent)]"
            >
              Скачать {p.client}
            </a>
            <ol className="mt-[var(--space-md)] list-inside list-decimal space-y-2 text-[0.875rem] text-[var(--color-text)]">
              {p.steps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>
        ),
      }))}
    />
  )
}
