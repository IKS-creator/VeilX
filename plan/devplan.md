# VeilX — Development Plan

> Полная техническая документация. Каждый чанк — атомарная задача.
> Зависимости: Phase 0 → (Phase 1 ‖ Phase 3) → Phase 2 → Phase 4 → (Phase 5 ‖ Phase 6) → Phase 7

---

## Phase 0 — Scaffold & Config

Цель: рабочий Next.js 15 проект с пустыми маршрутами, CI-ready.

### 0.1 — Init Next.js 15 App Router

- `npx create-next-app@latest . --ts --tailwind --app --src-dir --no-import-alias`
- TypeScript strict mode в `tsconfig.json`: `"strict": true`
- Удалить boilerplate из `src/app/page.tsx`, `globals.css`

**Выход:** `npm run dev` запускается без ошибок.

### 0.2 — Tailwind v4 + Design Tokens

- Настроить `@theme` блок в `src/app/globals.css` (единственный CSS файл):
  - Color tokens: `--color-bg: #0a0a0a`, `--color-surface: #141414`, etc. (полный набор из DESIGN_SYSTEM.md §1)
  - Spacing: `--space-xs` через `--space-3xl`
  - Radius: `--radius-sm/md/lg`
  - Font: Inter (Google Fonts import), fallback `system-ui, sans-serif`
  - Font smoothing: `-webkit-font-smoothing: antialiased`
  - Typography scale (DESIGN_SYSTEM.md §2): `page__title` 2rem/700, `section__title` 1.5rem/700, `card__title` 1.25rem/600, `page__subtitle` 1.125rem/400, body 1rem/400, small 0.875rem/400 — реализовать как Tailwind utility classes или CSS custom properties
  - Layout (DESIGN_SYSTEM.md §5): container max-width 1024px, narrow 640px, padding 16px mobile / 24px desktop
  - Accessibility (DESIGN_SYSTEM.md §8): глобальные focus indicators — `2px outline var(--color-accent)` с offset на всех интерактивных элементах
- `<html lang="ru">`, dark body bg
- Meta: `<title>VeilX — приватный VPN</title>`, `robots: noindex,nofollow`

**Выход:** страница рендерится с тёмным фоном, Inter шрифтом, корректной типографикой и focus-стилями.

### 0.3 — Dependencies

```bash
npm install @vercel/postgres jose qrcode.react
npm install -D vitest @vitejs/plugin-react
```

- `jose` — JWT sign/verify (Edge-совместим, без `jsonwebtoken`)
- `qrcode.react` — QR-код компонент
- Настроить Vitest в `vitest.config.ts`
- Добавить scripts в `package.json`: `"test": "vitest run"`

**Выход:** `npm run test` запускается (0 tests, no errors).

### 0.4 — .env.example + Types

- Подтвердить `.env.example` с placeholder значениями (уже создан)
- Создать `src/lib/types.ts`:
  ```typescript
  export type ApiSuccess<T> = { success: true; data: T }
  export type ApiError = { success: false; error: string }
  export type ApiResponse<T> = ApiSuccess<T> | ApiError

  export type UserStatus = 'active' | 'disabled'

  export type User = {
    id: number
    name: string
    token: string
    vless_uuid: string
    status: UserStatus
    traffic_up: number
    traffic_down: number
    last_connected_at: string | null
    created_at: string
    updated_at: string
  }
  ```

**Выход:** типы импортируемы без ошибок TS.

### 0.5 — Directory Scaffold

Создать пустые файлы-заглушки (с минимальным экспортом) для всей структуры:

```
src/app/page.tsx                     — export default placeholder
src/app/layout.tsx                   — RootLayout с Inter, meta, globals.css
src/app/setup/page.tsx               — placeholder
src/app/c/[token]/page.tsx           — placeholder
src/app/admin/page.tsx               — placeholder 'use client'
src/app/api/admin/login/route.ts     — POST stub → 501
src/app/api/admin/users/route.ts     — GET/POST stubs → 501
src/app/api/admin/users/[id]/route.ts — PATCH/DELETE stubs → 501
src/app/api/admin/sync/route.ts      — POST stub → 501
src/app/api/config/[token]/route.ts  — GET stub → 501
src/app/api/cron/stats/route.ts      — GET stub → 501
src/lib/db.ts                        — empty exports
src/lib/auth.ts                      — empty exports
src/lib/vps-api-client.ts            — empty exports
src/lib/vless-link-builder.ts        — empty exports
src/lib/rate-limiter.ts              — empty exports
src/lib/format-traffic.ts            — empty exports
src/lib/types.ts                     — (уже из 0.4)
```

**Выход:** `npm run build` проходит без ошибок.

### 0.6 — ESLint + vercel.json

- Настроить ESLint: single quotes, no semicolons, trailing commas
- Создать `vercel.json` с cron:
  ```json
  { "crons": [{ "path": "/api/cron/stats", "schedule": "0 3 * * *" }] }
  ```
- Добавить `"lint": "next lint"` в scripts

**Выход:** `npm run lint` проходит.

---

## Phase 1 — VPS: Xray Setup (manual, вне этого репо)

> Выполняется на VPS вручную через SSH. Документируется здесь для полноты.

### 1.1 — System Prep

- SSH → `apt update && apt upgrade -y`
- UFW: `allow 22/tcp`, `allow 443/tcp`, `allow 8443/tcp`, `enable`

### 1.2 — Install Xray-core

- Скачать latest release с `github.com/XTLS/Xray-core`
- Распаковать в `/usr/local/bin/xray`
- Создать `/usr/local/etc/xray/config.json`

### 1.3 — Configure Xray

- Сгенерировать Reality keys: `xray x25519` → private key в config, public key → env
- Short ID: `openssl rand -hex 4`
- Конфиг: VLESS inbound :443, Reality, flow `xtls-rprx-vision`, SNI `dl.google.com`
- Stats API: `"stats": {}`, `"api": { "services": ["StatsService"] }`, dokodemo-door на `127.0.0.1:10085`
- Пустой `clients[]` (будут добавляться через API)

### 1.4 — Systemd Unit for Xray

- `/etc/systemd/system/xray.service`: `Restart=on-failure`, `RestartSec=5`, `StartLimitBurst=3`
- `systemctl enable --now xray`
- Проверить: `systemctl status xray`, `ss -tlnp | grep 443`

**Выход:** Xray слушает :443, Reality handshake работает.

---

## Phase 2 — VPS API (Express.js)

> Зависимость: Phase 1.

### 2.1 — Node.js + Project Init

- Установить Node.js 20 LTS на VPS
- `mkdir /opt/veilx-api && cd /opt/veilx-api && npm init -y`
- `npm install express`
- Сгенерировать self-signed cert:
  ```bash
  openssl req -x509 -newkey ec -pkeyopt ec_paramgen_curve:prime256v1 \
    -nodes -keyout key.pem -out cert.pem -days 3650 -subj "/CN=veilx-api"
  ```

### 2.2 — Auth Middleware + Error Format

- Проверка `Authorization: Bearer {API_TOKEN}` через `crypto.timingSafeEqual`
- 401 при невалидном/отсутствующем токене
- **Единый формат ответов VPS API**: успех `{ ok: true, ... }`, ошибка `{ error: "описание" }` + HTTP-код (400/401/404/409/500). Content-Type: `application/json`.
- Envfile: `/etc/veilx-api.env` с `API_PORT`, `API_TOKEN`, `XRAY_CONFIG_PATH`, `TLS_CERT_PATH`, `TLS_KEY_PATH`

**Выход:** запросы без токена → 401.

### 2.3 — POST /users

- Тело: `{ "uuid": "..." }`
- Читает `config.json`, добавляет UUID в `inbounds[0].settings.clients[]`
- Записывает файл, reload Xray: `pidof xray && kill -SIGHUP $(pidof xray) || systemctl restart xray`
- 200 OK / 400 invalid UUID / 409 already exists

### 2.4 — DELETE /users/:uuid

- Удаляет UUID из `clients[]`
- Записывает, reload Xray: `pidof xray && kill -SIGHUP $(pidof xray) || systemctl restart xray`
- 200 OK / 404 not found

### 2.5 — GET /stats

- Выполняет `xray api statsquery --server=127.0.0.1:10085 --reset`
- Парсит stdout → `{ users: { [uuid]: { up, down, online } } }`
- 200 + JSON

### 2.6 — POST /sync

- Тело: `{ "uuids": ["...", "..."] }`
- Полная перезапись `clients[]` в конфиге
- SIGHUP reload
- 200 OK

### 2.7 — Systemd Unit for VPS API

- `/etc/systemd/system/veilx-api.service`
- `EnvironmentFile=/etc/veilx-api.env`, `Restart=on-failure`
- `systemctl enable --now veilx-api`

**Выход:** `curl -k https://VPS_IP:8443/stats -H "Authorization: Bearer TOKEN"` → 200.

---

## Phase 3 — Vercel Postgres

> Параллельно с Phase 1-2.

### 3.1 — Create Postgres Instance

- Vercel Dashboard → Storage → Create Postgres
- Скопировать `DATABASE_URL` в env vars

### 3.2 — Create Tables

SQL для выполнения в Vercel Postgres console:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  token VARCHAR(16) UNIQUE NOT NULL,
  vless_uuid UUID UNIQUE NOT NULL,
  status VARCHAR(10) NOT NULL DEFAULT 'active',
  traffic_up BIGINT DEFAULT 0,
  traffic_down BIGINT DEFAULT 0,
  last_connected_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE login_attempts (
  ip VARCHAR(45) PRIMARY KEY,
  attempts INT DEFAULT 0,
  window_start TIMESTAMP DEFAULT NOW()
);

CREATE INDEX users_token_idx ON users (token);
CREATE INDEX users_vless_uuid_idx ON users (vless_uuid);

ALTER TABLE users ADD CONSTRAINT users_status_check CHECK (status IN ('active', 'disabled'));
```

> Seed data: не требуется. БД стартует пустой, пользователи создаются через админку.

### 3.3 — Set Env Vars on Vercel

- `DATABASE_URL`, `ADMIN_PASSWORD`, `JWT_SECRET`, `VPS_API_URL`, `VPS_API_TOKEN`
- `VPS_IP`, `REALITY_SNI`, `REALITY_PUBLIC_KEY`, `REALITY_SHORT_ID`, `CRON_SECRET`

**Выход:** `sql\`SELECT 1\`` возвращает результат из Next.js.

---

## Phase 4 — Next.js Lib + API Routes

> Зависимость: Phase 2 + Phase 3.

### 4.1 — src/lib/db.ts

- Импорт `sql` из `@vercel/postgres`
- Функции (все с параметризованными запросами):
  - `getAllUsers(): Promise<User[]>` — `ORDER BY created_at DESC` (новые сверху)
  - `getUserByToken(token: string): Promise<User | null>`
  - `getUserById(id: number): Promise<User | null>`
  - `createUser(name: string, token: string, uuid: string): Promise<User>`
  - `updateUserStatus(id: number, status: UserStatus): Promise<void>` — SET updated_at = NOW()
  - `deleteUser(id: number): Promise<void>`
  - `updateTrafficStats(uuid: string, up: number, down: number, online: boolean): Promise<void>`

**Выход:** все функции экспортированы, TS компилируется.

### 4.2 — src/lib/auth.ts

- `signJwt(): Promise<string>` — payload `{ role: 'admin' }`, 24h TTL, подпись `JWT_SECRET` через `jose`
- `verifyJwt(token: string): Promise<boolean>`
- `setAuthCookie(response): void` — `veilx-admin`, httpOnly, secure, sameSite=strict, maxAge=86400
- `getAuthFromCookies(): Promise<boolean>` — читает cookie, верифицирует JWT
- `verifyPassword(input: string): boolean` — `crypto.timingSafeEqual` с `ADMIN_PASSWORD`

**Выход:** JWT sign → verify round-trip работает.

### 4.3 — src/lib/rate-limiter.ts

- `checkRateLimit(ip: string): Promise<{ allowed: boolean; remaining: number }>`
  - Удаляет записи старше 15 мин (`DELETE FROM login_attempts WHERE window_start < NOW() - INTERVAL '15 minutes'`)
  - Проверяет/инкрементирует счётчик для IP
  - Лимит: 5 попыток / 15 мин
- `recordFailedAttempt(ip: string): Promise<void>`

**Выход:** после 5 вызовов `recordFailedAttempt` → `checkRateLimit` возвращает `allowed: false`.

### 4.4 — src/lib/vps-api-client.ts

- Base URL из `VPS_API_URL`, Bearer token из `VPS_API_TOKEN`
- `rejectUnauthorized: false` для self-signed cert (через Node.js `agent`)
- Таймаут 10 сек для мутаций, 30 сек для stats
- Функции:
  - `addUser(uuid: string): Promise<void>`
  - `removeUser(uuid: string): Promise<void>`
  - `getStats(): Promise<VpsStats>`
  - `syncUsers(uuids: string[]): Promise<void>`
- Все выбрасывают ошибку при fail, не retry
- Ошибки VPS API — единый формат: `{ error: string }` + HTTP-код (400/401/404/409/500). Клиент обрабатывает через `if (!res.ok) throw new Error(...)`.

**Выход:** TypeScript компилируется, типы экспортированы.

### 4.5 — src/lib/vless-link-builder.ts

- `buildVlessLink(uuid: string, name: string): string`
- Формат: `vless://{uuid}@{VPS_IP}:443?encryption=none&flow=xtls-rprx-vision&type=tcp&security=reality&sni={REALITY_SNI}&fp=chrome&pbk={REALITY_PUBLIC_KEY}&sid={REALITY_SHORT_ID}#{encodeURIComponent(name)}`
- Все параметры из `process.env` — вызывать только на сервере

**Выход:** вызов с тестовым UUID возвращает валидный vless:// URI.

### 4.6 — src/lib/format-traffic.ts

- `formatTraffic(bytes: number): string`
  - `< 1MB` → `0 МБ`
  - `1MB–1GB` → `X МБ`
  - `≥ 1GB` → `X.X ГБ`
- `formatTrafficPair(up: number, down: number): string` → `"150 МБ / 2.3 ГБ"`

**Выход:** unit test проходит.

### 4.7 — POST /api/admin/login

- Получить IP из `x-forwarded-for` / `x-real-ip`
- `checkRateLimit(ip)` → 429 если exceeded
- Сравнить пароль через `verifyPassword`
- Если неверный: `recordFailedAttempt(ip)` → 401 `{ error: "Неверный пароль" }`
- Если верный: `signJwt()` → `setAuthCookie()` → 200 `{ success: true, data: null }`

**Выход:** логин с верным паролем → cookie установлен.

### 4.8 — Auth Middleware Helper

- `requireAdmin(request): Promise<NextResponse | null>` — проверяет JWT cookie
- Возвращает `null` если ОК, `NextResponse 401` если нет
- Используется в начале каждого `/api/admin/*` handler (кроме login)

**Выход:** запросы без cookie к admin routes → 401.

### 4.9 — GET /api/admin/users

- `requireAdmin` check
- `getAllUsers()` → 200 `{ success: true, data: users }`

### 4.10 — POST /api/admin/users

- `requireAdmin` check
- Валидация: `name` обязателен, trim, max 50 chars
- Проверка лимита: `count(*) >= 20` → 400 `{ error: "Лимит 20 пользователей" }`
- Генерация: `token` через `BigInt('0x' + crypto.randomBytes(12).toString('hex')).toString(36).slice(0, 16)`, `uuid` (crypto.randomUUID)
- `createUser(name, token, uuid)` в БД
- `addUser(uuid)` к VPS API (try/catch — при fail инвайт всё равно создан, вернуть `warning: "Сервер временно недоступен, конфиг будет активирован при восстановлении связи"`)
- `console.log` действия для аудита (создание инвайта)
- 201 `{ success: true, data: { user, inviteUrl: "https://veilx.app/c/{token}" } }`

### 4.11 — PATCH /api/admin/users/[id]

- `requireAdmin` check
- Тело: `{ "status": "active" | "disabled" }`
- `updateUserStatus(id, status)` в БД
- Если `disabled`: `removeUser(uuid)` с VPS
- Если `active`: `addUser(uuid)` к VPS
- При VPS fail: статус в БД обновлён, вернуть `warning` в response
- `console.log` действия для аудита (вкл/выкл)
- 200 `{ success: true, data: updatedUser }`

### 4.12 — DELETE /api/admin/users/[id]

- `requireAdmin` check
- Получить user из БД (для uuid)
- `removeUser(uuid)` с VPS (try/catch)
- `deleteUser(id)` из БД
- `console.log` действия для аудита (удаление)
- 200 `{ success: true, data: null }`

### 4.13 — POST /api/admin/sync

- `requireAdmin` check
- Получить все active users из БД
- `syncUsers(activeUuids)` к VPS
- 200 `{ success: true, data: { synced: count } }`

### 4.14 — GET /api/config/[token]

- БЕЗ auth — публичный endpoint
- **Валидация token**: regex `/^[a-z0-9]{1,16}$/` — если не совпадает → 404 сразу (без запроса в БД)
- `getUserByToken(token)` → 404 если нет
- Если `status === 'disabled'` → 200 `{ success: true, data: { status: 'disabled', name } }`
- Если `active`: `buildVlessLink(uuid, name)` → 200 `{ success: true, data: { status: 'active', name, vlessLink } }`

### 4.15 — GET /api/cron/stats

- Проверить `Authorization: Bearer {CRON_SECRET}` → 401 если нет
- `getStats()` с VPS
- Для каждого user в stats: `updateTrafficStats(uuid, up, down, online)`
- 200 `{ success: true, data: { updated: count } }`

**Выход Phase 4:** все API routes отвечают корректно через curl/Postman.

---

## Phase 5 — Frontend

> Зависимость: Phase 4.

### 5.0 — Общие правила адаптивности (применять ко ВСЕМ UI-чанкам)

Брейкпоинты (DESIGN_SYSTEM.md §5): `sm: 640px`, `md: 768px`, `lg: 1024px`. Mobile-first.

- **Container**: max-width `1024px`, padding `16px` (mobile) / `24px` (md+)
- **Narrow container** (формы, конфиг-страница): max-width `640px`
- **Кнопки**: на mobile — `width: 100%` (`.btn--full`), на md+ — auto width
- **Модалки**: на mobile — full-screen (width 100%, height auto, border-radius 0 top), на md+ — centered max-w 400px
- **Таблицы**: `overflow-x-auto` wrapper на mobile
- **Формы**: всегда single-column (простой проект, перестроение не нужно)
- **Общий паттерн ошибки сети на клиенте**: при `fetch` fail (network error, timeout, не-ok status) — показать toast `«Ошибка сети. Попробуй ещё раз.»` через `showError()`. Кнопки разблокируются, спиннеры скрываются.
- **Session expiry mid-action**: если любой `/api/admin/*` вернул 401 — показать toast `«Сессия истекла»`, установить `isLoggedIn = false`, показать форму логина. Не терять введённые данные в форме создания инвайта.

### 5.1 — RootLayout + Favicon

- `src/app/layout.tsx`:
  - `<html lang="ru" className="dark">`
  - Inter font (next/font/google)
  - Body: `bg-[var(--color-bg)] text-[var(--color-text)]`
  - Meta: title, robots noindex
- Favicon: shield SVG (simple outlined shield icon, `--color-accent` #6366f1 fill, transparent bg) + PNG 32x32 fallback в `public/`. Генерируется inline SVG → конвертируется в файлы.

### 5.2 — Reusable Components: Button, Card

- `src/components/button.tsx`:
  - Variants: primary (`--color-accent`), secondary (transparent + border), danger (`--color-error`), success (`--color-success`, transient)
  - States: default, hover (lighten bg — `--color-accent-hover` для primary), active (darken), disabled (opacity 0.5, cursor not-allowed), loading (`.spinner` inline + text, pointer-events none)
  - Transition: `background-color 150ms ease, opacity 150ms ease`
  - Modifier: `btn--full` (width 100%)
- `src/components/card.tsx`:
  - Surface bg, border, radius, padding
  - Variants: muted, center

### 5.3 — Reusable Components: Toast System

- `src/components/toast.tsx` + `src/components/toast-provider.tsx`:
  - Position: fixed bottom-right (desktop), fixed bottom-center (mobile <md, width calc(100% - 32px))
  - Auto-dismiss 3 сек. Transition: slide-in справа (200ms), fade-out (150ms)
  - Variants: `toast--success` (left border `--color-success`), `toast--error` (left border `--color-error`)
  - BG: `--color-surface`, border `--color-border`, padding `--space-sm --space-md`
  - Context + hook: `useToast()` → `{ showSuccess(msg), showError(msg) }`
  - Accessibility: контейнер с `aria-live="polite"`, `role="status"`

### 5.4 — Reusable Components: Modal, Badge, Spinner

- `src/components/modal.tsx`:
  - Overlay: fixed inset-0, `rgba(0,0,0,0.6)`, `backdrop-blur: 4px`
  - Content: `--color-surface`, `--radius-md`, padding `--space-lg`
  - Desktop (md+): centered, max-w 400px
  - Mobile (<md): прижат к низу экрана (bottom-sheet), width 100%, border-radius только сверху (`--radius-md --radius-md 0 0`)
  - Keyboard: Esc to close, focus trap
  - Transition: fade-in overlay (150ms), slide-up content (200ms ease-out)
- `src/components/badge.tsx`:
  - active (green dot + text), disabled (gray dot + text)
- `src/components/spinner.tsx`:
  - 16x16 border spinner, accent color, inline
  - SVG/icons: `aria-hidden="true"` на декоративных, `aria-label` на смысловых

### 5.5 — Reusable Components: Copy Button

- `src/components/copy-button.tsx`:
  - Clipboard API: `navigator.clipboard.writeText(text)`
  - State: default → "Скопировано ✓" (2 сек) → default
  - Props: `text: string`, `label?: string`

### 5.6 — Reusable Components: QR Code Display

- `src/components/qr-code-display.tsx`:
  - `qrcode.react` QRCodeSVG, 280x280, error correction M
  - Чёрный на белом (контраст для сканирования)
  - Props: `value: string`

### 5.7 — Landing Page (/)

- `src/app/page.tsx` — статическая, server component
- Hero: заголовок `page__title` (2rem/700), подзаголовок `page__subtitle` (1.125rem/400, `--color-text-muted`)
  - Текст: «VeilX — приватный VPN для своих»
- «Как это работает»: 3 карточки (`.card`), заголовки `card__title` (1.25rem/600)
  - Desktop (lg+): 3 колонки в ряд (`grid grid-cols-3 gap-lg`)
  - Tablet (md): 3 колонки (контейнер 1024px хватает)
  - Mobile (<md): 1 колонка, карточки стопкой
- «Преимущества»: 3 карточки, аналогичная сетка
- CTA: `.btn--primary`, на mobile `.btn--full`
- Footer: текст `small` (0.875rem/400, `--color-text-muted`), padding `--space-2xl`
- Секции разделены `--space-3xl` (64px)

### 5.8 — Setup Page (/setup)

- `src/app/setup/page.tsx` — статическая, narrow container (640px)
- Заголовок: `page__title`, подзаголовок `page__subtitle` (`--color-text-muted`)
- Табы (`.tabs`): iOS, Android, Windows, macOS (ARIA: role="tablist/tab/tabpanel")
  - Стили: DESIGN_SYSTEM.md §6.4 — flex row, active tab `--color-accent` + border-bottom 2px
  - Mobile (<sm): табы скроллятся горизонтально (`overflow-x-auto`, `white-space: nowrap`), без переноса
- Контент каждого таба:
  - Название клиента: `card__title` (1.25rem/600)
  - Ссылка: `--color-accent`, hover `--color-accent-hover`
  - Пошаговая инструкция: нумерованный список, body text (1rem/400)
- Блок «Не работает?»: `.card--muted`, заголовок `card__title`
- Таб-компонент: `src/components/tabs.tsx` (client component)

### 5.9 — Config Page (/c/[token]) — SSR

- `src/app/c/[token]/page.tsx` — server component (SSR), narrow container (640px)
- Fetch `getUserByToken(token)` напрямую из lib/db (server-side, без loading state — SSR отдаёт готовый HTML)
- **Состояние active:**
  - Приветствие: `page__title` (2rem/700) — «Привет, {name}!»
  - `.card` с padding `--space-lg`:
    - VLESS-ссылка: `font-family: monospace`, `--color-text-muted`, маскирована `•••`, toggle `.btn--secondary` показать/скрыть
    - Copy button: `.btn--primary`, feedback «Скопировано ✓» 2 сек (`.btn--success` transient)
    - QR-код (280x280): в `.card--center`, чёрный на белом
  - Ссылка «Как подключиться?» → `/setup`, `--color-accent`
- **Состояние disabled:** `.card--muted`, `.card--center`, текст `page__subtitle` — «Твой доступ приостановлен. Свяжись с админом.»
- **Состояние 404:** `notFound()` → стандартная Next.js 404
- **Адаптивность**: narrow container центрирован, QR-код всегда 280px (помещается на любом экране ≥320px), padding уменьшается на mobile (16px)
- Client-часть: `src/components/config-panel.tsx` (`'use client'`) — toggle, copy, QR

### 5.10 — Admin: Login Form

- `src/app/admin/page.tsx` — `'use client'`, narrow container (640px для формы логина, full-width container для панели)
- Состояние: `isLoggedIn` (проверка при mount через GET /api/admin/users)
- **Initial loading**: при mount — спиннер (`.spinner`) по центру, пока проверяется сессия
- Login form (стили input: DESIGN_SYSTEM.md §6.5 — surface bg, border, radius-sm, focus border accent):
  - Password input (`.form-input`) + submit button (`.btn--primary .btn--full`)
  - Кнопка «Войти»: disabled + спиннер во время запроса (предотвращает double-click)
  - POST /api/admin/login
  - Ошибка: `--color-error` текст «Неверный пароль» под полем
  - Rate limit: `--color-error` текст «Слишком много попыток»
  - Успех: `setIsLoggedIn(true)`
- Expired session: при 401 от любого `/api/admin/*` — toast «Сессия истекла», `setIsLoggedIn(false)`, показать форму логина (см. 5.0)
- **Адаптивность**: форма логина центрирована, narrow container, padding `--space-lg`. На всех экранах одинаковая.

### 5.11 — Admin: Create Invite Form

- Часть admin page (показывается когда `isLoggedIn`)
- Input «Имя» (max 50, trim), кнопка «Создать» (disabled пока пусто/loading, spinner во время запроса)
- POST /api/admin/users → очистить input, показать inline-блок с ссылкой + copy button. Блок исчезает при создании следующего инвайта. **После успеха — refetch списка users** (`GET /api/admin/users`) для обновления таблицы.
- Скрыто при `users.length >= 20`: текст «Достигнут лимит в 20 пользователей. Удали неактивных, чтобы создать новых.»

### 5.12 — Admin: User Table

- `src/components/admin-user-table.tsx` — client component
- Стили таблицы: DESIGN_SYSTEM.md §6.6 — full-width, border-collapse, rows border-bottom `--color-border`
- Столбцы: Имя | Статус | Трафик (↑/↓) | Последнее подключение | Действия
- Badge для статуса: DESIGN_SYSTEM.md §6.3 — `badge--active` (green dot) / `badge--disabled` (gray dot)
- Traffic: `formatTrafficPair()`, body text (1rem)
- Дата: `DD.MM.YYYY HH:mm` UTC+3, small text (0.875rem, `--color-text-muted`), или «Никогда»
- Заголовки таблицы: uppercase, font-weight 500, small (0.875rem), `--color-text-muted`
- **Loading state**: skeleton (DESIGN_SYSTEM.md §6.10) — `skeleton--text` (60% width), `skeleton--badge` (48px), `skeleton--actions` (120px), animated pulse, 5 строк-заглушек
- **Error state**: при ошибке загрузки — `.alert--warning` banner (DESIGN_SYSTEM.md §6.9): «Не удалось загрузить данные. Попробуй обновить страницу.»
- Empty state: `.card--muted .card--center` — «Пока никого нет. Создай первый инвайт.»
- **Адаптивность**:
  - Desktop (md+): таблица full-width в container (1024px)
  - Mobile (<md): `.table-wrap` с `overflow-x-auto`, min-width таблицы ~600px для скролла
  - Кнопки действий: сохраняют inline-расположение (не стопкой), скроллятся вместе с таблицей

### 5.13 — Admin: User Actions

- В каждой строке таблицы:
  - «Скопировать ссылку» → `copy-button` с `veilx.app/c/{token}`
  - «Отключить»/«Включить» → PATCH /api/admin/users/[id], spinner на кнопке, остальные кнопки строки disabled на время запроса. **После успеха — refetch списка users** для обновления таблицы.
  - «Удалить» → открыть Modal: «Точно удалить {name}? Это действие необратимо.», кнопки «Удалить» (danger/красная) + «Отмена» → DELETE /api/admin/users/[id]. **После успеха — refetch списка users.**
- Toast при успехе/ошибке

### 5.14 — Admin: Sync Button + VPS Error Banner

- Кнопка «Синхронизировать с сервером»: `.btn--secondary`, POST /api/admin/sync, spinner + disabled во время запроса, toast при успехе/ошибке. **После успеха — refetch списка users.**
- Alert banner (DESIGN_SYSTEM.md §6.9): `.alert--warning` — bg `--color-warning` 10% opacity, text `--color-warning`, padding `--space-sm --space-md`
  - Текст: «⚠ Не удалось получить статистику с сервера. Данные о трафике могут быть неактуальны.»
  - Показывается при ошибке от VPS (stats fail или network error)
  - Не блокирует UI, dismissable нет (исчезает при успешной перезагрузке)

### 5.15 — 404 Page

- `src/app/not-found.tsx`
- «Страница не найдена» (русский текст), ссылка на главную

**Выход Phase 5:** все страницы работают в браузере, user flows проходят E2E.

---

## Phase 6 — Cron & Stats

> Зависимость: Phase 4.

### 6.1 — Implement Cron Stats Endpoint

- Логика уже в 4.15, здесь — интеграционная проверка
- Ручной вызов: `curl /api/cron/stats -H "Authorization: Bearer {CRON_SECRET}"`
- Проверить что traffic_up/down инкрементируются в БД
- Проверить что last_connected_at обновляется для online users

### 6.2 — Verify vercel.json Cron

- `vercel.json` уже из 0.6
- Deploy на Vercel → проверить что cron зарегистрирован в Dashboard
- Проверить логи после первого срабатывания

**Выход:** статистика автоматически собирается раз в сутки.

---

## Phase 7 — Deploy & Harden

### 7.1 — Vercel Production Deploy

- Подключить GitHub repo к Vercel
- Настроить env vars (все из Phase 3.3)
- Custom domain: `veilx.app`
- Проверить: `/` рендерится, `/admin` login работает

### 7.2 — VPS Systemd Verification

- `systemctl status xray` — active
- `systemctl status veilx-api` — active
- Тест: создать user через admin → подключиться через VPN клиент

### 7.3 — E2E Smoke Test

- [ ] Открыть `/` → лендинг отображается
- [ ] Открыть `/setup` → табы работают
- [ ] Логин в `/admin` → панель отображается
- [ ] Создать инвайт → ссылка генерируется
- [ ] Открыть `/c/{token}` → конфиг + QR отображаются
- [ ] Скопировать vless:// → подключиться через клиент
- [ ] Отключить user → страница показывает «приостановлен»
- [ ] Удалить user → 404
- [ ] Sync → toast «Синхронизировано»
- [ ] Дождаться cron → трафик обновился

### 7.4 — Security Checklist

- [ ] `.env` не в git (`.gitignore`)
- [ ] Нет секретов в client bundle (`npm run build` + grep в .next/static)
- [ ] `robots: noindex,nofollow` на всех страницах
- [ ] Rate limiting работает (6-й логин → 429)
- [ ] JWT httpOnly, secure, sameSite=strict
- [ ] VPS API: bearer token + HTTPS
- [ ] Parameterized SQL queries (нет string concatenation)

**Выход:** production-ready сервис на veilx.app.

---

## Summary

| Phase | Chunks | Depends On | Scope |
|-------|--------|------------|-------|
| 0 | 0.1–0.6 | — | Scaffold, deps, config |
| 1 | 1.1–1.4 | — | VPS Xray (manual) |
| 2 | 2.1–2.7 | Phase 1 | VPS API (manual) |
| 3 | 3.1–3.3 | — | Vercel Postgres |
| 4 | 4.1–4.15 | Phase 2+3 | Lib + API routes |
| 5 | 5.0–5.15 | Phase 4 | Frontend pages (16 chunks) |
| 6 | 6.1–6.2 | Phase 4 | Cron integration (‖ Phase 5) |
| 7 | 7.1–7.4 | Phase 5+6 | Deploy + verify |
| **Total** | **57 chunks** | | |

```
Phase 0 ──→ ┬── Phase 1 → Phase 2 ──┐
             └── Phase 3 ────────────┤
                                     └──→ Phase 4 → Phase 5 → Phase 7
                                                  → Phase 6 ──↗
```
