# Default Quran & Hadith Seeding

Sistem ini secara otomatis mengisi koleksi Quran dan Hadith untuk setiap masjid baru yang didaftarkan.

## 📚 Konten Default

Setiap masjid baru akan mendapatkan **18 konten islami**:

- **10 Ayat Al-Quran** termasuk:
  - Ayatul Kursi (Al-Baqarah 2:255)
  - Doa Rabbana (Al-Baqarah 2:201)
  - Surah Ash-Sharh 94:6 (Bersama kesulitan ada kemudahan)
  - Dan 7 ayat lainnya

- **8 Hadith Shahih** termasuk:
  - Hadith Niat (Bukhari & Muslim)
  - Hadith Cinta kepada Saudara
  - Hadith Senyuman adalah Sedekah
  - Dan 5 hadith lainnya

## ⚙️ Cara Kerja Otomatis

### 1. Saat Registrasi Organisasi Baru (via Clerk)

Ketika organisasi baru dibuat melalui Clerk, webhook otomatis akan:

- Membuat record mosque baru
- Setup display settings default
- Setup weather settings default
- **Memasukkan 18 konten Quran & Hadith**

File: [`src/app/api/webhooks/clerk/route.ts`](../src/app/api/webhooks/clerk/route.ts)

```typescript
// Otomatis dipanggil saat organization.created
await createMosqueWithDefaults({
  name,
  slug,
  clerkOrgId: id,
  // ... akan otomatis seed Quran & Hadith
});
```

### 2. Saat Development/Testing (Manual Seed)

```bash
npm run db:seed
```

Ini akan membuat 3 masjid contoh dengan semua konten default.

## 🔧 Fungsi Helper yang Tersedia

### `getDefaultQuranHadithForMosque(mosqueId)`

Mengambil array data Quran & Hadith untuk di-insert ke database.

```typescript
import { getDefaultQuranHadithForMosque } from "@/lib/default-quran-hadith";

const data = getDefaultQuranHadithForMosque(mosqueId);
// Returns array dengan 18 items
```

### `seedDefaultQuranHadith(mosqueId)`

Secara langsung memasukkan konten default ke database.

```typescript
import { seedDefaultQuranHadith } from "@/lib/api/mosque-setup";

await seedDefaultQuranHadith(mosqueId);
// Returns: 18 (jumlah items yang dibuat)
```

### `createMosqueWithDefaults(mosqueData)`

Membuat masjid baru lengkap dengan semua settings dan konten.

```typescript
import { createMosqueWithDefaults } from "@/lib/api/mosque-setup";

const mosque = await createMosqueWithDefaults({
  slug: "my-mosque",
  name: "My Mosque",
  clerkOrgId: "org_xxx",
  city: "New York",
  country: "USA",
  // ... otomatis terisi Quran & Hadith
});
```

### `ensureQuranHadithContent(mosqueId)`

Mengecek dan mengisi konten jika belum ada (untuk masjid existing).

```typescript
import { ensureQuranHadithContent } from "@/lib/api/mosque-setup";

const wasSeeded = await ensureQuranHadithContent(mosqueId);
// Returns: true (jika di-seed), false (jika sudah ada konten)
```

## 📝 Menambah atau Mengedit Konten Default

Edit file: [`src/lib/default-quran-hadith.ts`](../src/lib/default-quran-hadith.ts)

```typescript
export const DEFAULT_QURAN_HADITH = [
  {
    type: "QURAN",
    textArabic: "...",
    textTranslation: "...",
    reference: "Surah ...",
    sortOrder: 0,
  },
  // Tambah atau edit konten di sini
];
```

Setelah edit, jalankan seed ulang:

```bash
npm run db:seed
```

## 🔄 Mengisi Ulang untuk Masjid Existing

Jika ada masjid yang sudah ada tapi belum punya konten Quran/Hadith:

```typescript
import { ensureQuranHadithContent } from "@/lib/api/mosque-setup";

// Dalam API route atau script
const mosques = await prisma.mosque.findMany();

for (const mosque of mosques) {
  const wasSeeded = await ensureQuranHadithContent(mosque.id);
  if (wasSeeded) {
    console.log(`Seeded content for ${mosque.name}`);
  }
}
```

## 📊 Verifikasi

Cek di Prisma Studio:

```bash
npm run db:studio
```

Atau query manual:

```typescript
const count = await prisma.quranHadith.count({
  where: { mosqueId: "your-mosque-id" },
});
console.log(`Jumlah konten: ${count}`); // Harus 18
```

## ✨ Fitur

- ✅ Otomatis seed saat registrasi
- ✅ Konten bilingual (Arab + Terjemahan)
- ✅ Dapat diatur urutan (sortOrder)
- ✅ Dapat diaktifkan/nonaktifkan per item
- ✅ Mudah dikustomisasi per masjid
- ✅ Type-safe dengan TypeScript
