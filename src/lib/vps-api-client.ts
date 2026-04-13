import https from 'node:https'

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
  method: string,
  path: string,
  body?: string,
  timeout = 10_000,
): Promise<{ status: number; data: string }> {
  const baseUrl = process.env.VPS_API_URL
  if (!baseUrl) throw new Error('VPS_API_URL env var is not set')
  const url = new URL(path, baseUrl)
  const token = process.env.VPS_API_TOKEN
  if (!token) throw new Error('VPS_API_TOKEN env var is not set')

  return new Promise((resolve, reject) => {
    const req = https.request(
      url,
      {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
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
  method: string,
  path: string,
  body?: unknown,
  timeout?: number,
): Promise<string> {
  const payload = body ? JSON.stringify(body) : undefined
  const res = await vpsRequest(method, path, payload, timeout)

  if (res.status < 200 || res.status >= 300) {
    throw new Error(`VPS API ${res.status}: ${res.data}`)
  }

  return res.data
}

export async function addUser(uuid: string): Promise<void> {
  await vpsFetch('POST', '/users', { uuid })
}

export async function removeUser(uuid: string): Promise<void> {
  await vpsFetch('DELETE', `/users/${uuid}`)
}

export async function getStats(): Promise<VpsStats> {
  const data = await vpsFetch('GET', '/stats', undefined, 30_000)
  return JSON.parse(data)
}

export async function syncUsers(uuids: string[]): Promise<void> {
  await vpsFetch('POST', '/sync', { uuids })
}
