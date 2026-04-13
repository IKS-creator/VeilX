const MB = 1_000_000
const GB = 1_000_000_000

export function formatTraffic(bytes: number): string {
  if (bytes < MB) return '0 \u041C\u0411'
  if (bytes < GB) return `${Math.round(bytes / MB)} \u041C\u0411`
  return `${(bytes / GB).toFixed(1)} \u0413\u0411`
}

export function formatTrafficPair(up: number, down: number): string {
  return `${formatTraffic(up)} / ${formatTraffic(down)}`
}
