function requireEnv(name: string): string {
  const val = process.env[name]
  if (!val) throw new Error(`${name} env var is not set`)
  return val
}

export function buildVlessLink(uuid: string, name: string): string {
  const ip = requireEnv('VPS_IP')
  const sni = requireEnv('REALITY_SNI')
  const pbk = requireEnv('REALITY_PUBLIC_KEY')
  const sid = requireEnv('REALITY_SHORT_ID')

  const params = new URLSearchParams({
    encryption: 'none',
    flow: 'xtls-rprx-vision',
    type: 'tcp',
    security: 'reality',
    sni,
    fp: 'chrome',
    pbk,
    sid,
  })

  return `vless://${uuid}@${ip}:443?${params.toString()}#${encodeURIComponent(name)}`
}
