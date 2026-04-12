# VeilX — Code Standards

## Language & Framework

- **TypeScript** strict mode (`"strict": true` in tsconfig)
- **Next.js 15** with App Router
- **Tailwind CSS v4** for styling (no custom CSS files)
- **Raw SQL** via `@vercel/postgres` (no ORM)

## File Conventions

- **Naming**: kebab-case, descriptive (`vps-api-client.ts`, not `api.ts`)
- **Max lines**: 200 per file. Split into modules if exceeded.
- **Exports**: Named exports preferred. Default exports only for page/layout components.
- **Barrel files**: Avoid. Import directly from source.

## TypeScript

```typescript
// ENV validation — fail fast at startup
const env = {
  VPS_API_URL: process.env.VPS_API_URL!,
  VPS_API_TOKEN: process.env.VPS_API_TOKEN!,
  // ...
} as const;

// DB row types
interface User {
  id: number;
  name: string;
  token: string;
  vless_uuid: string;
  status: 'active' | 'disabled';
  traffic_up: bigint;
  traffic_down: bigint;
  last_connected_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

// API response types — always typed
interface ApiSuccess<T> { data: T }
interface ApiError { error: string }
type ApiResponse<T> = ApiSuccess<T> | ApiError;
```

## API Routes

```typescript
// Pattern for all API route handlers
export async function POST(request: Request) {
  try {
    // 1. Auth check (admin routes)
    // 2. Parse & validate input
    // 3. Business logic
    // 4. Return typed response
    return Response.json({ data: result }, { status: 201 });
  } catch (err) {
    console.error('POST /api/admin/users:', err);
    return Response.json({ error: 'Internal error' }, { status: 500 });
  }
}
```

## Database Queries

```typescript
import { sql } from '@vercel/postgres';

// Always parameterized — no string interpolation in SQL
const { rows } = await sql`
  SELECT id, name, token, status, created_at
  FROM users
  WHERE token = ${token}
`;

// Return type assertion after query
const user = rows[0] as User | undefined;
```

## Security Patterns

```typescript
import { timingSafeEqual } from 'crypto';

// Constant-time comparison for secrets
function safeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

// JWT cookie — httpOnly, secure, sameSite
cookies().set('veilx-admin', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  maxAge: 60 * 60 * 24, // 24h
  path: '/',
});
```

## Component Patterns

```tsx
// Server component (default in App Router)
export default async function ConfigPage({ params }: { params: { token: string } }) {
  const user = await getUserByToken(params.token);
  if (!user) return notFound();
  // ...
}

// Client component — only when needed (interactivity)
'use client';
export function CopyButton({ text }: { text: string }) {
  // Clipboard API, state management
}
```

## Error Handling

- API routes: try/catch at handler level, return JSON errors with status codes
- VPS API calls: 10 second timeout, log errors, show yellow banner on failure
- DB queries: let errors propagate to handler catch block
- Client: toast notifications for user-facing errors

## Formatting

- 2-space indent
- Single quotes for strings
- No semicolons (Prettier default)
- Trailing commas in multiline

## Git

- Conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`
- No `.env` files in repo
- No AI references in commit messages
