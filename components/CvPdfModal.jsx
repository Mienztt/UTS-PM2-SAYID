import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { exportCvToPdf } from '../utils/cvPdfGenerator';
import { CV_PHOTO_DATA_URI } from '../utils/cvPhotoBase64';

/**
 * CvPdfModal — Inovasi fitur "Live A4 CV Preview & PDF Generator".
 * Menampilkan pratinjau langsung CV 2-kolom sesuai format PDF asli Sayid Abdul Aziz
 * (Foto bulat di kiri atas, Sidebar gelap #242424 berisi Contact/Education/Skills,
 * dan Kolom utama putih berisi Profile Summary, Work Experience, & Projects),
 * lengkap dengan opsi kustomisasi seksi dan tombol Cetak/Download PDF A4.
 */
export default function CvPdfModal({
  visible,
  onClose,
  profile,
  portfolio,
  academicScore,
}) {
  const { colors } = useTheme();
  const [includeProjects, setIncludeProjects] = useState(true);
  const [includeAcademicScore, setIncludeAcademicScore] = useState(true);
  const [includeDetailedBullets, setIncludeDetailedBullets] = useState(true);
  const [exportFeedback, setExportFeedback] = useState(null);

  if (!profile) return null;

  const identity = profile.identity || {};
  const educationList = profile.education || [];
  const experienceList = profile.experience || [];
  const projectsList = (portfolio?.projects || []).slice(0, 4);
  const acadSummary = academicScore?.academicSummary || {};

  const sidebarSkills = [
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

  const handleGeneratePdf = async () => {
    try {
      await exportCvToPdf({
        profile,
        portfolio,
        academicScore,
        options: {
          includeProjects,
          includeAcademicScore,
          includeDetailedBullets,
        },
      });
      setExportFeedback(
        'Dokumen CV A4 berhasil disiapkan! Pilih "Save as PDF" pada jendela cetak.'
      );
      setTimeout(() => setExportFeedback(null), 4000);
    } catch {
      setExportFeedback('Gagal membuka pratinjau cetak PDF.');
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <Pressable
        style={[styles.backdrop, { backgroundColor: colors.overlay }]}
        onPress={onClose}
      >
        <Pressable
          style={[
            styles.modalCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Top Bar */}
          <View
            style={[
              styles.modalHeader,
              { borderBottomColor: colors.border },
            ]}
          >
            <View style={styles.headerTitleCol}>
              <Text style={[styles.headerBadge, { color: colors.primary }]}>
                INOVASI FITUR • DYNAMIC CV GENERATOR
              </Text>
              <Text style={[styles.headerTitle, { color: colors.text }]}>
                Live A4 CV Preview & Export PDF
              </Text>
            </View>

            <TouchableOpacity
              onPress={onClose}
              style={[
                styles.closeBtn,
                {
                  backgroundColor: colors.surfaceElevated,
                  borderColor: colors.border,
                },
              ]}
            >
              <Ionicons name="close" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollBody}
          >
            {/* Opsi Kustomisasi Isi PDF */}
            <Text
              style={[styles.optionsCaption, { color: colors.textSecondary }]}
            >
              Sesuaikan bagian yang ingin disertakan ke dalam PDF CV:
            </Text>

            <View style={styles.toggleRow}>
              {[
                {
                  id: 'proj',
                  label: 'Proyek & Riset (SIMTS/SIPEDA)',
                  active: includeProjects,
                  onToggle: () => setIncludeProjects((p) => !p),
                },
                {
                  id: 'acad',
                  label: 'Academic Score (92/A)',
                  active: includeAcademicScore,
                  onToggle: () => setIncludeAcademicScore((p) => !p),
                },
                {
                  id: 'bullets',
                  label: 'Detail Pengalaman',
                  active: includeDetailedBullets,
                  onToggle: () => setIncludeDetailedBullets((p) => !p),
                },
              ].map((opt) => (
                <TouchableOpacity
                  key={opt.id}
                  activeOpacity={0.8}
                  onPress={opt.onToggle}
                  style={[
                    styles.toggleChip,
                    {
                      backgroundColor: opt.active
                        ? colors.accentSoft
                        : colors.surfaceElevated,
                      borderColor: opt.active ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <Ionicons
                    name={opt.active ? 'checkbox' : 'square-outline'}
                    size={13}
                    color={opt.active ? colors.primary : colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.toggleChipText,
                      {
                        color: opt.active
                          ? colors.primary
                          : colors.textSecondary,
                      },
                    ]}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {exportFeedback ? (
              <View
                style={[
                  styles.feedbackBanner,
                  {
                    backgroundColor: colors.accentSoft,
                    borderColor: colors.accentBorder,
                  },
                ]}
              >
                <Ionicons
                  name="checkmark-circle-outline"
                  size={15}
                  color={colors.primary}
                />
                <Text
                  style={[styles.feedbackText, { color: colors.text }]}
                >
                  {exportFeedback}
                </Text>
              </View>
            ) : null}

            {/* LIVE PREVIEW LEMBAR A4 CV SESUAI TEMPLATE PDF ASLI */}
            <View style={styles.a4Paper}>
              {/* Baris Atas: Foto Bulat di Kiri + Nama Besar di Kanan */}
              <View style={styles.a4TopHeader}>
                <View style={styles.a4PhotoCol}>
                  <View style={styles.a4PhotoCircle}>
                    <Image
                      source={{ uri: CV_PHOTO_DATA_URI }}
                      style={styles.a4PhotoImg}
                      resizeMode="cover"
                    />
                  </View>
                </View>

                <View style={styles.a4TitleCol}>
                  <Text style={styles.a4Name}>
                    {(identity.nama || 'SAYID ABDUL AZIZ').toUpperCase()}
                  </Text>
                  <Text style={styles.a4Role}>
                    {identity.profesi || 'Information Systems Student'}
                  </Text>
                  <Text style={styles.a4Nim}>
                    NIM: {identity.nim || '242505022'} • Universitas Ma&apos;soem
                  </Text>
                </View>
              </View>

              {/* Badan 2-Kolom: Sidebar Hitam Kiri (#242424) & Konten Putih Kanan */}
              <View style={styles.a4BodyRow}>
                {/* Kolom Kiri (Dark Sidebar) */}
                <View style={styles.a4LeftSidebar}>
                  {/* CONTACT */}
                  <View style={styles.a4SidebarSection}>
                    <Text style={styles.a4SidebarHeading}>CONTACT</Text>
                    <View style={styles.a4SidebarLine} />
                    <Text style={styles.a4SidebarItem}>
                      📞 {identity.telepon || '0812-1370-6230'}
                    </Text>
                    <Text style={styles.a4SidebarItem}>
                      ✉️ {identity.email || 'sayidaziz35@gmail.com'}
                    </Text>
                    <Text style={styles.a4SidebarItem}>
                      💻 NIM {identity.nim || '242505022'}
                    </Text>
                    <Text style={styles.a4SidebarItem}>
                      📍 {identity.lokasi || 'Rancaekek, Kabupaten Bandung'}
                    </Text>
                  </View>

                  {/* EDUCATION */}
                  <View style={styles.a4SidebarSection}>
                    <Text style={styles.a4SidebarHeading}>EDUCATION</Text>
                    <View style={styles.a4SidebarLine} />
                    {educationList.map((edu) => (
                      <View key={edu.id} style={styles.a4EduBlock}>
                        <Text style={styles.a4EduTitle}>
                          {edu.program || edu.title}
                        </Text>
                        {edu.institution && edu.institution !== edu.program ? (
                          <Text style={styles.a4EduInst}>
                            {edu.institution}
                          </Text>
                        ) : null}
                        <Text style={styles.a4EduPeriod}>{edu.period}</Text>
                      </View>
                    ))}
                  </View>

                  {/* SKILLS */}
                  <View style={styles.a4SidebarSection}>
                    <Text style={styles.a4SidebarHeading}>SKILLS</Text>
                    <View style={styles.a4SidebarLine} />
                    {sidebarSkills.map((sk) => (
                      <Text key={sk} style={styles.a4SkillBullet}>
                        • {sk}
                      </Text>
                    ))}
                  </View>

                  {/* ACADEMIC SCORE */}
                  {includeAcademicScore && (
                    <View style={styles.a4SidebarSection}>
                      <Text style={styles.a4SidebarHeading}>
                        ACADEMIC SCORE
                      </Text>
                      <View style={styles.a4SidebarLine} />
                      <Text style={styles.a4EduTitle}>
                        {acadSummary.courseName || 'Pemrograman Mobile 2'}
                      </Text>
                      <Text style={styles.a4EduInst}>
                        Dosen: {acadSummary.lecturer || 'Iin, M.Kom'}
                      </Text>
                      <Text style={styles.a4AcadHighlight}>
                        Score: {acadSummary.currentScore || 92} (Grade{' '}
                        {acadSummary.grade || 'A'}) •{' '}
                        {acadSummary.learningPointsLabel || '12375 LP'}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Kolom Kanan (White Main Content) */}
                <View style={styles.a4RightMain}>
                  {/* PROFILE SUMMARY */}
                  <View style={styles.a4MainSection}>
                    <Text style={styles.a4MainHeading}>PROFILE SUMMARY</Text>
                    <View style={styles.a4MainLine} />
                    <Text style={styles.a4SummaryText}>
                      {identity.deskripsi}
                    </Text>
                  </View>

                  {/* WORK EXPERIENCE */}
                  <View style={styles.a4MainSection}>
                    <Text style={styles.a4MainHeading}>WORK EXPERIENCE</Text>
                    <View style={styles.a4MainLine} />
                    {experienceList.map((exp) => (
                      <View key={exp.id} style={styles.a4ExpItem}>
                        <View style={styles.a4ExpHeaderRow}>
                          <Text style={styles.a4ExpRole}>{exp.title}</Text>
                          <Text style={styles.a4ExpPeriod}>{exp.period}</Text>
                        </View>
                        <Text style={styles.a4ExpCompany}>{exp.subtitle}</Text>
                        {includeDetailedBullets &&
                        Array.isArray(exp.bullets) ? (
                          exp.bullets.map((b, i) => (
                            <Text key={`${exp.id}-b-${i}`} style={styles.a4ExpBullet}>
                              • {b}
                            </Text>
                          ))
                        ) : (
                          <Text style={styles.a4ExpBullet}>
                            {exp.description}
                          </Text>
                        )}
                      </View>
                    ))}
                  </View>

                  {/* FEATURED PROJECTS & RESEARCH */}
                  {includeProjects && (
                    <View style={styles.a4MainSection}>
                      <Text style={styles.a4MainHeading}>
                        FEATURED PROJECTS & RESEARCH
                      </Text>
                      <View style={styles.a4MainLine} />
                      {projectsList.map((proj) => (
                        <View key={proj.id} style={styles.a4ExpItem}>
                          <View style={styles.a4ExpHeaderRow}>
                            <Text style={styles.a4ExpCompany}>
                              {proj.title}
                            </Text>
                            <Text style={styles.a4ProjStatus}>
                              {proj.status}
                            </Text>
                          </View>
                          <Text style={styles.a4ProjTech}>
                            {(proj.techStack || []).join(' • ')}
                          </Text>
                          <Text style={styles.a4ExpBullet}>
                            {proj.shortDescription}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              </View>
            </View>

            {/* Tombol Aksi Utama Export / Cetak PDF */}
            <View style={styles.bottomActions}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleGeneratePdf}
                style={[styles.printBtn, { backgroundColor: colors.primary }]}
              >
                <Ionicons name="print-outline" size={17} color="#FFFFFF" />
                <Text style={styles.printBtnText}>
                  Cetak / Simpan sebagai PDF (A4)
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    padding: 14,
  },
  modalCard: {
    maxHeight: '92%',
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  headerTitleCol: {
    flex: 1,
  },
  headerBadge: {
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 0.4,
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 15.5,
    fontWeight: '700',
  },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollBody: {
    padding: 16,
  },
  optionsCaption: {
    fontSize: 12,
    marginBottom: 8,
  },
  toggleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  toggleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  toggleChipText: {
    fontSize: 11.5,
    fontWeight: '600',
  },
  feedbackBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 12,
  },
  feedbackText: {
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
  },
  /* Miniature A4 CV Paper Styles */
  a4Paper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    marginBottom: 16,
  },
  a4TopHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  a4PhotoCol: {
    width: '35%',
    alignItems: 'center',
    paddingRight: 8,
  },
  a4PhotoCircle: {
    width: 78,
    height: 78,
    borderRadius: 39,
    borderWidth: 1,
    borderColor: '#4B5563',
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  a4PhotoImg: {
    width: '100%',
    height: '100%',
  },
  a4TitleCol: {
    width: '65%',
    paddingLeft: 6,
  },
  a4Name: {
    fontSize: 17,
    fontWeight: '800',
    color: '#2D2D2D',
    letterSpacing: 0.4,
    marginBottom: 2,
  },
  a4Role: {
    fontSize: 11,
    color: '#555555',
    marginBottom: 2,
  },
  a4Nim: {
    fontSize: 9.5,
    fontWeight: '600',
    color: '#6B7280',
  },
  a4BodyRow: {
    flexDirection: 'row',
  },
  a4LeftSidebar: {
    width: '35%',
    backgroundColor: '#242424',
    padding: 10,
    borderRadius: 4,
  },
  a4SidebarSection: {
    marginBottom: 12,
  },
  a4SidebarHeading: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.4,
    marginBottom: 3,
  },
  a4SidebarLine: {
    height: 1,
    backgroundColor: '#9CA3AF',
    marginBottom: 6,
  },
  a4SidebarItem: {
    fontSize: 8,
    color: '#E5E7EB',
    lineHeight: 12,
    marginBottom: 4,
  },
  a4EduBlock: {
    marginBottom: 6,
  },
  a4EduTitle: {
    fontSize: 8.5,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 11.5,
  },
  a4EduInst: {
    fontSize: 8,
    color: '#D1D5DB',
    lineHeight: 11,
  },
  a4EduPeriod: {
    fontSize: 7.5,
    color: '#9CA3AF',
  },
  a4SkillBullet: {
    fontSize: 8,
    color: '#E5E7EB',
    lineHeight: 12,
    marginBottom: 2,
  },
  a4AcadHighlight: {
    fontSize: 8,
    fontWeight: '700',
    color: '#FBBF24',
    marginTop: 3,
    lineHeight: 11.5,
  },
  a4RightMain: {
    width: '65%',
    paddingLeft: 12,
  },
  a4MainSection: {
    marginBottom: 10,
  },
  a4MainHeading: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2D2D2D',
    letterSpacing: 0.3,
    marginBottom: 3,
  },
  a4MainLine: {
    height: 1,
    backgroundColor: '#4B5563',
    marginBottom: 6,
  },
  a4SummaryText: {
    fontSize: 8.3,
    lineHeight: 12.5,
    color: '#4B5563',
  },
  a4ExpItem: {
    marginBottom: 7,
  },
  a4ExpHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 4,
  },
  a4ExpRole: {
    fontSize: 8.5,
    fontWeight: '600',
    color: '#374151',
    flex: 1,
  },
  a4ExpPeriod: {
    fontSize: 8,
    color: '#374151',
  },
  a4ExpCompany: {
    fontSize: 8.5,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
    flex: 1,
  },
  a4ExpBullet: {
    fontSize: 8,
    lineHeight: 11.5,
    color: '#4B5563',
    marginBottom: 1,
  },
  a4ProjStatus: {
    fontSize: 7.5,
    fontWeight: '700',
    color: '#6D28D9',
  },
  a4ProjTech: {
    fontSize: 7.8,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 1,
  },
  bottomActions: {
    marginTop: 2,
  },
  printBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 13,
    borderRadius: 12,
  },
  printBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '700',
  },
});
