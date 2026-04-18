export type ServerConfig = {
  id: string
  label: string
  apiUrl: string
  apiToken: string
  ip: string
  port: number
  sni: string
  pbk: string
  sid: string
}

// Client-safe subset (no secrets)
export type ServerInfo = {
  id: string
  label: string
}

let cached: ServerConfig[] | null = null

export function getServers(): ServerConfig[] {
  if (cached) return cached

  const json = process.env.VPS_SERVERS
  if (json) {
    cached = JSON.parse(json) as ServerConfig[]
    return cached
  }

  // Legacy single-server fallback
  cached = [
    {
      id: 'stockholm',
      label: 'Швеция',
      apiUrl: requireEnv('VPS_API_URL'),
      apiToken: requireEnv('VPS_API_TOKEN'),
      ip: requireEnv('VPS_IP'),
      port: 443,
      sni: requireEnv('REALITY_SNI'),
      pbk: requireEnv('REALITY_PUBLIC_KEY'),
      sid: requireEnv('REALITY_SHORT_ID'),
    },
  ]
  return cached
}

export function getServer(id: string): ServerConfig {
  const s = getServers().find((s) => s.id === id)
  if (!s) throw new Error(`Server "${id}" not found`)
  return s
}

export function getServerInfos(): ServerInfo[] {
  return getServers().map(({ id, label }) => ({ id, label }))
}

function requireEnv(name: string): string {
  const val = process.env[name]
  if (!val) throw new Error(`${name} env var is not set`)
  return val
}
