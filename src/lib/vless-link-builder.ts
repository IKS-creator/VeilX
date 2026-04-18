import type { ServerConfig } from './servers'

export function buildVlessLink(
  uuid: string,
  name: string,
  server: ServerConfig,
): string {
  const params = new URLSearchParams({
    encryption: 'none',
    flow: 'xtls-rprx-vision',
    type: 'tcp',
    security: 'reality',
    sni: server.sni,
    fp: 'chrome',
    pbk: server.pbk,
    sid: server.sid,
  })

  const fragment = `VeilX — ${server.label}`
  return `vless://${uuid}@${server.ip}:${server.port}?${params.toString()}#${encodeURIComponent(fragment)}`
}
