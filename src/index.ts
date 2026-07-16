// ---------------------------------------------------------------------------
// indonesian-date — Indonesian date formatting & utilities
// Zero dependencies, TypeScript, ESM + CJS
// ---------------------------------------------------------------------------

// ─── Day & month names ──────────────────────────────────────────────────────

const HARI: readonly [string, string, string, string, string, string, string] = [
  'Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu',
]

const BULAN: readonly [string, string, string, string, string, string, string, string, string, string, string, string] = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
]

const BULAN_SINGKAT: readonly string[] = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des',
]

// ─── Timezone offsets ───────────────────────────────────────────────────────

export const TIMEZONE_OFFSETS = {
  WIB: 7 * 60,   // UTC+7
  WITA: 8 * 60,  // UTC+8
  WIT: 9 * 60,   // UTC+9
} as const

export type TimezoneName = keyof typeof TIMEZONE_OFFSETS
export type TimezoneOffset = (typeof TIMEZONE_OFFSETS)[TimezoneName]

// ─── Helpers ────────────────────────────────────────────────────────────────

function pad(n: number): string {
  return n.toString().padStart(2, '0')
}

function toIndoDate(date: Date, tz?: TimezoneName | number): Date {
  if (!tz) return date
  const offset = typeof tz === 'number' ? tz : TIMEZONE_OFFSETS[tz]
  const local = date.getTime() + date.getTimezoneOffset() * 60_000 + offset * 60_000
  return new Date(local)
}

// ─── Format tokens ──────────────────────────────────────────────────────────

type FormatToken =
  | 'dddd'   // Monday → Senin
  | 'ddd'    // Mon → Sen
  | 'DD'     // 01-31
  | 'D'      // 1-31
  | 'MMMM'   // Januari
  | 'MMM'    // Jan
  | 'MM'     // 01-12
  | 'M'      // 1-12
  | 'YYYY'   // 2026
  | 'YY'     // 26
  | 'HH'     // 00-23
  | 'H'      // 0-23
  | 'hh'     // 01-12
  | 'h'      // 1-12
  | 'mm'     // 00-59
  | 'm'      // 0-59
  | 'ss'     // 00-59
  | 's'      // 0-59
  | 'A'      // AM/PM
  | 'a'      // am/pm
  | 'Z'      // WIB/WITA/WIT
  | string

const TOKEN_REGEX = /dddd|ddd|DD|D|MMMM|MMM|MM|M|YYYY|YY|HH|H|hh|h|mm|m|ss|s|A|a|Z/g

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MAP: Record<string, (d: Date, tz?: any) => string> = {
  dddd: (d) => HARI[d.getDay()],
  ddd: (d) => HARI[d.getDay()].slice(0, 3),
  DD: (d) => pad(d.getDate()),
  D: (d) => String(d.getDate()),
  MMMM: (d) => BULAN[d.getMonth()],
  MMM: (d) => BULAN_SINGKAT[d.getMonth()],
  MM: (d) => pad(d.getMonth() + 1),
  M: (d) => String(d.getMonth() + 1),
  YYYY: (d) => String(d.getFullYear()),
  YY: (d) => String(d.getFullYear()).slice(-2),
  HH: (d) => pad(d.getHours()),
  H: (d) => String(d.getHours()),
  hh: (d) => pad(d.getHours() % 12 || 12),
  h: (d) => String(d.getHours() % 12 || 12),
  mm: (d) => pad(d.getMinutes()),
  m: (d) => String(d.getMinutes()),
  ss: (d) => pad(d.getSeconds()),
  s: (d) => String(d.getSeconds()),
  A: (d) => (d.getHours() < 12 ? 'AM' : 'PM'),
  a: (d) => (d.getHours() < 12 ? 'am' : 'pm'),
  Z: (_d: Date, tz?: TimezoneName) => (tz && tz in TIMEZONE_OFFSETS ? (tz as TimezoneName) : ''),
}

/**
 * Format a Date to Indonesian locale using tokens.
 *
 * @example
 * format(new Date(), 'dddd, DD MMMM YYYY')       // "Senin, 16 Juli 2026"
 * format(new Date(), 'DD/MM/YYYY')                // "16/07/2026"
 * format(new Date(), 'HH:mm:ss')                  // "14:30:45"
 * format(new Date(), 'dddd, DD MMMM YYYY HH:mm', 'WIB') // "Senin, 16 Juli 2026 14:30 WIB"
 */
export function format(
  date: Date,
  template: string,
  tz?: TimezoneName,
): string {
  const d = toIndoDate(date, tz)
  return template.replace(TOKEN_REGEX, (token) => {
    const fn = MAP[token]
    return fn ? fn(d, tz) : token
  })
}

// ─── Preset formats ─────────────────────────────────────────────────────────

/**
 * Format: "Senin, 16 Juli 2026"
 */
export function formatLong(date: Date, tz?: TimezoneName): string {
  return format(date, 'dddd, DD MMMM YYYY', tz)
}

/**
 * Format: "Senin, 16 Juli 2026 14:30 WIB"
 */
export function formatFull(date: Date, tz?: TimezoneName): string {
  return format(date, 'dddd, DD MMMM YYYY HH:mm', tz)
}

/**
 * Format: "16/07/2026"
 */
export function formatSlash(date: Date, tz?: TimezoneName): string {
  return format(date, 'DD/MM/YYYY', tz)
}

/**
 * Format: "16 Juli 2026"
 */
export function formatDateOnly(date: Date, tz?: TimezoneName): string {
  return format(date, 'DD MMMM YYYY', tz)
}

/**
 * Format: "14:30", "14:30:45", "02:30 PM"
 */
export function formatTime(
  date: Date,
  options?: { seconds?: boolean; hour12?: boolean; tz?: TimezoneName },
): string {
  const tpl = options?.seconds
    ? options?.hour12 ? 'hh:mm:ss A' : 'HH:mm:ss'
    : options?.hour12 ? 'hh:mm A' : 'HH:mm'
  return format(date, tpl, options?.tz)
}

// ─── Relative time ──────────────────────────────────────────────────────────

/**
 * Get Indonesian relative time string.
 *
 * @example
 * relativeTime(new Date())                    // "baru saja"
 * relativeTime(new Date(Date.now() - 60_000)) // "1 menit yang lalu"
 * relativeTime(new Date(Date.now() + 86_400_000 * 3)) // "3 hari lagi"
 */
export function relativeTime(
  date: Date,
  options?: { now?: Date; tz?: TimezoneName },
): string {
  const now = options?.now ?? new Date()
  const diff = toIndoDate(date, options?.tz).getTime() - toIndoDate(now, options?.tz).getTime()
  const abs = Math.abs(diff)
  const future = diff > 0

  const seconds = Math.floor(abs / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const weeks = Math.floor(days / 7)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)

  const suffix = future ? 'lagi' : 'yang lalu'
  const prefix = future ? '' : ''

  if (seconds < 10) return 'baru saja'
  if (seconds < 60) return `${seconds} detik ${suffix}`
  if (minutes < 60) return `${minutes} menit ${suffix}`
  if (hours < 24) return `${hours} jam ${suffix}`
  if (days < 7) return `${days} hari ${suffix}`
  if (weeks < 5) return `${weeks} minggu ${suffix}`
  if (months < 12) return `${months} bulan ${suffix}`
  return `${years} tahun ${suffix}`
}

// ─── Timezone conversion ────────────────────────────────────────────────────

type Timezone = TimezoneName | number

function getOffsetMinutes(tz: Timezone): number {
  return typeof tz === 'number' ? tz : TIMEZONE_OFFSETS[tz]
}

/**
 * Convert a date to a specific Indonesian timezone.
 * Returns a plain Date adjusted to the timezone offset.
 */
export function toTimezone(date: Date, tz: Timezone): Date {
  return toIndoDate(date, tz)
}

/**
 * Convert between Indonesian timezones (WIB ↔ WITA ↔ WIT).
 *
 * @example
 * convertTimezone(new Date(), 'WIB', 'WITA') // +1 hour
 */
export function convertTimezone(
  date: Date,
  from: Timezone,
  to: Timezone,
): Date {
  const fromOffset = getOffsetMinutes(from)
  const toOffset = getOffsetMinutes(to)
  const diffMs = (toOffset - fromOffset) * 60_000
  return new Date(date.getTime() + diffMs)
}

/**
 * Get timezone name from offset minutes.
 */
export function getTimezoneName(offsetMinutes: number): TimezoneName | null {
  const entry = Object.entries(TIMEZONE_OFFSETS).find(
    ([, v]) => v === offsetMinutes,
  )
  return (entry?.[0] as TimezoneName) ?? null
}

// ─── Validation ─────────────────────────────────────────────────────────────

/**
 * Check if a value is a valid Date.
 */
export function isValidDate(value: unknown): value is Date {
  return value instanceof Date && !isNaN(value.getTime())
}

// ─── Range ──────────────────────────────────────────────────────────────────

export interface DateRange {
  start: Date
  end: Date
}

/**
 * Get the date range for a given month in Indonesia timezone.
 *
 * @example
 * getMonthRange(2026, 6) // { start: 2026-06-01, end: 2026-06-30 }
 */
export function getMonthRange(year: number, month: number): DateRange {
  return {
    start: new Date(year, month - 1, 1),
    end: new Date(year, month, 0), // day 0 of next month = last day of current
  }
}

/**
 * Get today's date range (start to end of day).
 */
export function getTodayRange(tz?: TimezoneName): DateRange {
  const now = toIndoDate(new Date(), tz)
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const end = new Date(start.getTime() + 86_400_000 - 1)
  return { start, end }
}

// ─── Hari libur / weekend ───────────────────────────────────────────────────

/**
 * Check if a date falls on a weekend (Saturday or Sunday).
 */
export function isWeekend(date: Date): boolean {
  const day = date.getDay()
  return day === 0 || day === 6
}

/**
 * Get Indonesian day name for a date.
 *
 * @example
 * getDayName(new Date('2026-07-16')) // "Kamis"
 */
export function getDayName(date: Date): string {
  return HARI[date.getDay()]
}

/**
 * Get Indonesian month name for a date.
 *
 * @example
 * getMonthName(new Date('2026-07-16')) // "Juli"
 */
export function getMonthName(date: Date): string {
  return BULAN[date.getMonth()]
}

// ─── Age calculator ─────────────────────────────────────────────────────────

/**
 * Calculate age in years, months, days from birth date.
 *
 * @example
 * getAge(new Date('2000-01-15'))
 * // { years: 26, months: 6, days: 1 }
 */
export function getAge(birthDate: Date): { years: number; months: number; days: number } {
  const now = new Date()
  let years = now.getFullYear() - birthDate.getFullYear()
  let months = now.getMonth() - birthDate.getMonth()
  let days = now.getDate() - birthDate.getDate()

  if (days < 0) {
    months--
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0)
    days += prevMonth.getDate()
  }
  if (months < 0) {
    years--
    months += 12
  }

  return { years, months, days }
}
