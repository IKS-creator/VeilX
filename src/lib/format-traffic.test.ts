import { describe, it, expect } from 'vitest'
import { formatTraffic, formatTrafficPair } from './format-traffic'

describe('formatTraffic', () => {
  it('returns 0 МБ for less than 1MB', () => {
    expect(formatTraffic(0)).toBe('0 МБ')
    expect(formatTraffic(500_000)).toBe('0 МБ')
    expect(formatTraffic(999_999)).toBe('0 МБ')
  })

  it('returns МБ for 1MB to 1GB', () => {
    expect(formatTraffic(1_000_000)).toBe('1 МБ')
    expect(formatTraffic(150_000_000)).toBe('150 МБ')
    expect(formatTraffic(999_999_999)).toBe('1000 МБ')
  })

  it('returns ГБ for 1GB and above', () => {
    expect(formatTraffic(1_000_000_000)).toBe('1.0 ГБ')
    expect(formatTraffic(2_300_000_000)).toBe('2.3 ГБ')
    expect(formatTraffic(10_500_000_000)).toBe('10.5 ГБ')
  })
})

describe('formatTrafficPair', () => {
  it('formats up/down pair', () => {
    expect(formatTrafficPair(150_000_000, 2_300_000_000)).toBe('150 МБ / 2.3 ГБ')
  })

  it('handles zero traffic', () => {
    expect(formatTrafficPair(0, 0)).toBe('0 МБ / 0 МБ')
  })
})
