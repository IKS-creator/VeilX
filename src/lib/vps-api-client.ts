import https from 'node:https'
import type { ServerConfig } from './servers'
import { getServers } from './servers'

export type VpsUserStats = {
  up: number
  down: number
  online: boolean
}

export type VpsStats = {
  users: Record<string, VpsUserStats>
}

// Use node:https directly to support rejectUnauthorized: false for self-signed VPS cert.
// Global fetch (undici) does not support custom https agents.
function vpsRequest(
  server: ServerConfig,
  method: string,
  path: string,
  body?: string,
  timeout = 10_000,
): Promise<{ status: number; data: string }> {
  const url = new URL(path, server.apiUrl)

  return new Promise((resolve, reject) => {
    const req = https.request(
      url,
      {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${server.apiToken}`,
        },
        rejectUnauthorized: false,
        timeout,
      },
      (res) => {
        const chunks: Buffer[] = []
        res.on('data', (chunk: Buffer) => chunks.push(chunk))
        res.on('end', () => {
          resolve({
            status: res.statusCode ?? 500,
            data: Buffer.concat(chunks).toString(),
          })
        })
      },
    )

    req.on('error', reject)
    req.on('timeout', () => {
      req.destroy(new Error(`VPS API timeout after ${timeout}ms`))
    })

    if (body) req.write(body)
    req.end()
  })
}

async function vpsFetch(
  server: ServerConfig,
  method: string,
  path: string,
  body?: unknown,
  timeout?: number,
): Promise<string> {
  const payload = body ? JSON.stringify(body) : undefined
  const res = await vpsRequest(server, method, path, payload, timeout)

  if (res.status < 200 || res.status >= 300) {
    throw new Error(`VPS API [${server.id}] ${res.status}: ${res.data}`)
  }

  return res.data
}

export async function addUser(server: ServerConfig, uuid: string): Promise<void> {
  await vpsFetch(server, 'POST', '/users', { uuid })
}

export async function removeUser(server: ServerConfig, uuid: string): Promise<void> {
  await vpsFetch(server, 'DELETE', `/users/${uuid}`)
}

export async function getStats(server: ServerConfig): Promise<VpsStats> {
  const data = await vpsFetch(server, 'GET', '/stats', undefined, 30_000)
  return JSON.parse(data)
}

export async function syncUsers(server: ServerConfig, uuids: string[]): Promise<void> {
  await vpsFetch(server, 'POST', '/sync', { uuids })
}

// Run an operation on ALL servers, collecting errors instead of failing fast
export async function forAllServers<T>(
  fn: (server: ServerConfig) => Promise<T>,
): Promise<{ results: T[]; errors: string[] }> {
  const servers = getServers()
  const results: T[] = []
  const errors: string[] = []

  await Promise.all(
    servers.map(async (s) => {
      try {
        results.push(await fn(s))
      } catch (err) {
        errors.push(`[${s.id}] ${err instanceof Error ? err.message : String(err)}`)
      }
    }),
  )

  return { results, errors }
}
