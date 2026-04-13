import { db, sql } from '@vercel/postgres'
import type { User } from './types'

// PG bigint→string, timestamp→Date — normalize to match User type
function parseUser(row: Record<string, unknown>): User {
  return {
    ...row,
    traffic_up: Number(row.traffic_up),
    traffic_down: Number(row.traffic_down),
    created_at: (row.created_at as Date).toISOString(),
    updated_at: (row.updated_at as Date).toISOString(),
    last_connected_at: row.last_connected_at
      ? (row.last_connected_at as Date).toISOString()
      : null,
  } as User
}

// --- Users ---

export async function getAllUsers(): Promise<User[]> {
  const { rows } = await sql`
    SELECT * FROM users ORDER BY created_at DESC
  `
  return rows.map(parseUser)
}

export async function getUserByToken(token: string): Promise<User | null> {
  const { rows } = await sql`
    SELECT * FROM users WHERE token = ${token} LIMIT 1
  `
  return rows[0] ? parseUser(rows[0]) : null
}

export async function getUserById(id: number): Promise<User | null> {
  const { rows } = await sql`
    SELECT * FROM users WHERE id = ${id} LIMIT 1
  `
  return rows[0] ? parseUser(rows[0]) : null
}

export async function createUser(
  name: string,
  token: string,
  vlessUuid: string,
): Promise<User> {
  const { rows } = await sql`
    INSERT INTO users (name, token, vless_uuid)
    VALUES (${name}, ${token}, ${vlessUuid})
    RETURNING *
  `
  return parseUser(rows[0])
}

export async function updateUserStatus(
  id: number,
  status: 'active' | 'disabled',
): Promise<User | null> {
  const { rows } = await sql`
    UPDATE users
    SET status = ${status}, updated_at = now()
    WHERE id = ${id}
    RETURNING *
  `
  return rows[0] ? parseUser(rows[0]) : null
}

export async function deleteUser(id: number): Promise<boolean> {
  const { rowCount } = await sql`
    DELETE FROM users WHERE id = ${id}
  `
  return (rowCount ?? 0) > 0
}

export async function getUserCount(): Promise<number> {
  const { rows } = await sql<{ count: string }>`
    SELECT count(*)::text AS count FROM users
  `
  return parseInt(rows[0].count, 10)
}

// Batch update traffic stats from cron.
// Wrapped in a transaction — VPS resets counters on read (--reset),
// so partial writes would mean permanent data loss for remaining users.
export async function updateTrafficStats(
  stats: Array<{
    vless_uuid: string
    up: number
    down: number
    online: boolean
  }>,
): Promise<number> {
  if (stats.length === 0) return 0

  const client = await db.connect()
  let updated = 0
  try {
    await client.sql`BEGIN`
    for (const s of stats) {
      const { rowCount } = await client.sql`
        UPDATE users
        SET
          traffic_up = traffic_up + ${s.up},
          traffic_down = traffic_down + ${s.down},
          last_connected_at = CASE WHEN ${s.online} THEN now() ELSE last_connected_at END,
          updated_at = now()
        WHERE vless_uuid = ${s.vless_uuid}
      `
      updated += rowCount ?? 0
    }
    await client.sql`COMMIT`
  } catch (e) {
    await client.sql`ROLLBACK`
    throw e
  } finally {
    client.release()
  }
  return updated
}

// Get all active UUIDs for VPS sync
export async function getActiveUuids(): Promise<string[]> {
  const { rows } = await sql<{ vless_uuid: string }>`
    SELECT vless_uuid FROM users WHERE status = 'active'
  `
  return rows.map((r) => r.vless_uuid)
}
