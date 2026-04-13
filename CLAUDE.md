# VeilX — Claude Code Instructions

## Current Phase

<!-- UPDATE after completing each phase. This is the first thing every session reads. -->
**Phase 0 — DONE.** Scaffolded Next.js 15, Tailwind v4, design tokens, deps, stubs, ESLint, vercel.json. Next: Phase 3 (Vercel Postgres) or Phase 1 (VPS Xray — manual).

## What Is This

Private VPN service (VLESS + Reality) for ~20 users (family & friends). Admin creates invite links, users get personal config pages with QR codes at `veilx.app/c/{token}`.

## Stack

- **Next.js 15** (App Router), **TypeScript** strict, **Tailwind CSS v4**
- **Vercel** hosting + **Vercel Postgres** (raw SQL via `@vercel/postgres`, no ORM)
- **Vultr VPS** (Stockholm) — Xray-core (VLESS+Reality :443) + Express.js API (:8443)
- **Domain**: veilx.app
- **Theme**: dark only (`#0a0a0a` bg), no light mode, no toggle
- **Language**: Russian UI, all user-facing text in Russian
- **Protocol**: VLESS + Reality (`xtls-rprx-vision`)

## Key Docs

Read these before any implementation work:

| Doc | Content |
|-----|---------|
| `plan/project.md` | Full product spec — screens, flows, auth, data model |
| `DESIGN_SYSTEM.md` | Color tokens, typography, components, layout rules |
| `docs/system-architecture-veilx-components-and-data-flow.md` | Architecture diagram, data flows, API contracts |
| `docs/code-standards-nextjs-typescript-tailwind.md` | TypeScript/Next.js/Tailwind conventions |
| `docs/project-overview-pdr-veilx-private-vpn-service.md` | Condensed spec for quick onboarding |
| `docs/agent-handoff-protocol-subagent-context-and-delegation-rules.md` | Subagent delegation rules and context passing |
| `.env.example` | All required env vars with placeholder values |

> `DESIGN_SYSTEM.md` lives in repo root. All other docs live in `docs/`.

## Architecture

```
Browser ──→ Vercel (Next.js 15)
              ├── Static: /, /setup
              ├── SSR: /c/[token]
              ├── CSR: /admin (JWT cookie auth)
              ├── API: /api/admin/*, /api/config/*, /api/cron/*
              └── Vercel Postgres (users, login_attempts)
                        │
              API routes ──HTTPS──→ VPS API (:8443, Express.js, self-signed TLS)
                                      └── Xray-core (VLESS+Reality :443)
```

## Directory Structure

> **Target layout** — not yet created. Will be scaffolded in Phase 0.

```
src/
├── app/
│   ├── page.tsx                    # Landing /
│   ├── setup/page.tsx              # Setup instructions /setup
│   ├── c/[token]/page.tsx          # Personal config (SSR)
│   ├── admin/page.tsx              # Admin panel (CSR)
│   └── api/
│       ├── admin/login/route.ts
│       ├── admin/users/route.ts    # GET (list), POST (create invite)
│       ├── admin/users/[id]/route.ts  # PATCH (toggle), DELETE
│       ├── admin/sync/route.ts     # POST (sync UUIDs to VPS)
│       ├── config/[token]/route.ts # GET (public config)
│       └── cron/stats/route.ts     # GET (daily stats, CRON_SECRET)
├── components/                     # qr-code-display, copy-button, admin-user-table, etc.
└── lib/
    ├── db.ts                       # Vercel Postgres queries
    ├── auth.ts                     # JWT sign/verify, cookie helpers
    ├── vps-api-client.ts           # Fetch wrapper for VPS API
    ├── vless-link-builder.ts       # Build vless:// URIs server-side
    ├── rate-limiter.ts             # Login rate limiting (Postgres-backed)
    └── format-traffic.ts           # Bytes → human readable
```

## Database

**users**: id (serial PK), name (varchar 50), token (varchar 16 unique), vless_uuid (uuid unique), status ('active'|'disabled'), traffic_up/traffic_down (bigint), last_connected_at (timestamp null), created_at, updated_at

**login_attempts**: ip (varchar 45 PK), attempts (int), window_start (timestamp). Self-cleaning: delete rows older than 15 min.

## API Routes

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | `/api/admin/login` | Password | Admin login → set JWT cookie |
| GET | `/api/admin/users` | JWT | List all users |
| POST | `/api/admin/users` | JWT | Create invite (DB + VPS) |
| PATCH | `/api/admin/users/[id]` | JWT | Enable/disable user |
| DELETE | `/api/admin/users/[id]` | JWT | Delete user (DB + VPS) |
| POST | `/api/admin/sync` | JWT | Sync all active UUIDs to VPS |
| GET | `/api/config/[token]` | None | Get user config (public) |
| GET | `/api/cron/stats` | CRON_SECRET | Daily stats collection |

## VPS API (Express.js :8443)

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/users` | Add UUID to Xray config, reload via SIGHUP |
| DELETE | `/users/:uuid` | Remove UUID from Xray config |
| GET | `/stats` | Traffic stats (resets Xray counters) |
| POST | `/sync` | Full rewrite of Xray clients[] array |

Auth: `Authorization: Bearer {VPS_API_TOKEN}`, validated via `crypto.timingSafeEqual`.

## Env Vars

**Vercel**: `DATABASE_URL`, `ADMIN_PASSWORD`, `JWT_SECRET`, `VPS_API_URL`, `VPS_API_TOKEN`, `VPS_IP`, `REALITY_SNI`, `REALITY_PUBLIC_KEY`, `REALITY_SHORT_ID`, `CRON_SECRET`

**VPS** (`/etc/veilx-api.env`): `API_PORT`, `API_TOKEN`, `XRAY_CONFIG_PATH`, `TLS_CERT_PATH`, `TLS_KEY_PATH`

Never expose VPS/Reality env vars to client. VLESS links are built server-side only.

## VLESS Link Format

```
vless://{uuid}@{VPS_IP}:443?encryption=none&flow=xtls-rprx-vision&type=tcp&security=reality&sni={REALITY_SNI}&fp=chrome&pbk={REALITY_PUBLIC_KEY}&sid={REALITY_SHORT_ID}#VeilX
```

Built in `src/lib/vless-link-builder.ts`. All parameters from env vars. Never construct on client.

## Security Rules

- `crypto.timingSafeEqual` for all secret comparisons (admin password, VPS API token)
- JWT in httpOnly/secure/sameSite=strict cookie (`veilx-admin`), 24h TTL
- Rate limiting: 5 login attempts per 15 min per IP, stored in Postgres (not in-memory)
- User tokens: 16-char random (a-z0-9), generated via `crypto.randomBytes`
- No `.env` files in git. No secrets in client bundles.

## Coding Standards

> Full details: `docs/code-standards-nextjs-typescript-tailwind.md`

- TypeScript strict, 2-space indent, single quotes, no semicolons, trailing commas
- Named exports preferred. Default exports only for page/layout.
- No barrel files. No ORM. No custom CSS files.
- Raw SQL via `@vercel/postgres` — parameterized queries only
- Files under 200 lines. kebab-case names.
- Server components by default. `'use client'` only when needed.
- Conventional commits (`feat:`, `fix:`, `docs:`, etc.). No AI references.

## API Response Types

```typescript
type ApiSuccess<T> = { success: true, data: T }
type ApiError = { success: false, error: string }
type ApiResponse<T> = ApiSuccess<T> | ApiError
```

Define in `src/lib/types.ts`. All API routes return `NextResponse.json<ApiResponse<T>>()`.

## Hard Rules

1. **No light mode.** Dark theme only, no toggle.
2. **Russian UI.** All user-facing text in Russian.
3. **Max 20 users.** Soft limit enforced in admin UI.
4. **No ORM.** Raw SQL via `@vercel/postgres`.
5. **No mocks in tests.** Real DB connections.
6. **VLESS links server-side only.** Never expose env vars to client.
7. **No custom CSS files.** Tailwind v4 only.

## Build Phases

```
Phase 0 (Scaffold Next.js, install deps, .env.example)
    │
Phase 1 (VPS: Xray setup) ──→ Phase 2 (VPS API) ──┐
                                                     ├──→ Phase 4 (Next.js API) → Phase 5 (Frontend) → Phase 6 (Cron)
Phase 3 (Vercel Postgres) ─────────────────────────┘
    │
Phase 7 (Deploy: Vercel + VPS systemd)
```

VPS API runs as systemd unit (`veilx-api.service`). See `plan/project.md` for deployment details.

## Testing

- **Runner**: Vitest (configured in Phase 0)
- **Location**: `src/**/*.test.ts` — colocated with source
- **DB**: Real Vercel Postgres via `DATABASE_URL`. No mocks, no in-memory substitutes.
- **Run**: `npm run test` (all), `npm run test -- src/lib/auth.test.ts` (single file)
- API route tests: use `next/test-utils` or direct handler invocation

## Known Gotchas

- **VPS self-signed TLS**: `vps-api-client.ts` must use `rejectUnauthorized: false` (or custom agent). Without it, all VPS calls fail with `UNABLE_TO_VERIFY_LEAF_SIGNATURE`.
- **Vercel Postgres**: no `CREATE INDEX CONCURRENTLY`, no `LISTEN/NOTIFY`, connection pool limit ~10 on hobby plan. Use `sql` tagged template from `@vercel/postgres`.
- **CRON_SECRET**: passed via `Authorization: Bearer` header by Vercel Cron, not query params.
- **Xray reload**: after config change, send `SIGHUP` to xray process (not restart). VPS API handles this.
- **Token collision**: 16-char a-z0-9 gives ~2.8e24 space. No collision check needed for 20 users, but DB has unique constraint as safety net.

## Common Commands

> Available after Phase 0 scaffold.

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run lint         # ESLint check
npm run test         # Run tests
```
