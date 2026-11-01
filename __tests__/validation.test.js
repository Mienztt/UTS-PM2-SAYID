import {
  isValidEmail,
  validateContactForm,
  calculateCourseFinalScore,
  getGradeInfo,
  calculateAcademicMetrics,
} from '../utils/validation';

describe('Unit Testing — Form Validation & Academic Score Calculation', () => {
  describe('1. Validasi Format Email (isValidEmail)', () => {
    test('menerima alamat email yang valid', () => {
      expect(isValidEmail('sayidaziz35@gmail.com')).toBe(true);
      expect(isValidEmail('  contact@alfari.my.id  ')).toBe(true);
    });

    test('menolak alamat email kosong atau format salah', () => {
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail('bukan-email')).toBe(false);
      expect(isValidEmail('user@domain')).toBe(false);
      expect(isValidEmail('@domain.com')).toBe(false);
    });
  });

  describe('2. Validasi Contact Form (validateContactForm)', () => {
    test('lolos validasi ketika Nama, Email, dan Pesan memenuhi syarat', () => {
      const result = validateContactForm({
        name: 'Sayid Abdul Aziz',
        email: 'sayidaziz35@gmail.com',
        message: 'Halo, saya ingin berdiskusi mengenai proyek pengembangan web.',
      });

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    test('mengembalikan pesan error spesifik saat field kosong atau terlalu pendek', () => {
      const result = validateContactForm({
        name: 'A',
        email: 'email-salah',
        message: 'Halo',
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.name).toBeDefined();
      expect(result.errors.email).toBeDefined();
      expect(result.errors.message).toBeDefined();
    });
  });

  describe('3. Kalkulasi Nilai Akademik & IPK', () => {
    test('menghitung nilai akhir mata kuliah sesuai bobot 30% Tugas, 35% UTS, 35% UAS', () => {
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
        { code: 'SI502', name: 'Pemrograman Mobile 2', sks: 3, tugas: 92, uts: 92, uas: 92 },
        { code: 'SI405', name: 'Manajemen Basis Data', sks: 3, tugas: 72, uts: 72, uas: 72 },
      ];

      const metrics = calculateAcademicMetrics(sampleCourses);
      expect(metrics.totalSks).toBe(6);
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
