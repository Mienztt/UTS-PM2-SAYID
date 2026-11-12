import { CV_PHOTO_DATA_URI } from './cvPhotoBase64';

/**
 * Menghasilkan dokumen HTML CV A4 2-Kolom bergaya profesional sesuai template PDF
 * CV asli Sayid Abdul Aziz (Sidebar gelap #242424 di kiri & Konten putih di kanan),
 * dilengkapi pembaruan proyek (SIMTS, Quran ku, SIPEDA) dan Academic Score.
 */
export function buildCvHtmlDocument({
  profile,
  portfolio,
  academicScore,
  options = {},
}) {
  const {
    includeProjects = true,
    includeAcademicScore = true,
    includeDetailedBullets = true,
  } = options;

  const identity = profile?.identity || {};
  const fullName = (identity.nama || profile?.nama || 'SAYID ABDUL AZIZ').toUpperCase();
  const role = identity.profesi || profile?.profesi || 'Information Systems Student';
  const nim = identity.nim || profile?.nim || '242505022';
  const phone = identity.telepon || '0812-1370-6230';
  const email = identity.email || 'sayidaziz35@gmail.com';
  const location = identity.lokasi || 'Rancaekek, Kabupaten Bandung, Jawa Barat';
  const summary = identity.deskripsi || profile?.deskripsi || '';

  const educationList = profile?.education || [];
  const experienceList = profile?.experience || [];
  const projectsList = (portfolio?.projects || []).slice(0, 4);

  const allSkills = [
    'Java (OOP & Swing)',
    'Oracle Database & PL/SQL',
    'Visual Basic .NET & MySQL',
    'PHP, Laravel & FilamentPHP',
    'React Native (Expo)',
    'BPMN 2.0, UML, DFD & ERD',
    'Microsoft Office',
    'Canva Design & Figma',
    'Kerja Sama Tim',
    'Public Event Support',
  ];

  const acadSummary = academicScore?.academicSummary || {};
  const acadProgress = academicScore?.learningProgress || [];

  const educationHtml = educationList
    .map(
      (edu) => `
      <div class="edu-item">
        <div class="edu-title">${edu.program || edu.title}</div>
        ${
          edu.institution && edu.institution !== edu.program
            ? `<div class="edu-inst">${edu.institution}</div>`
            : edu.subtitle && edu.subtitle !== 'Madrasah Tsanawiyah'
              ? `<div class="edu-inst">${edu.subtitle}</div>`
              : ''
        }
        <div class="edu-period">${edu.period}</div>
      </div>`
    )
    .join('');

  const skillsHtml = allSkills
    .map((sk) => `<li>${sk}</li>`)
    .join('');

  const academicHtml = includeAcademicScore
    ? `
      <div class="sidebar-section">
        <h3 class="sidebar-heading">ACADEMIC SCORE</h3>
        <div class="sidebar-divider"></div>
        <div class="acad-box">
          <div class="acad-course">${acadSummary.courseName || 'Pemrograman Mobile 2'}</div>
          <div class="acad-Meta">Dosen: ${acadSummary.lecturer || 'Iin, M.Kom'}</div>
          <div class="acad-score-row">
            <span class="acad-score-pill">Score: ${acadSummary.currentScore || 92} (${acadSummary.grade || 'A'})</span>
            <span class="acad-lp-pill">${acadSummary.learningPointsLabel || '12375 LP'}</span>
          </div>
          <div class="acad-prog-list">
            ${acadProgress
              .map((p) => `<span>${p.label}: ${p.percentage}%</span>`)
              .join(' • ')}
          </div>
        </div>
      </div>`
    : '';

  const experienceHtml = experienceList
    .map((exp) => {
      const bullets =
        includeDetailedBullets && Array.isArray(exp.bullets) && exp.bullets.length > 0
          ? `<ul class="exp-bullets">${exp.bullets.map((b) => `<li>${b}</li>`).join('')}</ul>`
          : `<p class="exp-desc">${exp.description || ''}</p>`;

      return `
        <div class="exp-item">
          <div class="exp-top-row">
            <span class="exp-role">${exp.title}</span>
            <span class="exp-period">${exp.period}</span>
          </div>
          <div class="exp-company">${exp.subtitle}</div>
          ${bullets}
        </div>`;
    })
    .join('');

  const projectsHtml = includeProjects
    ? `
      <div class="main-section">
        <h2 class="main-heading">FEATURED PROJECTS & RESEARCH</h2>
        <div class="main-divider"></div>
        ${projectsList
          .map(
            (proj) => `
          <div class="proj-item">
            <div class="exp-top-row">
              <span class="proj-title">${proj.title}</span>
              <span class="proj-status ${proj.status === 'On-Progress' ? 'status-progress' : 'status-done'}">
                ${proj.status === 'On-Progress' ? 'On-Progress (2026)' : 'Completed'}
              </span>
            </div>
            <div class="proj-meta">
              ${proj.client ? `<strong>Instansi:</strong> ${proj.client} • ` : ''}
              <strong>Tech:</strong> ${(proj.techStack || []).join(', ')}
            </div>
            <p class="proj-desc">${proj.shortDescription}</p>
          </div>`
          )
          .join('')}
      </div>`
    : '';

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CV - ${fullName} (${nim})</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body {
      font-family: 'Poppins', 'Segoe UI', Arial, sans-serif;
      background-color: #E5E7EB;
      color: #2D2D2D;
      padding: 24px 0;
    }

    .toolbar {
      max-width: 210mm;
      margin: 0 auto 16px auto;
      background-color: #12141D;
      color: #F3F4F6;
      padding: 12px 20px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 4px 16px rgba(0,0,0,0.18);
    }

    .toolbar-title {
      font-size: 13px;
      font-weight: 600;
    }

    .toolbar-btn {
      background-color: #8B5CF6;
      color: #FFFFFF;
      border: none;
      padding: 8px 16px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 13px;
      cursor: pointer;
    }

    .page {
      width: 210mm;
      min-height: 297mm;
      margin: 0 auto;
      background-color: #FFFFFF;
      box-shadow: 0 10px 30px rgba(0,0,0,0.15);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    /* Top Header Row (Photo on Left + Name on Right) */
    .top-header {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 26px 32px 18px 26px;
    }

    .photo-col {
      width: 34%;
      display: flex;
      justify-content: center;
      align-items: center;
      padding-right: 18px;
    }

    .photo-circle {
      width: 158px;
      height: 158px;
      border-radius: 50%;
      border: 1.5px solid #4B5563;
      overflow: hidden;
      background-color: #FFFFFF;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .photo-circle img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .title-col {
      width: 66%;
      padding-left: 14px;
    }

    .cv-name {
      font-size: 32px;
      font-weight: 800;
      color: #333333;
      letter-spacing: 0.8px;
      line-height: 1.15;
      margin-bottom: 6px;
    }

    .cv-role {
      font-size: 16.5px;
      font-weight: 400;
      color: #555555;
      margin-bottom: 4px;
    }

    .cv-nim {
      font-size: 12px;
      font-weight: 600;
      color: #6B7280;
    }

    /* Main 2-Column Body */
    .cv-body {
      display: flex;
      flex-direction: row;
      flex: 1;
      padding: 0 32px 28px 26px;
    }

    /* Dark Charcoal Left Sidebar */
    .left-sidebar {
      width: 34%;
      background-color: #242424;
      color: #FFFFFF;
      padding: 24px 20px;
    }

    .sidebar-section {
      margin-bottom: 24px;
    }

    .sidebar-heading {
      font-size: 14.5px;
      font-weight: 700;
      letter-spacing: 0.6px;
      color: #FFFFFF;
      margin-bottom: 6px;
    }

    .sidebar-divider {
      height: 1px;
      background-color: #9CA3AF;
      margin-bottom: 14px;
    }

    .contact-list {
      list-style: none;
    }

    .contact-list li {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      font-size: 11.2px;
      line-height: 1.45;
      color: #E5E7EB;
      margin-bottom: 11px;
      word-break: break-word;
    }

    .contact-icon {
      font-size: 12px;
      min-width: 16px;
      text-align: center;
    }

    .edu-item {
      margin-bottom: 13px;
    }

    .edu-title {
      font-size: 12px;
      font-weight: 600;
      color: #FFFFFF;
      line-height: 1.35;
    }

    .edu-inst {
      font-size: 11px;
      color: #D1D5DB;
      line-height: 1.35;
    }

    .edu-period {
      font-size: 10.5px;
      color: #9CA3AF;
      margin-top: 1px;
    }

    .skills-list {
      padding-left: 16px;
    }

    .skills-list li {
      font-size: 11.2px;
      color: #E5E7EB;
      margin-bottom: 7px;
      line-height: 1.35;
    }

    .acad-box {
      font-size: 11px;
      color: #E5E7EB;
      line-height: 1.45;
    }

    .acad-course {
      font-weight: 700;
      color: #FFFFFF;
    }

    .acad-Meta {
      font-size: 10.5px;
      color: #D1D5DB;
      margin-bottom: 6px;
    }

    .acad-score-row {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 6px;
    }

    .acad-score-pill, .acad-lp-pill {
      background-color: #374151;
      padding: 2px 7px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 600;
      color: #FFFFFF;
    }

    .acad-prog-list {
      font-size: 9.8px;
      color: #9CA3AF;
      line-height: 1.4;
    }

    /* Right White Main Content */
    .right-main {
      width: 66%;
      padding-left: 26px;
      padding-top: 4px;
    }

    .main-section {
      margin-bottom: 20px;
    }

    .main-heading {
      font-size: 15px;
      font-weight: 700;
      color: #2D2D2D;
      letter-spacing: 0.4px;
      margin-bottom: 6px;
    }

    .main-divider {
      height: 1px;
      background-color: #4B5563;
      margin-bottom: 12px;
    }

    .summary-text {
      font-size: 11.3px;
      line-height: 1.62;
      color: #4B5563;
      text-align: justify;
    }

    .exp-item {
      margin-bottom: 13px;
    }

    .exp-top-row {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 8px;
    }

    .exp-role {
      font-size: 12px;
      font-weight: 500;
      color: #374151;
    }

    .exp-period {
      font-size: 11.5px;
      font-weight: 500;
      color: #374151;
      white-space: nowrap;
    }

    .exp-company {
      font-size: 12px;
      font-weight: 700;
      color: #1F2937;
      margin-bottom: 4px;
    }

    .exp-bullets {
      padding-left: 16px;
    }

    .exp-bullets li {
      font-size: 11px;
      line-height: 1.5;
      color: #4B5563;
      margin-bottom: 2px;
    }

    .exp-desc {
      font-size: 11px;
      line-height: 1.5;
      color: #4B5563;
    }

    .proj-item {
      margin-bottom: 10px;
    }

    .proj-title {
      font-size: 11.5px;
      font-weight: 700;
      color: #1F2937;
    }

    .proj-status {
      font-size: 9.5px;
      font-weight: 600;
      padding: 1px 6px;
      border-radius: 4px;
      white-space: nowrap;
    }

    .status-progress {
      background-color: #FEF3C7;
      color: #B45309;
    }

    .status-done {
      background-color: #D1FAE5;
      color: #047857;
    }

    .proj-meta {
      font-size: 10.2px;
      color: #4B5563;
      margin-bottom: 2px;
    }

    .proj-desc {
      font-size: 10.6px;
      line-height: 1.45;
      color: #4B5563;
    }

    @page {
      size: A4;
      margin: 0;
    }

    @media print {
      body {
        background-color: #FFFFFF;
        padding: 0;
      }
      .no-print {
        display: none !important;
      }
      .page {
        box-shadow: none;
        width: 210mm;
        min-height: 297mm;
        margin: 0;
      }
    }
  </style>
</head>
<body>
  <div class="toolbar no-print">
    <span class="toolbar-title">📄 Pratinjau Cetak CV A4 — ${fullName} (NIM ${nim})</span>
    <button class="toolbar-btn" onclick="window.print()">🖨️ Cetak / Simpan sebagai PDF</button>
  </div>

  <div class="page">
    <div class="top-header">
      <div class="photo-col">
        <div class="photo-circle">
          <img src="${CV_PHOTO_DATA_URI}" alt="${fullName}" />
        </div>
      </div>
      <div class="title-col">
        <h1 class="cv-name">${fullName}</h1>
        <div class="cv-role">${role}</div>
        <div class="cv-nim">NIM: ${nim} • S1 Sistem Informasi Universitas Ma'soem</div>
      </div>
    </div>

    <div class="cv-body">
      <div class="left-sidebar">
        <div class="sidebar-section">
          <h3 class="sidebar-heading">CONTACT</h3>
          <div class="sidebar-divider"></div>
          <ul class="contact-list">
            <li><span class="contact-icon">📞</span><span>${phone}</span></li>
            <li><span class="contact-icon">✉️</span><span>${email}</span></li>
            <li><span class="contact-icon">💻</span><span>NIM ${nim} • github.com/Mienztt</span></li>
            <li><span class="contact-icon">📍</span><span>${location}</span></li>
          </ul>
        </div>

        <div class="sidebar-section">
          <h3 class="sidebar-heading">EDUCATION</h3>
          <div class="sidebar-divider"></div>
          ${educationHtml}
        </div>

        <div class="sidebar-section">
          <h3 class="sidebar-heading">SKILLS</h3>
          <div class="sidebar-divider"></div>
          <ul class="skills-list">
            ${skillsHtml}
          </ul>
        </div>

        ${academicHtml}
      </div>

      <div class="right-main">
        <div class="main-section">
          <h2 class="main-heading">PROFILE SUMMARY</h2>
          <div class="main-divider"></div>
          <p class="summary-text">${summary}</p>
        </div>

        <div class="main-section">
          <h2 class="main-heading">WORK EXPERIENCE</h2>
          <div class="main-divider"></div>
          ${experienceHtml}
        </div>

        ${projectsHtml}
      </div>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Mengekspor / mencetak CV ke PDF (pada Web membuka jendela cetak A4 & memicu Save as PDF,
 * pada perangkat Mobile membuka dialog Share ringkasan CV).
 */
export async function exportCvToPdf({
  profile,
  portfolio,
  academicScore,
  options = {},
}) {
  const html = buildCvHtmlDocument({
    profile,
    portfolio,
    academicScore,
    options,
  });

  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(html);
      printWindow.document.close();
      setTimeout(() => {
        try {
          printWindow.focus();
          printWindow.print();
        } catch {
          // Biarkan pengguna menekan tombol Cetak di halaman pratinjau
        }
      }, 350);
      return { success: true, mode: 'print-window' };
    }

    // Fallback menggunakan iframe tersembunyi apabila popup diblokir browser
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(html);
      doc.close();
      setTimeout(() => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 2000);
      }, 350);
      return { success: true, mode: 'print-iframe' };
    }
  }

  // Fallback untuk perangkat mobile (Expo Go Android/iOS) menggunakan Share API
  const identity = profile?.identity || {};
  const shareMessage = [
    `CURRICULUM VITAE — ${(identity.nama || 'SAYID ABDUL AZIZ').toUpperCase()}`,
    `${identity.profesi || 'Information Systems Student'} | NIM: ${identity.nim || '242505022'}`,
    `Kontak: ${identity.telepon || '0812-1370-6230'} | ${identity.email || 'sayidaziz35@gmail.com'}`,
    '',
    'PROFILE SUMMARY:',
    identity.deskripsi || '',
    '',
    'FEATURED PROJECTS:',
    ...(portfolio?.projects || [])
      .slice(0, 4)
      .map((p) => `- ${p.title} (${p.status})`),
  ].join('\n');

  try {
    const { Share } = require('react-native');
    await Share.share({
      title: `CV_${identity.nama || 'Sayid_Abdul_Aziz'}.pdf`,
      message: shareMessage,
    });
  } catch {
    // Abaikan jika dijalankan di lingkungan non-browser/test
  }

  return { success: true, mode: 'mobile-share' };
}
