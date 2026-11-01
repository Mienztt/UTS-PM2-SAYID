# Personal CV & Academic Score App (SayidDev.)

Aplikasi mobile portofolio **Clean Dark Minimalist** dan dashboard capaian akademik berbasis **React Native** & **Expo (Expo Router)**.

---

## 1. Identitas Mahasiswa & CV Asli

- **Nama Lengkap**: Sayid Abdul Aziz
- **NIM**: `242505022`
- **Profesi**: Information Systems Student
- **Kampus**: S1 Sistem Informasi, Fakultas Komputer — Universitas Ma'soem (`2023 – Sekarang`)
- **Lokasi**: Rancaekek, Kabupaten Bandung, Jawa Barat
- **Email**: `sayidaziz35@gmail.com`
- **Telepon / WhatsApp**: `0812-1370-6230`
- **Mata Kuliah**: Pemrograman Mobile 2 (`Dosen: Iin, M.Kom`)
- **Capaian Akademik**: Current Score **92 (Grade A)** • **12375 LP**
  - Attendance: `100%` | Practice: `87%` | Quest: `95%` | Challenge: `100%`

---

## 2. Sistem Desain Clean Dark Minimalist

| Elemen Desain | Spesifikasi Nilai |
| :--- | :--- |
| **Background Layar** | `#090A0F` *(Hitam pekat elegan)* |
| **Background Kartu (Surface)** | `#12141D` dengan border tipis `#1E2230` (`borderWidth: 1`, `borderRadius: 16`, `padding: 18`) |
| **Aksen Utama** | `#8B5CF6` *(Soft Violet)* untuk tombol utama, tab aktif, dan teks highlight |
| **Teks Utama & Sub** | `#F3F4F6` *(Putih bersih)* & `#9CA3AF` *(Abu-abu nyaman dibaca, `lineHeight: 22`)* |
| **Foto Profil** | `assets/profile.jpg` (`96x96` bulat rapi dengan border tipis `#8B5CF6`) |

---

## 3. Struktur Proyek

```text
personal-cv-app/
├── assets/
│   └── profile.jpg          # Foto profil formal (ganti dengan foto CV asli Anda)
├── app/
│   ├── _layout.jsx          # Header SayidDev. + Theme Toggle + Bottom Tabs
│   ├── index.jsx            # Home: Hero CV, Quick Stats, What I Do, Currently Working On (SIMTS), Research, Education & Experience
│   ├── portfolio.jsx        # Portfolio: Search bar + 2 Tab bersih (Projects & Skills)
│   ├── score.jsx            # My Score: Kartu identitas & nilai Level 8 minimalis + Learning Progress
│   └── contact.jsx          # Contact: Info kontak asli + Form Kirim Pesan + Daftar Pesan Tersimpan
├── components/
│   ├── ProfileHeader.jsx    # Hero profil minimalis 96x96 + bio + 2 tombol bersih
│   ├── StatCard.jsx         # Kartu statistik ringkas (6+ Projects, 1 Journal, 7 Juz Tahfidz)
│   ├── TimelineItem.jsx     # Timeline vertikal minimalis untuk Education & Experience
│   ├── ProjectCard.jsx      # Kartu proyek + Status Badge (On-Progress / Completed) + Modal "Case Study Detail"
│   ├── SkillBadge.jsx       # Pill/Badge keahlian minimalis
│   ├── ScoreProgressBar.jsx # Progress bar satu warna aksen (#8B5CF6)
│   ├── EmptyState.jsx       # Kondisi kosong minimalis
│   └── LoadingState.jsx     # Skeleton shimmer & Error Retry state
├── context/
│   └── ThemeContext.jsx     # Palet Clean Dark Minimalist (#090A0F / #12141D / #8B5CF6)
├── data/
│   ├── profile.json         # Data CV asli Sayid Abdul Aziz + Currently Working On (SIMTS) + Publikasi Riset
│   ├── portfolio.json       # Data 6 proyek (SIMTS On-Progress, Quran ku, SIPEDA, dll) & 3 grup keahlian
│   └── academicScore.json   # Data nilai Pemrograman Mobile 2 (Level 8)
├── hooks/
│   └── useSimulatedFetch.js # Custom hook pengambilan data JSON asinkron
├── utils/
│   └── validation.js        # Pure functions validasi form & kalkulasi akademik
└── __tests__/
    └── validation.test.js   # Unit testing Jest
```

---

## 4. Menjalankan Aplikasi & Pengujian

```bash
npm install
npx expo start
npm test
```
