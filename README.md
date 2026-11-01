# Personal CV & Academic Score App (SayidDev.)

Aplikasi mobile portofolio **Cyber-Glassmorphism** dan dashboard evaluasi akademik berbasis **React Native** & **Expo (Expo Router)**. Dibangun untuk memenuhi proyek **Ujian Tengah Semester (UTS) Mata Kuliah Pemrograman Mobile 2** dengan pencapaian penuh **Level 1 hingga Level 10 (Industry Standard)**.

---

## 1. Identitas Mahasiswa & Akademik

- **Nama Lengkap**: Sayid Abdul Aziz
- **NIM**: `2425050522`
- **Program Studi / Kampus**: S1 Sistem Informasi - Semester 5 | Universitas Ma'soem
- **Role**: Information Systems Student & Full-Stack Developer
- **Mata Kuliah**: Pemrograman Mobile 2
- **Dosen Pengampu**: Iin, M.Kom
- **Capaian Akademik**: Current Score **92 (Grade A)** • **12375 LP**
  - Attendance: `100%` | Practice: `87%` | Quest: `95%` | Challenge: `100%`

---

## 2. Sistem Desain Cyber-Glassmorphism (Terinspirasi [alfari.my.id](https://www.alfari.my.id/))

| Elemen Desain | Spesifikasi Nilai |
| :--- | :--- |
| **Main Background** | `#030014` *(Deep Space Indigo/Black)* + dukungan **Light Mode** persisten |
| **Glass Card Surface** | `rgba(17, 25, 40, 0.78)` dengan `borderWidth: 1` & `borderColor: 'rgba(255, 255, 255, 0.12)'` |
| **Primary Gradient** | `LinearGradient` dari `#6366F1` *(Indigo)* ke `#A855F7` *(Purple)* & aksen `#38BDF8` *(Sky Cyan)* |
| **Avatar Ring Gradient** | `LinearGradient` bulat dari `#6366F1` ke `#EC4899` |
| **Score Card Gradient** | `LinearGradient` dari `#1E1B4B` ke `#311042` |
| **Glow / Shadow Effect** | `shadowColor: '#8B5CF6'`, `shadowOpacity: 0.25`, `shadowRadius: 12`, `elevation: 6` |

---

## 3. Struktur Arsitektur Proyek (Level 5, 6, 9, 10)

```text
personal-cv-app/
├── app/
│   ├── _layout.jsx          # Header Brand SayidDev. + Theme Toggle + Bottom Tab Navigation
│   ├── index.jsx            # Home: Hero Cyber-Glass, 3 Bento Stats, Timeline Ma'soem/KSI, Spotify NgodingTime & Hobby
│   ├── portfolio.jsx        # Portfolio: Gradient Segmented Pill Tabs (Projects, Tech Stack, Achievements) + Live Search
│   ├── score.jsx            # My Score: Glass Identity Card, Score 92/A (12375 LP), 4 Neon Learning Progress Bars & Simulator
│   └── contact.jsx          # Contact: Form focus border #A855F7, Find Me (IG, TikTok, GitHub) & AsyncStorage Live Guestbook
├── components/
│   ├── ProfileHeader.jsx    # Hero section props-driven dengan Glowing Pill Badge & Dual Action Buttons
│   ├── StatCard.jsx         # Kartu Bento Row (4+ Projects, 10+ Tech Stack, 3+ Roles)
│   ├── TimelineItem.jsx     # Timeline vertikal bergaris #6366F1 untuk Education & Experience
│   ├── ProjectCard.jsx      # Kartu projek ber-header banner LinearGradient + tombol "Details ↗" & Modal
│   ├── SkillBadge.jsx       # Kartu skill dinamis dengan bar bergradasi neon
│   ├── ScoreProgressBar.jsx # Bar persentase berujung bulat dengan gradasi warna neon
│   ├── EmptyState.jsx       # Penanganan kondisi kosong saat hasil pencarian tidak ditemukan
│   └── LoadingState.jsx     # Skeleton shimmer & Error state dengan tombol Retry
├── context/
│   └── ThemeContext.jsx     # State global Cyber-Glass Dark/Light Mode + AsyncStorage persistence
├── hooks/
│   └── useSimulatedFetch.js # Custom hook async data fetching + loading, refresh, & error retry
├── data/
│   ├── profile.json         # Data identitas Sayid Abdul Aziz, Bento stats, timeline, Spotify, & hobi
│   ├── portfolio.json       # Data projects, tech stack, dan achievements
│   └── academicScore.json   # Data nilai Pemrograman Mobile 2 (Ibu Iin, M.Kom), 12375 LP, & Level 1-10
├── utils/
│   └── validation.js        # Pure functions validasi form & kalkulasi skor akademik
├── __tests__/
│   └── validation.test.js   # Unit testing Jest (10/10 test cases)
└── README.md                # Dokumentasi lengkap aplikasi
```

---

## 4. Cara Menjalankan Aplikasi & Unit Testing

```bash
# 1. Masuk ke folder proyek
cd personal-cv-app

# 2. Instal dependensi (termasuk expo-linear-gradient)
npm install

# 3. Jalankan aplikasi Expo
npx expo start

# 4. Jalankan pengujian unit otomatis (Jest - Level 10)
npm test
```
