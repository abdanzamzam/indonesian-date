# 🇮🇩 indonesian-date

![npm](https://img.shields.io/npm/v/indonesian-date) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/indonesian-date) ![TypeScript](https://img.shields.io/badge/TypeScript-✅-blue) ![Zero dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)

> Indonesian date formatting & utilities — "Senin, 16 Juli 2026", "2 hari yang lalu", WIB/WITA/WIT. **Zero dependencies**, **TypeScript**, **ESM + CJS**.

---

## 📦 Install

```bash
npm install indonesian-date
```

### ESM (recommended)

```ts
import { format, formatLong, relativeTime, convertTimezone } from 'indonesian-date'
```

### CJS

```js
const { format, formatLong, relativeTime, convertTimezone } = require('indonesian-date')
```

---

## ✨ Features

| Feature | Status |
|---|---|
| Indonesian date formatting (dddd, DD MMMM YYYY) | ✅ |
| Relative time ("2 hari yang lalu", "3 jam lagi") | ✅ |
| WIB / WITA / WIT timezone support | ✅ |
| Convert between timezones | ✅ |
| Age calculator (years, months, days) | ✅ |
| Weekend detection (Saturday/Sunday) | ✅ |
| Indonesian day & month names | ✅ |
| Date ranges | ✅ |
| TypeScript (ESM + CJS) | ✅ |
| **Zero dependencies** | ✅ |

---

## 🚀 Quick Start

```ts
import { format, formatLong, formatSlash, relativeTime, convertTimezone, getAge } from 'indonesian-date'

const now = new Date('2026-07-16T15:30:00')

// Standard formats
formatLong(now)                     // "Kamis, 16 Juli 2026"
format(now, 'DD/MM/YYYY')          // "16/07/2026"
format(now, 'HH:mm')               // "15:30"

// Relative time
relativeTime(new Date(Date.now() - 60000))
// → "1 menit yang lalu"

relativeTime(new Date(Date.now() + 86400000 * 3))
// → "3 hari lagi"

// Timezone
format(now, 'dddd, DD MMMM YYYY HH:mm Z', 'WITA')
// → "Kamis, 16 Juli 2026 16:30 WITA"

convertTimezone(now, 'WIB', 'WITA')
// → Date adjusted +1 hour

// Age calculator
getAge(new Date('2000-01-15'))
// → { years: 26, months: 6, days: 1 }
```

---

## 🔤 Format Tokens

Available tokens for the `format()` function:

| Token | Output | Description |
|-------|--------|-------------|
| `dddd` | `Senin`, `Selasa`, … | Full day name |
| `ddd` | `Sen`, `Sel`, … | Short day name |
| `DD` | `01`–`31` | Day (leading zero) |
| `D` | `1`–`31` | Day |
| `MMMM` | `Januari`, `Februari`, … | Full month name |
| `MMM` | `Jan`, `Feb`, … | Short month name |
| `MM` | `01`–`12` | Month (leading zero) |
| `M` | `1`–`12` | Month |
| `YYYY` | `2026` | 4-digit year |
| `YY` | `26` | 2-digit year |
| `HH` | `00`–`23` | Hours (24h, leading zero) |
| `H` | `0`–`23` | Hours (24h) |
| `hh` | `01`–`12` | Hours (12h, leading zero) |
| `h` | `1`–`12` | Hours (12h) |
| `mm` | `00`–`59` | Minutes (leading zero) |
| `m` | `0`–`59` | Minutes |
| `ss` | `00`–`59` | Seconds (leading zero) |
| `s` | `0`–`59` | Seconds |
| `A` | `AM` / `PM` | AM/PM uppercase |
| `a` | `am` / `pm` | AM/PM lowercase |
| `Z` | `WIB` | Timezone name (requires tz param) |

### Token combinations

```ts
format(now, 'dddd, DD MMMM YYYY')        // "Kamis, 16 Juli 2026"
format(now, 'dddd, DD MMMM YYYY HH:mm')  // "Kamis, 16 Juli 2026 15:30"
format(now, 'DD MMM YYYY')               // "16 Jul 2026"
format(now, 'hh:mm A')                   // "03:30 PM"
format(now, 'YYYY-MM-DD')                // "2026-07-16"
format(now, 'dddd, DD MMMM YYYY HH:mm Z', 'WITA') // "Kamis, 16 Juli 2026 16:30 WITA"
```

---

## ⏰ Timezone

Supports Indonesia's three timezones:

| Timezone | Offset | Region |
|----------|--------|--------|
| `WIB` | UTC+7 | Sumatra, Java, West & Central Kalimantan |
| `WITA` | UTC+8 | South & East Kalimantan, Sulawesi, Bali, NTT, NTB |
| `WIT` | UTC+9 | Maluku, Papua |

```ts
import { format, toTimezone, convertTimezone, TIMEZONE_OFFSETS } from 'indonesian-date'

// Format with timezone
format(new Date(), 'HH:mm Z', 'WITA')    // "16:30 WITA"

// Convert date to timezone
const witaDate = toTimezone(new Date(), 'WITA')

// Convert between timezones
convertTimezone(new Date(), 'WIB', 'WITA') // +1 hour
convertTimezone(new Date(), 'WITA', 'WIT') // +1 hour

// Get offset values
TIMEZONE_OFFSETS.WIB  // 420 (minutes)
TIMEZONE_OFFSETS.WITA // 480
TIMEZONE_OFFSETS.WIT  // 540
```

---

## 📚 Full API

### Format

| Function | Returns | Example |
|----------|---------|---------|
| `format(date, template, tz?)` | `string` | `"Kamis, 16 Juli 2026"` |
| `formatLong(date, tz?)` | `string` | `"Kamis, 16 Juli 2026"` |
| `formatFull(date, tz?)` | `string` | `"Kamis, 16 Juli 2026 15:30"` |
| `formatSlash(date, tz?)` | `string` | `"16/07/2026"` |
| `formatDateOnly(date, tz?)` | `string` | `"16 Juli 2026"` |
| `formatTime(date, opts?)` | `string` | `"15:30"` or `"03:30 PM"` |

### Relative Time

| Function | Returns | Example |
|----------|---------|---------|
| `relativeTime(date, opts?)` | `string` | `"3 hari yang lalu"` |

### Timezone

| Function | Returns | Example |
|----------|---------|---------|
| `toTimezone(date, tz)` | `Date` | Date adjusted to timezone |
| `convertTimezone(date, from, to)` | `Date` | WIB → WITA +1h |
| `getTimezoneName(offsetMinutes)` | `string\|null` | `420` → `"WIB"` |
| `TIMEZONE_OFFSETS` | `object` | `{ WIB: 420, WITA: 480, WIT: 540 }` |

### Utilities

| Function | Returns | Example |
|----------|---------|---------|
| `getDayName(date)` | `string` | `"Kamis"` |
| `getMonthName(date)` | `string` | `"Juli"` |
| `isWeekend(date)` | `boolean` | `false` |
| `getAge(birthDate)` | `object` | `{ years: 26, months: 6, days: 1 }` |
| `getMonthRange(year, month)` | `DateRange` | `{ start, end }` |
| `getTodayRange(tz?)` | `DateRange` | `{ start, end }` |
| `isValidDate(value)` | `boolean` | `true` |

---

## 🧑‍💻 TypeScript

Type definitions are included out of the box.

```ts
import type { TimezoneName, TimezoneOffset, DateRange } from 'indonesian-date'

function greet(date: Date, tz: TimezoneName = 'WIB') {
  return format(date, 'dddd, DD MMMM YYYY HH:mm Z', tz)
}
```

---

## 📄 License

MIT © [Abdan Zam Zam Ramadhan](https://github.com/abdanzamzam)
