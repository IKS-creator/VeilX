import type { ServerConfig } from './servers'

export function buildVlessLink(
  uuid: string,
  name: string,
  server: ServerConfig,
): string {
  const fragment = `VeilX — ${server.label}`

  // WS+TLS fronting (looks like normal HTTPS to a real domain)
  if (server.network === 'ws') {
    const params = new URLSearchParams({
      encryption: 'none',
      type: 'ws',
      security: 'tls',
      sni: server.sni,
      fp: 'chrome',
      host: server.wsHost ?? server.sni,
      path: server.wsPath ?? '/',
    })
    return `vless://${uuid}@${server.ip}:${server.port}?${params.toString()}#${encodeURIComponent(fragment)}`
  }

  // Reality (default) — TCP + Reality
  const flow = server.flow ?? 'xtls-rprx-vision'
  const params = new URLSearchParams({
    encryption: 'none',
    ...(flow && { flow }),
    type: 'tcp',
    security: 'reality',
    sni: server.sni,
    fp: 'chrome',
    pbk: server.pbk ?? '',
    sid: server.sid ?? '',
  })

  return `vless://${uuid}@${server.ip}:${server.port}?${params.toString()}#${encodeURIComponent(fragment)}`
}
