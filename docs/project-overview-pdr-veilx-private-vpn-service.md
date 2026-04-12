# VeilX — Product Development Requirements (PDR)

## Problem

Users in Russia face ISP-level DPI blocking of services (Instagram, YouTube, ChatGPT). Commercial VPNs are expensive ($5-12/mo per person), unreliable, and detectable by RKN.

## Solution

Self-hosted VPS in Stockholm ($6/mo total) running VLESS + Reality protocol. Masquerades as normal HTTPS traffic — undetectable by DPI. Admin creates invite links, friends connect via QR code.

**Cost**: $0.35/mo per person (20 users).

## Roles

- **Admin** (1): Manages invites, enables/disables users. Login via password at `/admin`.
- **User** (10-20): Accesses personal config page at `/c/{token}`. No registration needed.

## Screens

1. **Landing** (`/`) — Static. Hero, 3 steps, features, link to /setup.
2. **Setup** (`/setup`) — Static. Tabbed instructions: iOS (FoXray), Android (v2rayNG), Windows (Nekobox/v2rayN), macOS (FoXray/Nekobox).
3. **Config** (`/c/[token]`) — SSR. Shows greeting, masked VLESS link, copy button, QR code 280x280. States: active / disabled / 404.
4. **Admin** (`/admin`) — CSR. Login form → dashboard with invite creation, user table (name, status, traffic, last connected, actions), sync button.

## Key Flows

1. Admin creates invite → UUID + token generated → saved to DB + Xray → link shown
2. User opens link → sees config → scans QR in VPN client → connected
3. Admin disables user → DB status=disabled + UUID removed from Xray
4. Admin deletes user → DB record deleted + UUID removed from Xray
5. Daily cron → VPS stats API → update traffic/last_connected in DB

## Data

**users**: id, name, token(16 chars, unique), vless_uuid(v4, unique), status(active|disabled), traffic_up, traffic_down, last_connected_at, created_at, updated_at

**login_attempts**: ip(PK), attempts, window_start. Self-cleaning (>15 min).

## Stack

- Next.js 15 App Router, TypeScript strict, Tailwind CSS v4
- Vercel (free) + Vercel Postgres
- VPS: Vultr Stockholm, Ubuntu 22.04, Xray-core, Express.js API on :8443
- No ORM — raw SQL via @vercel/postgres
- Dark theme only, Russian UI, mobile-first

## Constraints

- Max 20 users (soft limit)
- VLESS links built server-side only
- VPS API auth: Bearer token + HTTPS (self-signed)
- Admin auth: JWT in httpOnly cookie, 24h TTL
- Rate limit: 5 login attempts / 15 min per IP
- Cron: daily only (Vercel Hobby plan limitation)
