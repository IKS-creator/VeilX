# VeilX — System Architecture

## Component Diagram

```
┌─────────────────────────────────────────────────────────┐
│  Vercel (veilx.app)                                     │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │ Static Pages │  │  SSR Page    │  │  API Routes   │  │
│  │  /           │  │  /c/[token]  │  │  /api/admin/* │  │
│  │  /setup      │  │              │  │  /api/config/*│  │
│  │              │  │              │  │  /api/cron/*  │  │
│  └──────────────┘  └──────┬───────┘  └──────┬────────┘  │
│                           │                  │           │
│                    ┌──────┴──────────────────┴──────┐    │
│                    │     Vercel Postgres            │    │
│                    │  ┌────────┐ ┌───────────────┐  │    │
│                    │  │ users  │ │login_attempts │  │    │
│                    │  └────────┘ └───────────────┘  │    │
│                    └───────────────────────────────┘    │
└────────────────────────────┬────────────────────────────┘
                             │ HTTPS :8443
                             │ Bearer token auth
                             ▼
┌─────────────────────────────────────────────────────────┐
│  Vultr VPS (Stockholm)                                  │
│                                                         │
│  ┌──────────────────┐    ┌───────────────────────────┐  │
│  │ VPS API          │    │ Xray-core                 │  │
│  │ Express.js :8443 │───▶│ VLESS+Reality :443        │  │
│  │ (self-signed TLS)│    │ Stats API :10085 (local)  │  │
│  └──────────────────┘    └───────────────────────────┘  │
│                                                         │
│  systemd: xray.service, veilx-api.service               │
│  UFW: 22/tcp, 443/tcp, 8443/tcp                         │
└─────────────────────────────────────────────────────────┘
```

## Data Flow: Create Invite

```
Admin UI → POST /api/admin/users
  1. Generate UUID v4 + token (16 chars a-z0-9)
  2. Build VLESS link (server-side, using env vars)
  3. INSERT INTO users (name, token, vless_uuid, status='active')
  4. POST VPS_API_URL/users { uuid } → Xray config reload (SIGHUP)
  5. Return { token, link } → Admin copies link
```

## Data Flow: User Connects

```
Browser → GET /c/{token}
  1. SSR: SELECT * FROM users WHERE token = $1
  2. If not found → 404
  3. If disabled → "access suspended" message
  4. If active → build VLESS link server-side, render page
  5. Client: qrcode.react generates QR from VLESS link
  6. User scans QR / copies link → VPN client connects to VPS :443
```

## Data Flow: Stats Collection

```
Vercel Cron (daily 03:00 UTC) → GET /api/cron/stats
  1. Verify CRON_SECRET header
  2. GET VPS_API_URL/stats → xray api statsquery --reset
  3. VPS returns { users: { uuid: { up, down, online } } }
  4. UPDATE users SET traffic_up += delta, traffic_down += delta,
     last_connected_at = now() WHERE online
```

## API Contracts

### VPS API

**POST /users**
```json
Request:  { "uuid": "550e8400-e29b-..." }
Response: 200 { "ok": true }
Error:    500 { "error": "Failed to reload Xray" }
```

**DELETE /users/:uuid**
```json
Response: 200 { "ok": true }
Error:    404 { "error": "UUID not found" }
```

**GET /stats**
```json
Response: 200 {
  "users": {
    "550e8400-...": { "up": 12345, "down": 67890, "online": true }
  }
}
```

**POST /sync**
```json
Request:  { "uuids": ["550e8400-...", "..."] }
Response: 200 { "ok": true, "count": 15 }
```

### Next.js API Routes

**POST /api/admin/login**
```json
Request:  { "password": "..." }
Success:  200 + Set-Cookie: veilx-admin=JWT
Error:    401 { "error": "Invalid password" }
          429 { "error": "Too many attempts" }
```

**POST /api/admin/users**
```json
Request:  { "name": "Masha" }
Response: 201 { "id": 1, "token": "abc123...", "link": "veilx.app/c/abc123..." }
Error:    400 { "error": "Name required" }
          403 { "error": "User limit reached" }
```

**PATCH /api/admin/users/[id]**
```json
Request:  { "status": "disabled" | "active" }
Response: 200 { "id": 1, "status": "disabled" }
```

## Security Model

| Layer | Mechanism |
|-------|-----------|
| Admin login | Password via crypto.timingSafeEqual |
| Admin session | JWT in httpOnly secure cookie, 24h TTL |
| Rate limiting | 5 attempts/15 min per IP, stored in Postgres |
| VPS API | Bearer token + HTTPS (self-signed), timingSafeEqual |
| User access | Secret 16-char token in URL (36^16 combinations) |
| VLESS link | Built server-side, env vars never exposed to client |

## Directory Structure (Target)

```
src/
├── app/
│   ├── page.tsx                  # Landing /
│   ├── setup/page.tsx            # Setup /setup
│   ├── c/[token]/page.tsx        # Config /c/[token] (SSR)
│   ├── admin/page.tsx            # Admin /admin (CSR)
│   └── api/
│       ├── admin/
│       │   ├── login/route.ts
│       │   ├── users/route.ts
│       │   ├── users/[id]/route.ts
│       │   └── sync/route.ts
│       ├── config/[token]/route.ts
│       └── cron/stats/route.ts
├── components/
│   ├── qr-code-display.tsx
│   ├── copy-button.tsx
│   ├── admin-user-table.tsx
│   ├── invite-form.tsx
│   ├── platform-tabs.tsx
│   ├── toast-notification.tsx
│   ├── delete-confirm-modal.tsx
│   └── skeleton-loader.tsx
└── lib/
    ├── db.ts                     # Vercel Postgres queries
    ├── auth.ts                   # JWT sign/verify, cookie helpers
    ├── vps-api-client.ts         # Fetch wrapper for VPS API
    ├── vless-link-builder.ts     # Build VLESS:// URIs
    ├── rate-limiter.ts           # Login rate limiting
    └── format-traffic.ts         # Bytes → human readable
```
