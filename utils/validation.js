/**
 * Utility module untuk validasi form interaktif & kalkulasi nilai akademik.
 * Dipisahkan secara murni (pure functions) untuk memenuhi arsitektur Clean Code (Level 9)
 * dan mendukung pengujian unit otomatis menggunakan Jest (Level 10).
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Membersihkan spasi berlebih pada awal dan akhir teks.
 * @param {unknown} value
 * @returns {string}
 */
export function sanitizeText(value) {
  if (typeof value !== 'string') return '';
  return value.trim();
}

/**
 * Memeriksa apakah format alamat email valid.
 * @param {string} email
 * @returns {boolean}
 */
export function isValidEmail(email) {
  const cleaned = sanitizeText(email);
  if (!cleaned || cleaned.length > 120) return false;
  return EMAIL_REGEX.test(cleaned);
}

/**
 * Validasi input Contact Form (Nama, Email, Subjek, Pesan).
 * @param {{ name?: string, email?: string, subject?: string, message?: string }} payload
 * @returns {{ isValid: boolean, errors: Record<string, string> }}
 */
export function validateContactForm(payload = {}) {
  const errors = {};
  const name = sanitizeText(payload.name);
  const email = sanitizeText(payload.email);
  const subject = sanitizeText(payload.subject);
  const message = sanitizeText(payload.message);

  if (!name) {
    errors.name = 'Nama lengkap wajib diisi.';
  } else if (name.length < 2) {
    errors.name = 'Nama minimal terdiri dari 2 karakter.';
  } else if (name.length > 80) {
    errors.name = 'Nama maksimal 80 karakter.';
  }

  if (!email) {
    errors.email = 'Alamat email wajib diisi.';
  } else if (!isValidEmail(email)) {
    errors.email = 'Format email tidak valid (contoh: nama@domain.com).';
  }

  if (!subject) {
    errors.subject = 'Subjek pesan wajib diisi.';
  } else if (subject.length < 3) {
    errors.subject = 'Subjek minimal terdiri dari 3 karakter.';
  }

  if (!message) {
    errors.message = 'Isi pesan tidak boleh kosong.';
  } else if (message.length < 10) {
    errors.message = 'Pesan minimal terdiri dari 10 karakter agar jelas.';
  } else if (message.length > 500) {
    errors.message = 'Pesan maksimal 500 karakter.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validasi input Live Guestbook / Komentar lokal (Level 4 & 10).
 * @param {{ author?: string, role?: string, comment?: string, rating?: number }} payload
 * @returns {{ isValid: boolean, errors: Record<string, string> }}
 */
export function validateGuestbookForm(payload = {}) {
  const errors = {};
  const author = sanitizeText(payload.author);
  const comment = sanitizeText(payload.comment);
  const rating = payload.rating === undefined ? 5 : Number(payload.rating);

  if (!author) {
    errors.author = 'Nama pengirim wajib diisi.';
  } else if (author.length < 2) {
    errors.author = 'Nama pengirim minimal 2 karakter.';
  } else if (author.length > 60) {
    errors.author = 'Nama pengirim maksimal 60 karakter.';
  }

  if (!comment) {
    errors.comment = 'Komentar guestbook tidak boleh kosong.';
  } else if (comment.length < 5) {
    errors.comment = 'Komentar minimal 5 karakter.';
  } else if (comment.length > 280) {
    errors.comment = 'Komentar maksimal 280 karakter.';
  }

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    errors.rating = 'Rating harus berupa angka bulat antara 1 hingga 5.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Membatasi nilai angka pada rentang [0, 100].
 * @param {number|string} score
 * @returns {number}
 */
export function clampScore(score) {
  const numeric = Number(score);
  if (Number.isNaN(numeric)) return 0;
  if (numeric < 0) return 0;
  if (numeric > 100) return 100;
  return numeric;
}

/**
 * Menghitung nilai akhir mata kuliah berdasarkan bobot Tugas, UTS, dan UAS.
 * Default bobot: Tugas 30%, UTS 35%, UAS 35%.
 * @param {{ tugas: number|string, uts: number|string, uas: number|string }} scores
 * @param {{ tugas?: number, uts?: number, uas?: number }} weights
 * @returns {number}
 */
export function calculateCourseFinalScore(
  scores = { tugas: 0, uts: 0, uas: 0 },
  weights = { tugas: 0.3, uts: 0.35, uas: 0.35 }
) {
  const tugas = clampScore(scores.tugas);
  const uts = clampScore(scores.uts);
  const uas = clampScore(scores.uas);

  const wTugas = typeof weights.tugas === 'number' ? weights.tugas : 0.3;
  const wUts = typeof weights.uts === 'number' ? weights.uts : 0.35;
  const wUas = typeof weights.uas === 'number' ? weights.uas : 0.35;

  const raw = tugas * wTugas + uts * wUts + uas * wUas;
  return Math.round(raw * 10) / 10;
}

/**
 * Mengonversi nilai angka (0-100) menjadi huruf mutu, bobot IP, dan predikat.
 * @param {number} finalScore
 * @returns {{ grade: string, point: number, predicate: string }}
 */
export function getGradeInfo(finalScore) {
  const score = clampScore(finalScore);
  if (score >= 85) return { grade: 'A', point: 4.0, predicate: 'Sangat Istimewa' };
  if (score >= 80) return { grade: 'A-', point: 3.7, predicate: 'Istimewa' };
  if (score >= 75) return { grade: 'B+', point: 3.3, predicate: 'Baik Sekali' };
  if (score >= 70) return { grade: 'B', point: 3.0, predicate: 'Baik' };
  if (score >= 65) return { grade: 'C+', point: 2.5, predicate: 'Cukup Baik' };
  if (score >= 55) return { grade: 'C', point: 2.0, predicate: 'Cukup' };
  if (score >= 45) return { grade: 'D', point: 1.0, predicate: 'Kurang' };
  return { grade: 'E', point: 0.0, predicate: 'Belum Lulus' };
}

/**
 * Menghitung IPK/IPS, total SKS, rata-rata skor, dan daftar mata kuliah lengkap dengan nilai akhirnya.
 * @param {Array<{ id?: string, code?: string, name?: string, sks: number, tugas: number, uts: number, uas: number }>} courses
 * @returns {{
 *   gpa: number,
 *   totalSks: number,
 *   averageScore: number,
 *   enrichedCourses: Array<object>
 * }}
 */
export function calculateAcademicMetrics(courses = []) {
  if (!Array.isArray(courses) || courses.length === 0) {
    return {
      gpa: 0,
      totalSks: 0,
      averageScore: 0,
      enrichedCourses: [],
    };
  }

  let totalSks = 0;
  let totalQualityPoints = 0;
  let totalScoreSum = 0;

  const enrichedCourses = courses.map((course) => {
    const sks = Math.max(0, Number(course.sks) || 0);
    const finalScore =
      typeof course.finalScore === 'number'
        ? clampScore(course.finalScore)
        : calculateCourseFinalScore(course);
    const gradeInfo = getGradeInfo(finalScore);

    totalSks += sks;
    totalQualityPoints += sks * gradeInfo.point;
    totalScoreSum += finalScore;

    return {
      ...course,
      sks,
      finalScore,
      grade: gradeInfo.grade,
      gradePoint: gradeInfo.point,
      predicate: gradeInfo.predicate,
    };
  });

  const gpa = totalSks > 0 ? Math.round((totalQualityPoints / totalSks) * 100) / 100 : 0;
  const averageScore = Math.round((totalScoreSum / enrichedCourses.length) * 10) / 10;

  return {
    gpa,
    totalSks,
    averageScore,
    enrichedCourses,
  };
}
