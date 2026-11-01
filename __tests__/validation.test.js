import {
  isValidEmail,
  validateContactForm,
  validateGuestbookForm,
  calculateCourseFinalScore,
  getGradeInfo,
  calculateAcademicMetrics,
} from '../utils/validation';

describe('Unit Testing Level 10 — Form Validation & Academic Score Calculation', () => {
  describe('1. Validasi Format Email (isValidEmail)', () => {
    test('menerima alamat email yang valid', () => {
      expect(isValidEmail('sayid.aziz@masoemuniversity.ac.id')).toBe(true);
      expect(isValidEmail('  developer@alfari.my.id  ')).toBe(true);
    });

    test('menolak alamat email kosong atau format salah', () => {
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail('bukan-email')).toBe(false);
      expect(isValidEmail('user@domain')).toBe(false);
      expect(isValidEmail('@domain.com')).toBe(false);
    });
  });

  describe('2. Validasi Contact Form (validateContactForm)', () => {
    test('lolos validasi ketika seluruh field memenuhi syarat', () => {
      const result = validateContactForm({
        name: 'Sayid Abdul Aziz',
        email: 'sayid@example.com',
        subject: 'Tawaran Kolaborasi Proyek Mobile',
        message: 'Halo, saya tertarik mendiskusikan pengembangan aplikasi Expo bersama Anda.',
      });

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    test('mengembalikan pesan error spesifik saat field kosong atau terlalu pendek', () => {
      const result = validateContactForm({
        name: 'A',
        email: 'email-salah',
        subject: 'Hi',
        message: 'Pendek',
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.name).toBeDefined();
      expect(result.errors.email).toBeDefined();
      expect(result.errors.subject).toBeDefined();
      expect(result.errors.message).toBeDefined();
    });
  });

  describe('3. Validasi Live Guestbook Form (validateGuestbookForm)', () => {
    test('menerima entri guestbook yang valid', () => {
      const result = validateGuestbookForm({
        author: 'Dosen Penguji',
        role: 'Dosen Pemrograman Mobile 2',
        comment: 'Desain Dark Mode dan struktur arsitekturnya sangat rapi!',
        rating: 5,
      });

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    test('menolak komentar kosong dan rating di luar rentang 1-5', () => {
      const result = validateGuestbookForm({
        author: '',
        comment: 'Ok',
        rating: 7,
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.author).toBeDefined();
      expect(result.errors.comment).toBeDefined();
      expect(result.errors.rating).toBeDefined();
    });
  });

  describe('4. Kalkulasi Nilai Akademik & IPK (Level 8 & Level 10)', () => {
    test('menghitung nilai akhir mata kuliah sesuai bobot 30% Tugas, 35% UTS, 35% UAS', () => {
      // 90 * 0.3 (27) + 80 * 0.35 (28) + 100 * 0.35 (35) = 90.0
      const score = calculateCourseFinalScore({ tugas: 90, uts: 80, uas: 100 });
      expect(score).toBe(90);
    });

    test('mengonversi nilai angka ke huruf mutu dan bobot dengan akurat', () => {
      expect(getGradeInfo(92)).toEqual({
        grade: 'A',
        point: 4.0,
        predicate: 'Sangat Istimewa',
      });
      expect(getGradeInfo(82)).toEqual({
        grade: 'A-',
        point: 3.7,
        predicate: 'Istimewa',
      });
      expect(getGradeInfo(76)).toEqual({
        grade: 'B+',
        point: 3.3,
        predicate: 'Baik Sekali',
      });
      expect(getGradeInfo(40).grade).toBe('E');
    });

    test('menghitung IPK kumulatif dan total SKS secara tepat', () => {
      const sampleCourses = [
        { code: 'SI502', name: 'Pemrograman Mobile 2', sks: 3, tugas: 92, uts: 92, uas: 92 }, // A -> 4.0 * 3 = 12.0
        { code: 'SI405', name: 'Manajemen Basis Data', sks: 3, tugas: 72, uts: 72, uas: 72 }, // B -> 3.0 * 3 = 9.0
      ];

      const metrics = calculateAcademicMetrics(sampleCourses);
      expect(metrics.totalSks).toBe(6);
      // (12.0 + 9.0) / 6 = 3.50
      expect(metrics.gpa).toBe(3.5);
      expect(metrics.enrichedCourses).toHaveLength(2);
      expect(metrics.enrichedCourses[0].grade).toBe('A');
      expect(metrics.enrichedCourses[1].grade).toBe('B');
    });

    test('menangani daftar mata kuliah kosong dengan aman tanpa NaN', () => {
      const metrics = calculateAcademicMetrics([]);
      expect(metrics.gpa).toBe(0);
      expect(metrics.totalSks).toBe(0);
      expect(metrics.averageScore).toBe(0);
    });
  });
});
