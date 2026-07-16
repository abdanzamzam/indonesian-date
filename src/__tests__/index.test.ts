import { describe, it, expect } from 'vitest'
import {
  format,
  formatLong,
  formatFull,
  formatSlash,
  formatDateOnly,
  formatTime,
  relativeTime,
  toTimezone,
  convertTimezone,
  getTimezoneName,
  TIMEZONE_OFFSETS,
  getDayName,
  getMonthName,
  isWeekend,
  isWeekend as isWeekend2,
  getAge,
  getMonthRange,
  getTodayRange,
  isValidDate,
} from '../index'

// ── Helper ──────────────────────────────────────────────────────────────────

const date = (iso: string) => new Date(iso)
const withNow = (diffMs: number, fn: () => string) => {
  // overrides Date.now via relativeTime options, no monkey-patch needed
  return fn()
}

// ── Format ──────────────────────────────────────────────────────────────────

describe('format()', () => {
  const now = date('2026-07-16T15:30:45')

  it('format token dddd — full day name', () => {
    expect(format(now, 'dddd')).toBe('Kamis')
  })

  it('format token ddd — short day name', () => {
    expect(format(now, 'ddd')).toBe('Kam')
  })

  it('format token DD/D — date', () => {
    expect(format(now, 'DD')).toBe('16')
    expect(format(now, 'D')).toBe('16')
  })

  it('format token MMMM — full month name', () => {
    expect(format(now, 'MMMM')).toBe('Juli')
  })

  it('format token MMM — short month name', () => {
    expect(format(now, 'MMM')).toBe('Jul')
  })

  it('format token MM/M — month number', () => {
    expect(format(now, 'MM')).toBe('07')
    expect(format(now, 'M')).toBe('7')
  })

  it('format token YYYY/YY — year', () => {
    expect(format(now, 'YYYY')).toBe('2026')
    expect(format(now, 'YY')).toBe('26')
  })

  it('format token HH/H — 24-hour', () => {
    expect(format(now, 'HH')).toBe('15')
    expect(format(now, 'H')).toBe('15')
  })

  it('format token hh/h — 12-hour', () => {
    expect(format(now, 'hh')).toBe('03')
    expect(format(now, 'h')).toBe('3')
  })

  it('format token mm/m — minutes', () => {
    expect(format(now, 'mm')).toBe('30')
    expect(format(now, 'm')).toBe('30')
  })

  it('format token ss/s — seconds', () => {
    expect(format(now, 'ss')).toBe('45')
    expect(format(now, 's')).toBe('45')
  })

  it('format token A/a — AM/PM', () => {
    expect(format(now, 'A')).toBe('PM')
    expect(format(now, 'a')).toBe('pm')
    expect(format(date('2026-07-16T01:30:00'), 'A')).toBe('AM')
  })

  it('format token Z — timezone name', () => {
    expect(format(now, 'Z', 'WIB')).toBe('WIB')
    expect(format(now, 'Z', 'WITA')).toBe('WITA')
    expect(format(now, 'Z', 'WIT')).toBe('WIT')
    expect(format(now, 'Z')).toBe('')
  })

  it('full template with mixed tokens', () => {
    expect(format(now, 'dddd, DD MMMM YYYY')).toBe('Kamis, 16 Juli 2026')
    expect(format(now, 'dddd, DD MMMM YYYY HH:mm:ss')).toBe('Kamis, 16 Juli 2026 15:30:45')
    expect(format(now, 'DD/MM/YYYY')).toBe('16/07/2026')
    expect(format(now, 'YYYY-MM-DD')).toBe('2026-07-16')
    expect(format(now, 'DD MMM YYYY')).toBe('16 Jul 2026')
    expect(format(now, 'hh:mm A')).toBe('03:30 PM')
  })

  it('format with timezone WITA', () => {
    const wita = format(now, 'dddd, DD MMMM YYYY HH:mm Z', 'WITA')
    // WITA is UTC+8, original 15:30 WIB (UTC+7) → 16:30 WITA
    expect(wita).toBe('Kamis, 16 Juli 2026 16:30 WITA')
  })

  it('format with timezone WIT', () => {
    const wit = format(now, 'dddd, DD MMMM YYYY HH:mm Z', 'WIT')
    // WIT is UTC+9, original 15:30 WIB (UTC+7) → 17:30 WIT
    expect(wit).toBe('Kamis, 16 Juli 2026 17:30 WIT')
  })
})

// ── Preset formats ──────────────────────────────────────────────────────────

describe('Preset formats', () => {
  const now = date('2026-07-16T15:30:45')

  it('formatLong', () => {
    expect(formatLong(now)).toBe('Kamis, 16 Juli 2026')
  })

  it('formatFull', () => {
    expect(formatFull(now)).toBe('Kamis, 16 Juli 2026 15:30')
  })

  it('formatSlash', () => {
    expect(formatSlash(now)).toBe('16/07/2026')
  })

  it('formatDateOnly', () => {
    expect(formatDateOnly(now)).toBe('16 Juli 2026')
  })

  it('formatTime default (24h)', () => {
    expect(formatTime(now)).toBe('15:30')
  })

  it('formatTime with seconds', () => {
    expect(formatTime(now, { seconds: true })).toBe('15:30:45')
  })

  it('formatTime 12-hour', () => {
    expect(formatTime(now, { hour12: true })).toBe('03:30 PM')
  })

  it('formatTime 12-hour with seconds', () => {
    expect(formatTime(now, { seconds: true, hour12: true })).toBe('03:30:45 PM')
  })

  it('formatTime with timezone', () => {
    expect(formatTime(now, { tz: 'WITA' })).toBe('16:30')
  })
})

// ── Relative time ───────────────────────────────────────────────────────────

describe('relativeTime()', () => {
  it('baru saja — less than 10s', () => {
    const r = relativeTime(new Date(Date.now() - 5000))
    expect(r).toBe('baru saja')
  })

  it('detik', () => {
    const r = relativeTime(new Date(Date.now() - 30000))
    expect(r).toBe('30 detik yang lalu')
  })

  it('menit', () => {
    const r = relativeTime(new Date(Date.now() - 120000))
    expect(r).toBe('2 menit yang lalu')
  })

  it('jam', () => {
    const r = relativeTime(new Date(Date.now() - 7200000))
    expect(r).toBe('2 jam yang lalu')
  })

  it('hari', () => {
    const r = relativeTime(new Date(Date.now() - 172800000))
    expect(r).toBe('2 hari yang lalu')
  })

  it('minggu', () => {
    const r = relativeTime(new Date(Date.now() - 86400000 * 14))
    expect(r).toBe('2 minggu yang lalu')
  })

  it('bulan', () => {
    const r = relativeTime(new Date(Date.now() - 86400000 * 75))
    expect(r).toBe('2 bulan yang lalu')
  })

  it('tahun', () => {
    const r = relativeTime(new Date(Date.now() - 86400000 * 400))
    expect(r).toBe('1 tahun yang lalu')
  })

  it('future — "lagi" suffix', () => {
    const r = relativeTime(new Date(Date.now() + 86400000 * 3))
    expect(r).toBe('3 hari lagi')
  })

  it('future — jam lagi', () => {
    const r = relativeTime(new Date(Date.now() + 3600000 * 5))
    expect(r).toBe('5 jam lagi')
  })
})

// ── Timezone ────────────────────────────────────────────────────────────────

describe('Timezone', () => {
  it('TIMEZONE_OFFSETS values', () => {
    expect(TIMEZONE_OFFSETS.WIB).toBe(420)
    expect(TIMEZONE_OFFSETS.WITA).toBe(480)
    expect(TIMEZONE_OFFSETS.WIT).toBe(540)
  })

  it('toTimezone WITA shift', () => {
    const base = date('2026-07-16T15:00:00+07:00') // 15:00 WIB
    const inWita = toTimezone(base, 'WITA')
    const hours = inWita.getUTCHours() + (inWita.getTimezoneOffset() / -60)
    // Should be 16:xx
    expect(inWita.getHours()).toBe(16)
  })

  it('convertTimezone WIB → WITA', () => {
    const base = new Date('2026-07-16T08:00:00Z') // 15:00 WIB
    const wita = convertTimezone(base, 'WIB', 'WITA')
    expect(wita.getUTCHours()).toBe(9) // +1 hour
  })

  it('convertTimezone WITA → WIB', () => {
    const base = new Date('2026-07-16T08:00:00Z') // 16:00 WITA
    const wib = convertTimezone(base, 'WITA', 'WIB')
    expect(wib.getUTCHours()).toBe(7) // -1 hour
  })

  it('getTimezoneName', () => {
    expect(getTimezoneName(420)).toBe('WIB')
    expect(getTimezoneName(480)).toBe('WITA')
    expect(getTimezoneName(540)).toBe('WIT')
    expect(getTimezoneName(999)).toBeNull()
  })
})

// ── Day & Month names ───────────────────────────────────────────────────────

describe('getDayName()', () => {
  it('Sunday', () => expect(getDayName(date('2026-07-12'))).toBe('Minggu'))
  it('Monday', () => expect(getDayName(date('2026-07-13'))).toBe('Senin'))
  it('Tuesday', () => expect(getDayName(date('2026-07-14'))).toBe('Selasa'))
  it('Wednesday', () => expect(getDayName(date('2026-07-15'))).toBe('Rabu'))
  it('Thursday', () => expect(getDayName(date('2026-07-16'))).toBe('Kamis'))
  it('Friday', () => expect(getDayName(date('2026-07-17'))).toBe('Jumat'))
  it('Saturday', () => expect(getDayName(date('2026-07-18'))).toBe('Sabtu'))
})

describe('getMonthName()', () => {
  it('all months', () => {
    const names = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
    ]
    names.forEach((name, i) => {
      expect(getMonthName(new Date(2026, i, 1))).toBe(name)
    })
  })
})

// ── Weekend ─────────────────────────────────────────────────────────────────

describe('isWeekend()', () => {
  it('Saturday is weekend', () => expect(isWeekend(date('2026-07-18'))).toBe(true))
  it('Sunday is weekend', () => expect(isWeekend(date('2026-07-19'))).toBe(true))
  it('Monday is not weekend', () => expect(isWeekend(date('2026-07-20'))).toBe(false))
  it('Thursday is not weekend', () => expect(isWeekend(date('2026-07-16'))).toBe(false))
})

// ── Age calculator ──────────────────────────────────────────────────────────

describe('getAge()', () => {
  it('returns years, months, days', () => {
    const age = getAge(new Date('2000-01-15'))
    expect(age).toHaveProperty('years')
    expect(age).toHaveProperty('months')
    expect(age).toHaveProperty('days')
    expect(typeof age.years).toBe('number')
    expect(typeof age.months).toBe('number')
    expect(typeof age.days).toBe('number')
  })

  it('age is >= 0', () => {
    const age = getAge(new Date('2026-07-16'))
    expect(age.years).toBeGreaterThanOrEqual(0)
    expect(age.months).toBeGreaterThanOrEqual(0)
    expect(age.days).toBeGreaterThanOrEqual(0)
  })
})

// ── Range ───────────────────────────────────────────────────────────────────

describe('Range', () => {
  it('getMonthRange returns start and end dates', () => {
    const range = getMonthRange(2026, 7) // July
    expect(range.start.getMonth()).toBe(6) // 0-indexed
    expect(range.end.getDate()).toBe(31) // July has 31 days
  })

  it('getMonthRange for February 2024 (leap year)', () => {
    const range = getMonthRange(2024, 2)
    expect(range.end.getDate()).toBe(29)
  })

  it('getTodayRange returns object with start and end', () => {
    const range = getTodayRange()
    expect(range.start).toBeInstanceOf(Date)
    expect(range.end).toBeInstanceOf(Date)
    expect(range.start.getTime()).toBeLessThan(range.end.getTime())
  })
})

// ── Validation ──────────────────────────────────────────────────────────────

describe('isValidDate()', () => {
  it('valid date returns true', () => {
    expect(isValidDate(new Date())).toBe(true)
    expect(isValidDate(new Date('2026-07-16'))).toBe(true)
  })

  it('invalid date returns false', () => {
    expect(isValidDate(new Date('invalid'))).toBe(false)
  })

  it('non-date values return false', () => {
    expect(isValidDate('2026-07-16')).toBe(false)
    expect(isValidDate(null)).toBe(false)
    expect(isValidDate(undefined)).toBe(false)
    expect(isValidDate({})).toBe(false)
    expect(isValidDate(123)).toBe(false)
  })
})
