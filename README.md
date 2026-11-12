# Personal CV & Academic Score App (SayidDev.)

Aplikasi mobile **Personal CV & Academic Score App** berbasis **React Native** dan **Expo (Expo Router)** dengan desain **Clean Dark Minimalist**, disusun untuk memenuhi proyek **Ujian Tengah Semester (UTS) Pemrograman Mobile 2** di **Universitas Ma'soem**.

---

## 1. Identitas Mahasiswa & Level Target

- **Nama Lengkap**: Sayid Abdul Aziz
- **NIM**: `242505022`
- **Program Studi**: S1 Sistem Informasi — Fakultas Komputer, Universitas Ma'soem
- **Mata Kuliah**: Pemrograman Mobile 2
- **Dosen Pengampu**: Iin, M.Kom
- **Level Target yang Diklaim**: **Level 10 — Industry (Production-Oriented Mobile Application)** *(Memenuhi seluruh persyaratan kumulatif Level 1 s/d Level 10)*

---

## 2. Pemetaan Pencapaian Progressive Challenge (Level 1 – Level 10)

| Level | Nama Level | Fokus & Implementasi pada Aplikasi |
| :--- | :--- | :--- |
| **Level 1** | **Novice** | Menampilkan NIM (`242505022`), nama lengkap (`Sayid Abdul Aziz`), dan foto profil asli (`assets/profile.jpg`) pada `ProfileHeader.jsx`. |
| **Level 2** | **Beginner** | Menampilkan profesi (`Information Systems Student`), deskripsi singkat diri, serta heading terstruktur menggunakan JSX. |
| **Level 3** | **Elementary** | Layout responsif mobile berbasis Flexbox & `StyleSheet` dengan palet **Clean Dark Minimalist** (`#090A0F` / `#12141D` / `#8B5CF6`). |
| **Level 4** | **Intermediate** | Interaksi berbasis `Props` & `State`, navigasi tombol cepat, serta **Formulir Kontak** (Nama, Email, Pesan) dengan validasi input kosong & umpan balik pengiriman di `app/contact.jsx`. |
| **Level 5** | **Competent** | Pemisahan penuh antara data dan 9 komponen UI modular di folder `components/` yang menerima data melalui `Props`. |
| **Level 6** | **Proficient** | Seluruh data CV, portofolio, dan nilai akademik disimpan dalam file JSON lokal (`data/profile.json`, `data/portfolio.json`, `data/academicScore.json`). |
| **Level 7** | **Advanced** | Mencakup seluruh 7 fitur eksplorasi + inovasi: (1) *Dynamic Skills*, (2) *Portfolio Gallery + Case Study Modal*, (3) *Hobby Section (Badminton & Lari)*, (4) *Education & Experience Timeline*, (5) *Dark/Light Theme Switcher*, (6) *Interactive Components + Live A4 CV Preview & PDF Export*, dan (7) *Live Search & Category Filter*. |
| **Level 8** | **Expert** | Halaman **My Score** (`app/score.jsx`) menampilkan Identitas Akademik, Current Score (`92 / Grade A`), Learning Points (`12375 LP`), 4 bar *Learning Progress* (`Attendance 100%`, `Practice 87%`, `Quest 95%`, `Challenge 100%`), serta *Grade Simulator*. |
| **Level 9** | **Professional** | Navigasi multi-halaman menggunakan **Expo Router Bottom Tabs** (`Home`, `Portfolio`, `My Score`, `Contact`) dengan tampilan yang konsisten. |
| **Level 10** | **Industry** | Custom hook `useSimulatedFetch.js` (simulasi pengambilan data asinkron), penanganan **Loading Skeleton**, **Error State + Retry**, & **Empty State**, persistensi lokal `AsyncStorage` (tema & riwayat pesan), **Dynamic CV PDF Generator (Format A4 2-Kolom)**, serta **12 Unit Test Jest** (`__tests__/validation.test.js`). |

---

## 3. Struktur Proyek & Arsitektur

```text
personal-cv-app/
├── assets/
│   └── profile.jpg          # Foto profil formal Sayid Abdul Aziz
├── app/
│   ├── _layout.jsx          # Konfigurasi Expo Router Bottom Tabs + Header SayidDev. + Theme Switcher
│   ├── index.jsx            # Home: Hero CV, Export CV PDF, Quick Stats, SIMTS, Research, Timeline & Hobbies
│   ├── portfolio.jsx        # Portfolio: Live Search + Tab Projects/Skills + Filter Kategori
│   ├── score.jsx            # My Score: Dashboard Nilai Level 8 + Learning Progress + Grade Simulator + Level 1-10
│   └── contact.jsx          # Contact: Info Kontak + Form Validasi + Riwayat Pesan (AsyncStorage)
├── components/
│   ├── ProfileHeader.jsx    # Hero profil minimalis 96x96 + bio + tombol navigasi & Export CV (PDF)
│   ├── CvPdfModal.jsx       # Modal Live Preview CV A4 2-Kolom + Kustomisasi Bagian + Cetak/Simpan PDF
│   ├── StatCard.jsx         # Kartu statistik ringkas (6+ Projects, 1 Journal, 7 Juz Tahfidz)
│   ├── TimelineItem.jsx     # Timeline vertikal Education & Work Experience
│   ├── ProjectCard.jsx      # Kartu proyek + Status Badge (On-Progress/Completed) + Modal Case Study
│   ├── SkillBadge.jsx       # Badge keahlian teknis & soft skills
│   ├── ScoreProgressBar.jsx # Komponen reusable indikator persentase capaian belajar
│   ├── EmptyState.jsx       # Penanganan kondisi data/pencarian kosong (Level 10)
│   └── LoadingState.jsx     # Skeleton shimmer & Error State dengan tombol Retry (Level 10)
├── context/
│   └── ThemeContext.jsx     # State global Dark/Light Mode tersimpan di AsyncStorage
├── data/
│   ├── profile.json         # Data profil, riset, pendidikan, pengalaman (bullet points), dan hobi
│   ├── portfolio.json       # Data 6 proyek (SIMTS, Quran ku, SIPEDA, dll.) & 3 grup keahlian
│   └── academicScore.json   # Data akademik Pemrograman Mobile 2 (Level 8 & daftar Level 1-10)
├── hooks/
│   └── useSimulatedFetch.js # Custom hook simulasi fetch data asinkron + Loading & Error State
├── utils/
│   ├── validation.js        # Pure functions validasi form kontak & kalkulasi nilai akademik
│   ├── cvPdfGenerator.js    # Generator dokumen HTML5/PDF CV A4 2-Kolom (Sidebar gelap #242424 & kolom putih)
│   └── cvPhotoBase64.js     # Foto profil Base64 tersemat untuk render cetak PDF A4 secara mandiri
└── __tests__/
    └── validation.test.js   # Pengujian otomatis Jest (12 test cases)
```

---

## 4. Petunjuk Menjalankan Aplikasi

1. **Instalasi dependensi**:
   ```bash
   npm install
   ```
2. **Menjalankan server pengembangan Expo**:
   ```bash
   npx expo start
   ```
   - Tekan `w` untuk membuka di Web Browser, `a` untuk Android Emulator, atau scan QR Code melalui aplikasi **Expo Go** di perangkat ponsel.
3. **Menjalankan pengujian unit (Jest)**:
   ```bash
   npm test
   ```

---

## 5. Template Deskripsi Video YouTube (Sesuai Bagian F Soal UTS)

> Salin teks di bawah ini ke kolom **Deskripsi Video YouTube** saat mengumpulkan tugas UTS:

```text
Link Source Code GitHub: https://github.com/Mienztt/UTS-PM2-SAYID

=== IDENTITAS MAHASISWA ===
Nama Lengkap : Sayid Abdul Aziz
NIM          : 242505022
Program Studi: S1 Sistem Informasi (Fakultas Komputer, Universitas Ma'soem)
Mata Kuliah  : Pemrograman Mobile 2
Dosen        : Iin, M.Kom
Level Diklaim: Level 10 — Industry (Memenuhi kumulatif Level 1 s/d Level 10)

=== PETUNJUK MENJALANKAN APLIKASI ===
1. Clone repository: git clone https://github.com/Mienztt/UTS-PM2-SAYID.git
2. Masuk ke direktori proyek: cd UTS-PM2-SAYID
3. Install dependencies: npm install
4. Jalankan aplikasi: npx expo start (tekan 'w' untuk Web atau scan QR via Expo Go)
5. Jalankan unit testing: npm test

=== DAFTAR FITUR (LEVEL 1 - LEVEL 10) ===
- Level 1–3: Hero Profil Mahasiswa (Foto Asli, Nama, NIM 242505022, Bio) dengan desain Clean Dark Minimalist.
- Level 4: Formulir Kontak Interaktif (Nama, Email, Pesan) dengan validasi input kosong & format email.
- Level 5–6: Arsitektur 8 Komponen Reusable berbasis Props & pemisahan data JSON lokal (profile.json, portfolio.json, academicScore.json).
- Level 7: Dynamic Skills, Portfolio Gallery dengan Modal Studi Kasus (SIMTS, Quran ku, SIPEDA), Hobby Section (Badminton & Lari), Education & Experience Timeline, Dark/Light Theme Switcher, serta Live Search & Category Filter.
- Level 8: Dashboard My Score (Pemrograman Mobile 2 - Dosen: Iin, M.Kom, Nilai 92 / Grade A, 12375 LP, Learning Progress Attendance 100%, Practice 87%, Quest 95%, Challenge 100%, & Grade Simulator).
- Level 9: Multi-Screen Navigation menggunakan Expo Router Bottom Tabs (Home, Portfolio, My Score, Contact).
- Level 10: Custom Hook useSimulatedFetch, penanganan Loading Skeleton, Error State (dengan tombol Retry), Empty State, penyimpanan lokal AsyncStorage, inovasi Dynamic CV PDF Generator (Format A4 2-Kolom), serta 12 Unit Test Jest.
```
