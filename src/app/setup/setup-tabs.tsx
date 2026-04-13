'use client'

import { useSyncExternalStore } from 'react'
import { Tabs } from '@/components/tabs'

function getPlatform(): string {
  const ua = navigator.userAgent
  if (/iPad|iPhone|iPod/.test(ua)) return 'ios'
  if (/Android/.test(ua)) return 'android'
  if (/Macintosh|MacIntel/.test(ua)) return 'macos'
  if (/Windows/.test(ua)) return 'windows'
  return 'ios'
}

const subscribe = () => () => {}
function usePlatform(): string {
  return useSyncExternalStore(subscribe, getPlatform, () => 'ios')
}

type Step = { bold: string; rest: string }

type Platform = {
  id: string
  label: string
  client: string
  link: string
  linkLabel: string
  altLink?: string
  altLinkLabel?: string
  steps: Step[]
}

const platforms: Platform[] = [
  {
    id: 'ios',
    label: '📱 iOS',
    client: 'Streisand',
    link: 'https://apps.apple.com/app/streisand/id6450534064',
    linkLabel: 'Открыть App Store',
    steps: [
      { bold: 'Скачай', rest: 'приложение Streisand (кнопка выше).' },
      { bold: 'Вернись', rest: 'на эту страницу и открой свою личную ссылку (её прислал админ).' },
      { bold: 'Нажми', rest: 'кнопку «Скопировать» на своей странице.' },
      { bold: 'Открой', rest: 'Streisand → нажми «+» → «Добавить из буфера».' },
      { bold: 'Включи', rest: 'переключатель — готово, VPN работает!' },
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
      { bold: 'Скачай', rest: 'приложение v2rayNG (кнопка выше → файл .apk для Android).' },
      { bold: 'Вернись', rest: 'на эту страницу и открой свою личную ссылку (её прислал админ).' },
      { bold: 'Нажми', rest: 'кнопку «Скопировать» на своей странице.' },
      { bold: 'Открой', rest: 'v2rayNG → нажми «+» → «Импорт из буфера».' },
      { bold: 'Нажми', rest: 'большую кнопку подключения внизу экрана — готово!' },
    ],
  },
  {
    id: 'windows',
    label: '💻 Windows',
    client: 'Hiddify',
    link: 'https://github.com/hiddify/hiddify-app/releases',
    linkLabel: 'Скачать с GitHub',
    steps: [
      { bold: 'Скачай', rest: 'Hiddify (кнопка выше → выбери Windows-версию).' },
      { bold: 'Установи', rest: 'и запусти приложение.' },
      { bold: 'Открой', rest: 'свою личную ссылку VeilX (её прислал админ).' },
      { bold: 'Нажми', rest: '«Скопировать» на своей странице.' },
      { bold: 'В Hiddify:', rest: '«Новый профиль» → «Добавить из буфера».' },
      { bold: 'Нажми', rest: '«Подключиться» — готово!' },
    ],
  },
  {
    id: 'macos',
    label: '🍎 macOS',
    client: 'Streisand',
    link: 'https://apps.apple.com/app/streisand/id6450534064',
    linkLabel: 'Открыть Mac App Store',
    steps: [
      { bold: 'Скачай', rest: 'Streisand из Mac App Store (кнопка выше).' },
      { bold: 'Открой', rest: 'свою личную ссылку VeilX (её прислал админ).' },
      { bold: 'Нажми', rest: '«Скопировать» на своей странице.' },
      { bold: 'В Streisand', rest: 'нажми «+» → «Добавить из буфера».' },
      { bold: 'Включи', rest: 'переключатель — готово!' },
    ],
  },
]

export function SetupTabs() {
  const detectedPlatform = usePlatform()

  return (
    <Tabs
      defaultTab={detectedPlatform}
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
                  <span><strong className="text-[var(--color-text)]">{step.bold}</strong> {step.rest}</span>
                </li>
              ))}
            </ol>
          </div>
        ),
      }))}
    />
  )
}
