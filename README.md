# indonesian-date 🇮🇩

Format tanggal & waktu ala Indonesia. Zero dependencies, TypeScript, ESM + CJS.

```
npm install indonesian-date
```

## Fitur

- ✅ Format tanggal Indonesia: *"Senin, 16 Juli 2026"*
- ✅ Relative time: *"2 hari yang lalu"*, *"3 jam lagi"*
- ✅ Timezone WIB / WITA / WIT
- ✅ Hitung umur (tahun, bulan, hari)
- ✅ Cek weekend
- ✅ TypeScript, ESM + CJS dual support
- ✅ Zero dependencies

## Contoh

```ts
import { format, formatLong, relativeTime, convertTimezone } from 'indonesian-date'

const now = new Date()

formatLong(now)
// → "Kamis, 16 Juli 2026"

format(now, 'dddd, DD MMMM YYYY HH:mm:ss')
// → "Kamis, 16 Juli 2026 14:30:45"

format(now, 'DD/MM/YYYY')
// → "16/07/2026"

format(now, 'HH:mm')
// → "14:30"

relativeTime(new Date(Date.now() - 60000))
// → "1 menit yang lalu"

relativeTime(new Date(Date.now() + 86400000 * 3))
// → "3 hari lagi"

convertTimezone(new Date(), 'WIB', 'WITA')
// → Jam +1

format(now, 'dddd, DD MMMM YYYY HH:mm', 'WITA')
// → "Kamis, 16 Juli 2026 15:30 WITA"
```

## API

| Fungsi | Deskripsi |
|---|---|
| `format(date, template, tz?)` | Format kustom (token: `dddd`, `DD`, `MMMM`, dll) |
| `formatLong(date, tz?)` | "Senin, 16 Juli 2026" |
| `formatFull(date, tz?)` | "Senin, 16 Juli 2026 14:30" |
| `formatSlash(date, tz?)` | "16/07/2026" |
| `formatDateOnly(date, tz?)` | "16 Juli 2026" |
| `formatTime(date, options?)` | "14:30" atau "02:30 PM" |
| `relativeTime(date, options?)` | "3 hari yang lalu" / "5 jam lagi" |
| `toTimezone(date, tz)` | Konversi ke timezone |
| `convertTimezone(date, from, to)` | Antar timezone (WIB↔WITA↔WIT) |
| `getDayName(date)` | "Senin", "Selasa", … |
| `getMonthName(date)` | "Januari", "Februari", … |
| `isWeekend(date)` | Sabtu/Minggu? |
| `getAge(birthDate)` | `{ years, months, days }` |
| `getMonthRange(year, month)` | Range tanggal 1 bulan |
| `getTodayRange(tz?)` | Range hari ini |
| `isValidDate(value)` | Cek valid Date |

## Lisensi

MIT © [Abdan Zam Zam Ramadhan](https://github.com/abdanzamzam)
