# 🇮🇩 indonesian-date

![npm](https://img.shields.io/npm/v/indonesian-date) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/indonesian-date) ![TypeScript](https://img.shields.io/badge/TypeScript-✅-blue) ![Zero dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)

> Format tanggal & waktu ala Indonesia. **Zero dependencies**, **TypeScript**, **ESM + CJS**.

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

## ✨ Fitur

| Fitur | Status |
|---|---|
| Format tanggal Indonesia (dddd, DD MMMM YYYY) | ✅ |
| Relative time ("2 hari yang lalu", "3 jam lagi") | ✅ |
| Timezone WIB / WITA / WIT | ✅ |
| Konversi antar timezone | ✅ |
| Hitung umur (tahun, bulan, hari) | ✅ |
| Cek weekend (Sabtu/Minggu) | ✅ |
| Nama hari & bulan Indonesia | ✅ |
| Range tanggal | ✅ |
| TypeScript (ESM + CJS) | ✅ |
| **Zero dependencies** | ✅ |

---

## 🚀 Contoh Cepat

```ts
import { format, formatLong, formatSlash, relativeTime, convertTimezone, getAge } from 'indonesian-date'

const now = new Date('2026-07-16T15:30:00')

// Format standar
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

// Hitung umur
getAge(new Date('2000-01-15'))
// → { years: 26, months: 6, days: 1 }
```

---

## 🔤 Token Format

Token yang bisa dipakai di fungsi `format()`:

| Token | Output | Keterangan |
|-------|--------|------------|
| `dddd` | `Senin`, `Selasa`, … | Nama hari lengkap |
| `ddd` | `Sen`, `Sel`, … | Nama hari singkat |
| `DD` | `01`–`31` | Tanggal (leading zero) |
| `D` | `1`–`31` | Tanggal (tanpa leading zero) |
| `MMMM` | `Januari`, `Februari`, … | Nama bulan lengkap |
| `MMM` | `Jan`, `Feb`, … | Nama bulan singkat |
| `MM` | `01`–`12` | Bulan (leading zero) |
| `M` | `1`–`12` | Bulan (tanpa leading zero) |
| `YYYY` | `2026` | Tahun 4 digit |
| `YY` | `26` | Tahun 2 digit |
| `HH` | `00`–`23` | Jam (24 jam, leading zero) |
| `H` | `0`–`23` | Jam (24 jam) |
| `hh` | `01`–`12` | Jam (12 jam, leading zero) |
| `h` | `1`–`12` | Jam (12 jam) |
| `mm` | `00`–`59` | Menit (leading zero) |
| `m` | `0`–`59` | Menit |
| `ss` | `00`–`59` | Detik (leading zero) |
| `s` | `0`–`59` | Detik |
| `A` | `AM` / `PM` | AM/PM kapital |
| `a` | `am` / `pm` | AM/PM lowercase |
| `Z` | `WIB` | Timezone name (perlu parameter tz) |

### Contoh kombinasi token

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

Dukung 3 zona waktu Indonesia:

| Timezone | Offset | Wilayah |
|----------|--------|---------|
| `WIB` | UTC+7 | Sumatra, Jawa, Kalimantan Barat, Kalimantan Tengah |
| `WITA` | UTC+8 | Kalimantan Selatan, Kalimantan Timur, Sulawesi, Bali, NTT, NTB |
| `WIT` | UTC+9 | Maluku, Papua |

```ts
import { format, toTimezone, convertTimezone, TIMEZONE_OFFSETS } from 'indonesian-date'

// Format dengan timezone
format(new Date(), 'HH:mm Z', 'WITA')    // "16:30 WITA"

// Konversi date ke timezone
const witaDate = toTimezone(new Date(), 'WITA')

// Konversi antar timezone
convertTimezone(new Date(), 'WIB', 'WITA') // +1 jam
convertTimezone(new Date(), 'WITA', 'WIT') // +1 jam lagi

// Cek offset
TIMEZONE_OFFSETS.WIB  // 420 (menit)
TIMEZONE_OFFSETS.WITA // 480
TIMEZONE_OFFSETS.WIT  // 540
```

---

## 📚 API Lengkap

### Format

| Fungsi | Return | Contoh |
|--------|--------|--------|
| `format(date, template, tz?)` | `string` | `"Kamis, 16 Juli 2026"` |
| `formatLong(date, tz?)` | `string` | `"Kamis, 16 Juli 2026"` |
| `formatFull(date, tz?)` | `string` | `"Kamis, 16 Juli 2026 15:30"` |
| `formatSlash(date, tz?)` | `string` | `"16/07/2026"` |
| `formatDateOnly(date, tz?)` | `string` | `"16 Juli 2026"` |
| `formatTime(date, opts?)` | `string` | `"15:30"` atau `"03:30 PM"` |

### Relative Time

| Fungsi | Return | Contoh |
|--------|--------|--------|
| `relativeTime(date, opts?)` | `string` | `"3 hari yang lalu"` |

### Timezone

| Fungsi | Return | Contoh |
|--------|--------|--------|
| `toTimezone(date, tz)` | `Date` | Date adjusted ke timezone |
| `convertTimezone(date, from, to)` | `Date` | WIB → WITA +1 jam |
| `getTimezoneName(offsetMinutes)` | `string\|null` | `420` → `"WIB"` |
| `TIMEZONE_OFFSETS` | `object` | `{ WIB: 420, WITA: 480, WIT: 540 }` |

### Utilitas

| Fungsi | Return | Contoh |
|--------|--------|--------|
| `getDayName(date)` | `string` | `"Kamis"` |
| `getMonthName(date)` | `string` | `"Juli"` |
| `isWeekend(date)` | `boolean` | `false` |
| `getAge(birthDate)` | `object` | `{ years: 26, months: 6, days: 1 }` |
| `getMonthRange(year, month)` | `DateRange` | `{ start, end }` |
| `getTodayRange(tz?)` | `DateRange` | `{ start, end }` |
| `isValidDate(value)` | `boolean` | `true` |

---

## 🧑‍💻 TypeScript

Type definitions included out of the box.

```ts
import type { TimezoneName, TimezoneOffset, DateRange } from 'indonesian-date'

function greet(date: Date, tz: TimezoneName = 'WIB') {
  return format(date, 'dddd, DD MMMM YYYY HH:mm Z', tz)
}
```

---

## 📄 Lisensi

MIT © [Abdan Zam Zam Ramadhan](https://github.com/abdanzamzam)
