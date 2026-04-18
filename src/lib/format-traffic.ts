const KB = 1_000
const MB = 1_000_000
const GB = 1_000_000_000

export function formatTraffic(bytes: number): string {
  if (bytes === 0) return '0'
  if (bytes < MB) return `${Math.round(bytes / KB)} \u041A\u0411`
  if (bytes < GB) return `${Math.round(bytes / MB)} \u041C\u0411`
  return `${(bytes / GB).toFixed(1)} \u0413\u0411`
}

export function formatTrafficExact(bytes: number): string {
  return `${bytes.toLocaleString('ru-RU')} \u0431\u0430\u0439\u0442`
}

export function formatTrafficPair(up: number, down: number): string {
  return `${formatTraffic(up)} / ${formatTraffic(down)}`
}
