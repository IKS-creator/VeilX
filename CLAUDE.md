# VeilX — Claude Code Project Instructions

## Project Summary

Private VPN service (VLESS + Reality) for ~20 users (family & friends). Admin manages invites, users connect via personal config pages with QR codes.

- **Domain**: veilx.app
- **Stack**: Next.js 15 (App Router) + Vercel + Vercel Postgres + Vultr VPS (Stockholm)
- **Language**: TypeScript strict, Russian UI
- **Theme**: Dark only (#0a0a0a bg)
- **Protocol**: VLESS + Reality (xtls-rprx-vision)

## Key Docs (READ BEFORE WORK)

| Doc | Purpose |
|-----|---------|
| `plan/project.md` | Full product spec (screens, flows, data, env vars) |
| `DESIGN_SYSTEM.md` | UI tokens, components, layout rules |
| `docs/project-overview-pdr.md` | Condensed spec for quick agent onboarding |
| `docs/system-architecture.md` | Architecture, data flow, API contracts |
| `docs/code-standards.md` | TypeScript/Next.js coding conventions |

## Architecture (Quick Reference)

```
User Browser ──→ Vercel (Next.js 15)
                   ├── Static pages: /, /setup
                   ├── SSR page: /c/[token]
                   ├── API routes: /api/admin/*, /api/config/*, /api/cron/*
                   └── Vercel Postgres (users, login_attempts)
                          │
                   Vercel API routes ──HTTPS──→ VPS API (:8443, Express.js)
                                                  └── Xray-core (VLESS+Reality, :443)
```

## Pages

| Route | Type | Auth | Description |
|-------|------|------|-------------|
| `/` | Static | None | Landing page |
| `/setup` | Static | None | Setup instructions (tabbed by platform) |
| `/c/[token]` | SSR | Token in URL | Personal config page (VLESS link + QR) |
| `/admin` | CSR | JWT cookie `veilx-admin` | Admin panel (invite, manage users) |

## API Routes

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | `/api/admin/login` | Password | Admin login, set JWT cookie |
| GET | `/api/admin/users` | JWT | List users |
| POST | `/api/admin/users` | JWT | Create invite (DB + VPS) |
| PATCH | `/api/admin/users/[id]` | JWT | Enable/disable user |
| DELETE | `/api/admin/users/[id]` | JWT | Delete user |
| POST | `/api/admin/sync` | JWT | Sync all UUIDs to VPS |
| GET | `/api/config/[token]` | None | Get user config (public) |
| GET | `/api/cron/stats` | CRON_SECRET | Daily stats collection |

## VPS API (Express.js on :8443)

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/users` | Add UUID to Xray config |
| DELETE | `/users/:uuid` | Remove UUID from Xray |
| GET | `/stats` | Get traffic stats (resets counters) |
| POST | `/sync` | Full rewrite of Xray clients[] |

Auth: `Authorization: Bearer {VPS_API_TOKEN}`, compared via `crypto.timingSafeEqual`.

## Database Schema

**users**: id (serial PK), name (varchar 50), token (varchar 16, unique), vless_uuid (uuid, unique), status ('active'|'disabled'), traffic_up (bigint), traffic_down (bigint), last_connected_at (timestamp null), created_at, updated_at

**login_attempts**: ip (varchar 45 PK), attempts (int), window_start (timestamp). Self-cleaning: delete rows older than 15 min.

## Env Vars

**Vercel**: DATABASE_URL, ADMIN_PASSWORD, JWT_SECRET, VPS_API_URL, VPS_API_TOKEN, VPS_IP, REALITY_SNI, REALITY_PUBLIC_KEY, REALITY_SHORT_ID, CRON_SECRET

**VPS** (`/etc/veilx-api.env`): API_PORT, API_TOKEN, XRAY_CONFIG_PATH, TLS_CERT_PATH, TLS_KEY_PATH

## Build Phases

```
Phase 1 (VPS: Xray) ──→ Phase 2 (VPS API) ──┐
                                               ├──→ Phase 4 (Next.js API) → Phase 5 (Frontend) → Phase 6 (Cron)
Phase 3 (Vercel Postgres) ───────────────────┘
```

## Rules

- **No light mode.** Dark theme only, no toggle.
- **Russian UI.** All user-facing text in Russian.
- **Max 20 users.** Soft limit, enforced in admin UI.
- **No ORM.** Raw SQL via `@vercel/postgres`.
- **Tailwind CSS v4.** No custom CSS files.
- **VLESS links built server-side.** Never expose env vars to client.
- **Security**: timingSafeEqual for all secret comparisons, httpOnly cookies, rate limiting in Postgres.
- **No mocks in tests.** Real DB connections.
- Files under 200 lines. Split if larger.
- kebab-case file names.

---

## Agent Handoff Protocol

### Context Injection (MANDATORY for all subagents)

Every subagent prompt MUST include:

```
## VeilX Context
- Project: Private VPN service (VLESS+Reality) for ~20 users
- Stack: Next.js 15 App Router, TypeScript strict, Tailwind v4, Vercel Postgres, Vultr VPS
- Work dir: /Users/ifrz/Downloads/VeilX
- Plans: /Users/ifrz/Downloads/VeilX/plans/
- Reports: /Users/ifrz/Downloads/VeilX/plans/reports/
- Spec: plan/project.md | Design: DESIGN_SYSTEM.md
- Russian UI, dark theme only, max 20 users, no ORM
```

### Agent Roles for VeilX

| Agent | Scope | Key Files |
|-------|-------|-----------|
| `planner` | Phase breakdown, task planning | plans/ |
| `fullstack-developer` | Next.js pages, API routes, components | src/ |
| `tester` | Unit/integration tests | __tests__/, *.test.ts |
| `code-reviewer` | Post-implementation review | All modified files |
| `debugger` | Issue diagnosis, log analysis | API routes, VPS API |
| `database-admin` | Schema, queries, migrations | SQL, @vercel/postgres |
| `researcher` | Tech research (Xray, Reality, VLESS) | External docs |

### Handoff Patterns

**Sequential (feature development):**
```
planner → fullstack-developer → tester → code-reviewer
```

**Parallel (independent work):**
```
researcher (Xray/Reality docs) ║ database-admin (schema setup)
         └──────────┬──────────┘
              planner (merge findings)
```

**Debug loop:**
```
debugger (diagnose) → fullstack-developer (fix) → tester (verify) → [repeat if fail]
```

### File Ownership (parallel agents)

When running agents in parallel, assign explicit file ownership:

| Agent Instance | Owns | Must NOT touch |
|---------------|------|----------------|
| Frontend dev | src/app/*, src/components/* | src/app/api/* |
| Backend dev | src/app/api/*, src/lib/* | src/components/* |
| VPS dev | vps-api/* | src/* |
| Tester | __tests__/* | src/* (read-only) |

### What Each Agent Needs

**planner**: Full spec (`plan/project.md`), current file tree, architecture doc.

**fullstack-developer**: Phase plan with specific tasks, design system (`DESIGN_SYSTEM.md`), code standards, existing code context (read relevant files first).

**tester**: List of implemented features, API contracts, expected behaviors from spec.

**code-reviewer**: Diff of changes, spec section for the feature, security checklist.

**debugger**: Error logs, reproduction steps, relevant code paths.

### Report Output

All agent reports go to `plans/reports/` with naming:
```
{agent-type}-{YYMMDD}-{HHMM}-{slug}.md
```
Example: `researcher-260412-1920-xray-reality-setup.md`
