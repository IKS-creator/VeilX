import { sql } from '@vercel/postgres'

const MAX_ATTEMPTS = 5

/**
 * Check if IP is rate-limited for login.
 * Returns true if the request should be blocked (429).
 */
export async function isRateLimited(ip: string): Promise<boolean> {
  // Clean stale rows, then check current state
  await sql`
    DELETE FROM login_attempts
    WHERE window_start < now() - interval '15 minutes'
  `

  const { rows } = await sql<{ attempts: number }>`
    SELECT attempts FROM login_attempts WHERE ip = ${ip} LIMIT 1
  `

  if (!rows[0]) return false
  return rows[0].attempts >= MAX_ATTEMPTS
}

/**
 * Record a failed login attempt for the given IP.
 * Inserts a new row or increments the counter.
 */
export async function recordFailedAttempt(ip: string): Promise<void> {
  await sql`
    INSERT INTO login_attempts (ip, attempts, window_start)
    VALUES (${ip}, 1, now())
    ON CONFLICT (ip) DO UPDATE
    SET attempts = CASE
      WHEN login_attempts.window_start < now() - interval '15 minutes'
        THEN 1
        ELSE login_attempts.attempts + 1
      END,
      window_start = CASE
        WHEN login_attempts.window_start < now() - interval '15 minutes'
          THEN now()
          ELSE login_attempts.window_start
        END
  `
}

/**
 * Clear login attempts for an IP after successful login.
 */
export async function clearAttempts(ip: string): Promise<void> {
  await sql`
    DELETE FROM login_attempts WHERE ip = ${ip}
  `
}
