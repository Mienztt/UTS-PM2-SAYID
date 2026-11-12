import {
  isValidEmail,
  validateContactForm,
  calculateCourseFinalScore,
  getGradeInfo,
  calculateAcademicMetrics,
} from '../utils/validation';
import { buildCvHtmlDocument } from '../utils/cvPdfGenerator';
import profileJson from '../data/profile.json';
import portfolioJson from '../data/portfolio.json';
import academicScoreJson from '../data/academicScore.json';

describe('Unit Testing — Form Validation, Academic Score & UTS JSON Schema', () => {
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

  describe('4. Verifikasi Struktur Data JSON Lokal (Syarat Level 6, 7, 8 & 10)', () => {
    test('profile.json memuat identitas mahasiswa, timeline, dan hobi yang valid', () => {
      expect(profileJson.identity.nama).toBe('Sayid Abdul Aziz');
      expect(profileJson.identity.nim).toBe('242505022');
      expect(profileJson.education.length).toBeGreaterThanOrEqual(4);
      expect(profileJson.experience.length).toBeGreaterThanOrEqual(4);
      expect(profileJson.hobbies.length).toBeGreaterThanOrEqual(2);
    });

    test('portfolio.json memuat daftar proyek dengan status dan grup keahlian', () => {
      expect(portfolioJson.projects.length).toBeGreaterThanOrEqual(6);
      expect(portfolioJson.projects[0].id).toBe('proj-simts');
      expect(portfolioJson.projects[0].status).toBe('On-Progress');
      expect(portfolioJson.skillGroups.length).toBeGreaterThanOrEqual(3);
    });

    test('academicScore.json memuat seluruh field wajib Level 8 & 10 Level Challenge', () => {
      const { academicSummary, learningProgress, challengeLevels } = academicScoreJson;
      expect(academicSummary.studentName).toBe('Sayid Abdul Aziz');
      expect(academicSummary.nim).toBe('242505022');
      expect(academicSummary.courseName).toBe('Pemrograman Mobile 2');
      expect(academicSummary.lecturer).toBe('Iin, M.Kom');
      expect(academicSummary.grade).toBe('A');
      expect(academicSummary.learningPoints).toBe(12375);
      expect(learningProgress).toHaveLength(4);
      expect(challengeLevels).toHaveLength(10);
    });

    test('buildCvHtmlDocument menghasilkan dokumen HTML CV A4 sesuai data mahasiswa', () => {
      const html = buildCvHtmlDocument({
        profile: profileJson,
        portfolio: portfolioJson,
        academicScore: academicScoreJson,
        options: {
          includeProjects: true,
          includeAcademicScore: true,
          includeDetailedBullets: true,
        },
      });

      expect(html).toContain('SAYID ABDUL AZIZ');
      expect(html).toContain('242505022');
      expect(html).toContain('PROFILE SUMMARY');
      expect(html).toContain('WORK EXPERIENCE');
      expect(html).toContain('FEATURED PROJECTS & RESEARCH');
      expect(html).toContain('SIMTS');
    });
  });
});
