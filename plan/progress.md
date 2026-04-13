# VeilX — Progress

| Phase | Name | Status |
|-------|------|--------|
| 0 | Scaffold & Config | DONE |
| 1 | VPS: Xray Setup (manual) | DONE |
| 2 | VPS API (Express.js) | DONE |
| 3 | Vercel Postgres | DONE |
| 4 | Next.js API Routes | DONE |
| 5 | Frontend | DONE |
| 6 | Cron Stats | DONE |
| 7 | Deploy | DONE |

## Phase 0 — Completed

Scaffold, tokens, deps, stubs, ESLint, vitest, vercel.json.

Review bugs fixed (2026-04-12):
- BUG-1: Removed duplicate `font-family` from globals.css — next/font only
- BUG-2: Added `--passWithNoTests` to vitest — CI exit 0
- BUG-3: `lint` script set to `eslint .` (Next 16 dropped `next lint`)
- BUG-4: Added style rules (quotes/semi/comma-dangle) to ESLint config
- BUG-5: Registered all design tokens in `@theme inline` block
- BUG-6: Added `export {}` to all lib stubs

## Phase 3 — Completed

Vercel Postgres layer: migration, db queries, rate limiter.

Files:
- `sql/001-create-tables.sql` — users + login_attempts tables
- `src/lib/db.ts` — 9 query functions (CRUD, traffic stats, active UUIDs)
- `src/lib/rate-limiter.ts` — Postgres-backed login rate limiting (5/15min)
- `src/lib/types.ts` — added LoginAttempt type

Review fixes (2026-04-12):
- FIX-1: Parse PG bigint→number for traffic_up/traffic_down in parseUser()
- FIX-2: Fixed misleading "one round-trip" comment in rate-limiter.ts
- FIX-3: Convert PG timestamp (Date)→ISO string in parseUser() for created_at/updated_at/last_connected_at
- FIX-4: Named indexes per spec (users_token_idx, users_vless_uuid_idx) — removed UNIQUE from columns, added explicit CREATE UNIQUE INDEX

Manual step: create Vercel Postgres instance + run sql/001-create-tables.sql

## Phase 4 — Completed

Lib modules + all API routes.

Files:
- `src/lib/auth.ts` — JWT sign/verify (jose), httpOnly cookie, verifyPassword (timingSafeEqual), requireAdmin middleware
- `src/lib/vps-api-client.ts` — node:https wrapper, rejectUnauthorized:false, 10s/30s timeouts
- `src/lib/vless-link-builder.ts` — buildVlessLink() from env vars
- `src/lib/format-traffic.ts` — formatTraffic/formatTrafficPair (МБ/ГБ)
- `src/lib/format-traffic.test.ts` — 5 unit tests
- `src/app/api/admin/login/route.ts` — POST: rate limit + password + JWT cookie
- `src/app/api/admin/users/route.ts` — GET: list, POST: create invite (DB+VPS)
- `src/app/api/admin/users/[id]/route.ts` — PATCH: toggle status, DELETE: remove user
- `src/app/api/admin/sync/route.ts` — POST: full UUID sync to VPS
- `src/app/api/config/[token]/route.ts` — GET: public config (vless link)
- `src/app/api/cron/stats/route.ts` — GET: cron stats collection (CRON_SECRET auth)

Review bugs fixed (2026-04-12):
- BUG-1: Token generation padStart(16,'0') — prevent <16 char tokens
- BUG-2: requireAdmin() moved inside try/catch in all admin routes
- BUG-3: PATCH response returns updatedUser directly as data (not wrapped)
- BUG-4: verifyPassword throws if ADMIN_PASSWORD env unset
- BUG-5: verifyCronSecret timing-safe padding (consistent with verifyPassword)
- BUG-6: Regex {16} kept — correct after BUG-1 padStart fix

## Phase 5 — Completed

Full frontend: reusable components, all pages, admin panel.

Components (src/components/):
- `button.tsx` — 4 variants (primary/secondary/danger/success), loading/disabled/full
- `card.tsx` — muted/center modifiers
- `toast-provider.tsx` — context + useToast(), auto-dismiss 3s, slide-in/fade-out
- `modal.tsx` — overlay+blur, bottom-sheet mobile, Esc+focus trap, slideUp animation
- `badge.tsx` — active (green dot) / disabled (gray)
- `spinner.tsx` — 16x16 border spinner
- `copy-button.tsx` — clipboard API, "Скопировано ✓" 2s feedback
- `qr-code-display.tsx` — QRCodeSVG 280x280, level M
- `config-panel.tsx` — toggle/copy/QR for vless link
- `tabs.tsx` — ARIA tablist/tab/tabpanel

Pages:
- `src/app/page.tsx` — landing: hero + 3 "how it works" + 3 "features" + CTA + footer
- `src/app/setup/page.tsx` + `setup-tabs.tsx` — tabs (iOS/Android/Windows/macOS)
- `src/app/c/[token]/page.tsx` — SSR config: active/disabled/404 states
- `src/app/admin/page.tsx` — session check, login/dashboard switch
- `src/app/admin/admin-login-form.tsx` — password + error + rate limit display
- `src/app/admin/admin-dashboard.tsx` — orchestrator: invite + table + sync + VPS error banner
- `src/app/admin/admin-invite-form.tsx` — create invite, controlled name (survives session expiry)
- `src/app/admin/admin-user-table.tsx` — skeleton loading, error banner, actions, delete modal
- `src/app/admin/admin-sync-button.tsx` — sync to VPS
- `src/app/not-found.tsx` — 404 Russian

Lib:
- `src/lib/admin-api.ts` — fetch wrapper, SESSION_EXPIRED detection, res.ok guard

Assets:
- `public/favicon.svg` — shield icon
- `public/favicon.png` — 32x32 PNG fallback

Review bugs fixed (2026-04-12):
- BUG-1: Added 5-row loading skeleton with pulse animation to user table
- BUG-2: Added alert--warning error banner to user table
- BUG-3: Added VPS error alert banner to admin dashboard
- BUG-4: Lifted invite name state to page level — preserved on session expiry
- BUG-5: Generated favicon.png 32x32 + added to metadata
- BUG-6: Toast slide-in entrance animation via entering→visible phase
- BUG-7: Modal slideUp + fadeIn keyframe animations in globals.css
- BUG-8: Toggle labels "Откл"/"Вкл" → "Отключить"/"Включить"
- BUG-9: Delete modal "Удалить?" → "Точно удалить?"
- BUG-10: Added bg-[var(--color-bg)] text-[var(--color-text)] to body
- BUG-11: Added res.ok check before .json() in adminFetch
- BUG-12: Column header "Подключение" → "Последнее подключение"

Post-review fixes (2026-04-12):
- FIX-1 [CRITICAL]: Wired `setVpsError(true)` — `onVpsWarning` callback propagated from invite form when VPS returns warning
- FIX-2 [CRITICAL]: Added `res.ok` guard to `login()` in admin-api.ts — prevents crash on non-JSON error responses (429/500)
- FIX-3 [MEDIUM]: `withAction()` now only calls `onRefresh()` on success — `fn()` returns boolean, false skips refetch
- FIX-4 [MEDIUM]: QR code wrapped in `<Card center>` per spec §5.9

## Phase 6 — Completed

Cron stats integration verification.

Files:
- `src/app/api/cron/stats/route.ts` — verified: auth (timingSafeEqual), getStats→updateTrafficStats pipeline, 502 on VPS/DB failure
- `src/app/api/cron/stats/route.test.ts` — 7 unit tests: auth reject (no header, wrong token, empty bearer), success path with stats update, empty stats, VPS fail→502, DB fail→502
- `vercel.json` — verified: cron `0 3 * * *` (daily 03:00 UTC), path matches route
- `src/lib/db.ts` updateTrafficStats — verified: incremental traffic (+=), conditional last_connected_at (online only)

Review fixes (2026-04-13):
- BUG-1 [MEDIUM]: Wrapped updateTrafficStats in DB transaction (BEGIN/COMMIT/ROLLBACK) via `db.connect()` — prevents permanent traffic data loss on partial DB failure after VPS `--reset`
- BUG-2 [LOW]: `data.updated` now returns actual DB rowCount, not VPS entry count — `updateTrafficStats` returns `number`

All 12 tests pass, lint clean, build OK.

## Phase 7 — Deploy & Harden

Build verification, security audit, review bug fixes.

7.1 — Production build:
- `npm run build` passes, all 10 routes present (4 static, 6 dynamic)

7.4 — Security checklist:
- [x] `.env` in `.gitignore` (`.env`, `.env.local`, `.env.production`, `.env.*.local`)
- [x] No secrets in client bundle (grep `.next/static/` — zero matches for all secret env vars)
- [x] `robots: noindex,nofollow` in root layout metadata
- [x] Rate limiting: 5 attempts / 15 min, Postgres-backed (`rate-limiter.ts`)
- [x] JWT cookie: httpOnly, secure (prod), sameSite=strict, 24h TTL (`auth.ts:35-41`)
- [x] VPS API: Bearer token + HTTPS, `rejectUnauthorized: false` for self-signed cert
- [x] Parameterized SQL: 13 tagged template calls, zero string concatenation

Remaining manual steps (7.1–7.3):
- Connect GitHub repo to Vercel, set env vars, custom domain `veilx.app`
- VPS: `systemctl status xray`, `systemctl status veilx-api`
- E2E smoke test (10-item checklist in devplan §7.3)

Review fixes (2026-04-13):
- BUG-0 [LOW]: Token regex in `c/[token]/page.tsx` changed `{1,16}` → `{16}` — consistent with API route
- BUG-1 [CRITICAL]: `admin-api.ts` login() — parse 429 JSON body instead of generic error. User now sees "Слишком много попыток. Подожди 15 минут."
- BUG-2 [CRITICAL]: Toggle status now checks `res.data.warning`, shows error toast + triggers VPS warning banner. PATCH route moves `warning` inside `data` (consistent with POST). `AdminUserTable` receives `onVpsWarning` prop.
- BUG-3 [MEDIUM]: `vless-link-builder.ts` — `requireEnv()` throws on missing VPS_IP/REALITY_SNI/REALITY_PUBLIC_KEY/REALITY_SHORT_ID. No more silent `undefined` in vless links.
- BUG-4 [MEDIUM]: `vps-api-client.ts` — explicit guard on VPS_API_URL and VPS_API_TOKEN. Clear error message instead of opaque TypeError.
- BUG-5 [MEDIUM]: `users.status` column — added `CHECK (status IN ('active', 'disabled'))` to 001 migration + new `sql/002-add-status-check-constraint.sql` for existing DBs.

Lint clean, 12 tests pass, build OK.

## Phase 2 — Completed

VPS API (Express.js) — local code, deploy to `/opt/veilx-api` on VPS.

Files (vps-api/):
- `package.json` — express dependency, node >=20
- `auth-bearer-middleware.js` — Bearer token validation via crypto.timingSafeEqual
- `xray-config-manager.js` — read/write Xray config.json, add/remove/sync users, SIGHUP reload
- `xray-stats-collector.js` — `xray api statsquery --reset` parser, per-user up/down/online
- `server.js` — HTTPS Express server, 4 routes (POST/DELETE /users, GET /stats, POST /sync)
- `veilx-api.service` — systemd unit (After=xray.service, Restart=on-failure)
- `veilx-api.env.example` — env template (API_PORT, API_TOKEN, XRAY_CONFIG_PATH, TLS certs)

Other:
- `eslint.config.mjs` — added `vps-api/**` to globalIgnores

API contract matches `src/lib/vps-api-client.ts`:
- POST /users `{ uuid }` → `{ ok, added, warning? }` / 400 / 409
- DELETE /users/:uuid → `{ ok, removed, warning? }` / 400 / 404
- GET /stats → `{ ok, users: { [uuid]: { up, down, online } } }` / 502
- POST /sync `{ uuids }` → `{ ok, synced, warning? }` / 400

Deployment steps:
1. Copy `vps-api/` to `/opt/veilx-api/` on VPS
2. `npm install --production`
3. Generate self-signed cert: `openssl req -x509 -newkey ec -pkeyopt ec_paramgen_curve:prime256v1 -nodes -keyout key.pem -out cert.pem -days 3650 -subj "/CN=veilx-api"`
4. Copy `veilx-api.env.example` → `/etc/veilx-api.env`, fill values
5. Copy `veilx-api.service` → `/etc/systemd/system/`, `systemctl enable --now veilx-api`

Review fixes (2026-04-13):
- FIX-1 [CRITICAL]: timingSafeEqual — pad both buffers to equal length before comparison, check real length AFTER to prevent length-leak timing side-channel
- FIX-2 [CRITICAL]: reloadXray — replaced `execSync` template literal with `execFileSync` argv array, PID validated as numeric — no shell injection
- FIX-3 [HIGH]: writeConfig — atomic via tmp file + `renameSync` (crash-safe on same filesystem), cleanup on failure
- FIX-4 [HIGH]: getClients — optional chaining + Array.isArray guard, throws 500 with safe message on malformed config
- FIX-5 [HIGH]: Error messages — `safeErrorMessage()` in server.js: <500 errors expose message, >=500 return generic "Internal server error". Stats/config errors logged server-side only
- FIX-6 [MEDIUM]: readConfig — try/catch wraps ENOENT/EACCES, logs real error, throws sanitized 500
- FIX-7 [LOW]: systemd `StartLimitIntervalSec=60` added, env.example `API_TOKEN` entropy guidance comment

Post-review fixes (2026-04-13):
- BUG-1 [HIGH]: `reloadXray` now throws 503 on failure. Callers use `tryReload()` — config saved, `warning` field added to response if reload fails. Matches Next.js-side VPS warning pattern.
- BUG-2 [MEDIUM]: `safeErrorMessage` — all errors with explicit `statusCode` pass message through (already sanitized). Only unexpected throws (no `statusCode`) get generic fallback.
- BUG-3 [LOW]: `xray-stats-collector.js` — `execSync` → `execFileSync` with argv array, consistent with hardened `xray-config-manager.js`.

Lint clean, build OK, syntax check passes (node -c). Phase DONE.

## Phase 1 — VPS: Xray Setup (template + script)

Manual phase — runs on VPS via SSH.

Files generated:
- `vps-api/xray-config-template-vless-reality-stats.json` — Xray config template (VLESS+Reality :443, Stats API :10085, empty clients[], policy for per-user traffic stats)
- `vps-api/vps-setup-xray-phase1.sh` — automated setup script (apt, UFW, Xray download, keygen, config write, systemd)

Template verified against VPS API code:
- `inbounds[0].settings.clients` — matches `xray-config-manager.js` getClients()
- `api-inbound` port 10085 — matches `xray-stats-collector.js` `--server=127.0.0.1:10085`
- `statsUserUplink/Downlink` enabled in policy — required for per-user traffic collection
- Bittorrent blocked in routing rules

Usage:
```
scp vps-api/vps-setup-xray-phase1.sh vps-api/xray-config-template-vless-reality-stats.json root@VPS_IP:/tmp/
ssh root@VPS_IP 'bash /tmp/vps-setup-xray-phase1.sh'
```

Script outputs REALITY_PUBLIC_KEY, REALITY_SHORT_ID, REALITY_SNI — add to Vercel env vars.

Review fixes (2026-04-13):
- BUG-1 [HIGH]: `apt upgrade -y` → `DEBIAN_FRONTEND=noninteractive NEEDRESTART_MODE=a apt-get upgrade -y --force-confdef/confold` — prevents hang on needrestart/dpkg prompts (Ubuntu 22.04+)
- BUG-2 [MEDIUM]: Added SHA256 checksum verification — downloads `.dgst` file, compares `SHA2-256` hash before extraction
- BUG-3 [MEDIUM]: Added `chmod 600 "$XRAY_CONFIG"` — Reality private key no longer world-readable
