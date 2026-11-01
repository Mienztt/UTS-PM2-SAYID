import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

/**
 * ProjectStatusBadge — Badge status proyek bergaya Clean Dark Minimalist:
 * - "On-Progress": Amber lembut (rgba(245, 158, 11, 0.15), border #F59E0B, teks #FBBF24)
 * - "Completed": Emerald lembut (rgba(16, 185, 129, 0.15), border #10B981, teks #34D399)
 */
export function ProjectStatusBadge({ status }) {
  if (!status) return null;

  const isOnProgress = status === 'On-Progress';

  const badgePalette = isOnProgress
    ? {
        backgroundColor: 'rgba(245, 158, 11, 0.15)',
        borderColor: '#F59E0B',
        textColor: '#FBBF24',
        label: '● On-Progress (2026)',
      }
    : {
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        borderColor: '#10B981',
        textColor: '#34D399',
        label: '✓ Completed',
      };

  return (
    <View
      style={[
        styles.statusBadge,
        {
          backgroundColor: badgePalette.backgroundColor,
          borderColor: badgePalette.borderColor,
        },
      ]}
    >
      <Text style={[styles.statusBadgeText, { color: badgePalette.textColor }]}>
        {badgePalette.label}
      </Text>
    </View>
  );
}

/**
 * CaseStudyModal — Modal Popup "Case Study Detail" untuk menampilkan studi kasus lengkap
 * proyek (SIMTS Rumah Qur'an Qurtuba, Quran ku Oracle PL/SQL, SIPEDA Warung Bu Dada, dll).
 */
export function CaseStudyModal({ project, visible, onClose }) {
  const { colors } = useTheme();

  if (!project) return null;

  const caseStudy = project.caseStudy || null;
  const clientName = caseStudy?.client || project.client || null;
  const contextInfo = caseStudy?.projectContext || project.context || null;

  const dbTables = Array.isArray(caseStudy?.databaseTables)
    ? caseStudy.databaseTables
    : [];
  const isDetailedDbTable =
    dbTables.length > 0 && typeof dbTables[0] === 'object';

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
          {/* Modal Top Header */}
          <View
            style={[
              styles.modalHeader,
              { borderBottomColor: colors.border },
            ]}
          >
            <View style={styles.modalHeaderLeft}>
              <Text
                style={[styles.modalHeaderCaption, { color: colors.primary }]}
              >
                Case Study Detail
              </Text>
              <Text
                style={[
                  styles.modalHeaderSub,
                  { color: colors.textSecondary },
                ]}
              >
                {project.category}
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
            contentContainerStyle={styles.modalScrollContent}
          >
            {/* Baris Status & Instansi di dalam Modal */}
            <View style={styles.modalBadgeRow}>
              <ProjectStatusBadge status={project.status} />
              {clientName ? (
                <View
                  style={[
                    styles.clientPill,
                    {
                      backgroundColor: colors.surfaceElevated,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Ionicons
                    name="business-outline"
                    size={12}
                    color={colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.clientPillText,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {clientName}
                  </Text>
                </View>
              ) : null}
            </View>

            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {project.title}
            </Text>

            <Text style={[styles.modalDesc, { color: colors.textSecondary }]}>
              {project.fullDescription || project.shortDescription}
            </Text>

            {/* Detail Studi Kasus Lengkap */}
            {caseStudy && (
              <View style={styles.caseStudyContainer}>
                {/* Instansi / Klien & Konteks Proyek */}
                {(clientName || contextInfo) && (
                  <View
                    style={[
                      styles.infoBox,
                      {
                        backgroundColor: colors.surfaceElevated,
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    {clientName ? (
                      <View
                        style={
                          contextInfo ? styles.infoMetaBlock : undefined
                        }
                      >
                        <Text style={[styles.infoLabel, { color: colors.text }]}>
                          Instansi / Klien
                        </Text>
                        <Text
                          style={[
                            styles.infoValue,
                            { color: colors.textSecondary },
                          ]}
                        >
                          {clientName}
                        </Text>
                      </View>
                    ) : null}

                    {contextInfo ? (
                      <View>
                        <Text style={[styles.infoLabel, { color: colors.text }]}>
                          Konteks Proyek
                        </Text>
                        <Text
                          style={[
                            styles.infoValue,
                            { color: colors.textSecondary },
                          ]}
                        >
                          {contextInfo}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                )}

                {/* Latar Belakang & Skala Instansi (SIMTS Rumah Qur'an Qurtuba) */}
                {caseStudy.backgroundScale ? (
                  <View
                    style={[
                      styles.infoBox,
                      {
                        backgroundColor: colors.surfaceElevated,
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    <Text style={[styles.infoLabel, { color: colors.text }]}>
                      Latar Belakang & Skala Instansi
                    </Text>
                    <Text
                      style={[
                        styles.infoValue,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {caseStudy.backgroundScale}
                    </Text>
                  </View>
                ) : null}

                {/* Arsitektur & Koneksi (Quran ku) */}
                {caseStudy.architecture ? (
                  <View
                    style={[
                      styles.infoBox,
                      {
                        backgroundColor: colors.surfaceElevated,
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    <Text style={[styles.infoLabel, { color: colors.text }]}>
                      Arsitektur & Koneksi
                    </Text>
                    <Text
                      style={[
                        styles.infoValue,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {caseStudy.architecture}
                    </Text>
                  </View>
                ) : null}

                {/* Metode SDLC (SIPEDA & lainnya) */}
                {caseStudy.sdlcMethod ? (
                  <View
                    style={[
                      styles.infoBox,
                      {
                        backgroundColor: colors.surfaceElevated,
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    <Text style={[styles.infoLabel, { color: colors.text }]}>
                      Metode SDLC
                    </Text>
                    <Text
                      style={[
                        styles.infoValue,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {caseStudy.sdlcMethod}
                    </Text>
                  </View>
                ) : null}

                {/* Pemodelan Sistem */}
                {caseStudy.systemModeling ? (
                  <View
                    style={[
                      styles.infoBox,
                      {
                        backgroundColor: colors.surfaceElevated,
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    <Text style={[styles.infoLabel, { color: colors.text }]}>
                      Pemodelan Sistem
                    </Text>
                    <Text
                      style={[
                        styles.infoValue,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {caseStudy.systemModeling}
                    </Text>
                  </View>
                ) : null}

                {/* Perancangan / Arsitektur Database */}
                {dbTables.length > 0 && (
                  <View style={styles.modalSection}>
                    <Text
                      style={[styles.modalSubLabel, { color: colors.text }]}
                    >
                      {caseStudy.databaseTitle || 'Arsitektur Database'}
                    </Text>

                    {isDetailedDbTable ? (
                      dbTables.map((tbl, idx) => (
                        <View
                          key={`${project.id}-tbl-${tbl.name}`}
                          style={[
                            styles.reqItem,
                            {
                              backgroundColor: colors.surfaceElevated,
                              borderColor: colors.border,
                            },
                          ]}
                        >
                          <View style={styles.reqHeaderRow}>
                            <View
                              style={[
                                styles.reqIndexBadge,
                                { backgroundColor: colors.accentSoft },
                              ]}
                            >
                              <Text
                                style={[
                                  styles.reqIndexText,
                                  { color: colors.primary },
                                ]}
                              >
                                {idx + 1}
                              </Text>
                            </View>
                            <Text
                              style={[
                                styles.codeIdentifier,
                                { color: colors.tagText },
                              ]}
                            >
                              {tbl.name}
                            </Text>
                          </View>
                          <Text
                            style={[
                              styles.reqDetailText,
                              { color: colors.textSecondary },
                            ]}
                          >
                            {tbl.detail}
                          </Text>
                        </View>
                      ))
                    ) : (
                      <View style={styles.dbTablesWrap}>
                        {dbTables.map((tbl) => (
                          <View
                            key={tbl}
                            style={[
                              styles.dbChip,
                              {
                                backgroundColor: colors.tagBg,
                                borderColor: colors.border,
                              },
                            ]}
                          >
                            <Text
                              style={[
                                styles.dbChipText,
                                { color: colors.tagText },
                              ]}
                            >
                              {tbl}
                            </Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                )}

                {/* Implementasi PL/SQL Stored Procedures */}
                {Array.isArray(caseStudy.storedProcedures) &&
                  caseStudy.storedProcedures.length > 0 && (
                    <View style={styles.modalSection}>
                      <Text
                        style={[
                          styles.modalSubLabel,
                          { color: colors.text },
                        ]}
                      >
                        {caseStudy.storedProceduresTitle ||
                          'Implementasi PL/SQL Stored Procedures'}
                      </Text>

                      {caseStudy.storedProcedures.map((sp) => (
                        <View
                          key={`${project.id}-sp-${sp.name}`}
                          style={[
                            styles.reqItem,
                            {
                              backgroundColor: colors.surfaceElevated,
                              borderColor: colors.border,
                            },
                          ]}
                        >
                          <View style={styles.spHeaderRow}>
                            <Ionicons
                              name="terminal-outline"
                              size={14}
                              color={colors.primary}
                            />
                            <Text
                              style={[
                                styles.codeIdentifier,
                                { color: colors.tagText },
                              ]}
                            >
                              {sp.name}
                            </Text>
                          </View>
                          <Text
                            style={[
                              styles.reqDetailText,
                              { color: colors.textSecondary },
                            ]}
                          >
                            {sp.detail}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}

                {/* Pemodelan Proses Bisnis (BPMN) & UML / Kebutuhan Fungsional Utama */}
                {Array.isArray(caseStudy.functionalRequirements) &&
                  caseStudy.functionalRequirements.length > 0 && (
                    <View style={styles.modalSection}>
                      <Text
                        style={[
                          styles.modalSubLabel,
                          { color: colors.text },
                        ]}
                      >
                        {caseStudy.requirementsTitle ||
                          'Kebutuhan Fungsional Utama'}
                      </Text>

                      {caseStudy.functionalRequirements.map((req, idx) => (
                        <View
                          key={`${project.id}-req-${idx}`}
                          style={[
                            styles.reqItem,
                            {
                              backgroundColor: colors.surfaceElevated,
                              borderColor: colors.border,
                            },
                          ]}
                        >
                          <View style={styles.reqHeaderRow}>
                            <View
                              style={[
                                styles.reqIndexBadge,
                                { backgroundColor: colors.accentSoft },
                              ]}
                            >
                              <Text
                                style={[
                                  styles.reqIndexText,
                                  { color: colors.primary },
                                ]}
                              >
                                {idx + 1}
                              </Text>
                            </View>
                            <Text
                              style={[
                                styles.reqCodeText,
                                { color: colors.text },
                              ]}
                            >
                              {req.code}
                            </Text>
                          </View>
                          <Text
                            style={[
                              styles.reqDetailText,
                              { color: colors.textSecondary },
                            ]}
                          >
                            {req.detail}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}

                {/* Rencana Testing & Implementasi (Sedang Berjalan — SIMTS) */}
                {Array.isArray(caseStudy.implementationPlan) &&
                  caseStudy.implementationPlan.length > 0 && (
                    <View style={styles.modalSection}>
                      <Text
                        style={[
                          styles.modalSubLabel,
                          { color: colors.text },
                        ]}
                      >
                        {caseStudy.implementationPlanTitle ||
                          'Rencana Testing & Implementasi'}
                      </Text>

                      {caseStudy.implementationPlan.map((plan, idx) => (
                        <View
                          key={`${project.id}-plan-${idx}`}
                          style={[
                            styles.reqItem,
                            {
                              backgroundColor: colors.surfaceElevated,
                              borderColor: colors.border,
                            },
                          ]}
                        >
                          <View style={styles.spHeaderRow}>
                            <Ionicons
                              name="shield-checkmark-outline"
                              size={14}
                              color="#FBBF24"
                            />
                            <Text
                              style={[
                                styles.reqCodeText,
                                { color: colors.text },
                              ]}
                            >
                              {plan.code}
                            </Text>
                          </View>
                          <Text
                            style={[
                              styles.reqDetailText,
                              { color: colors.textSecondary },
                            ]}
                          >
                            {plan.detail}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}

                {/* Hasil Pengujian */}
                {caseStudy.testingResult ? (
                  <View
                    style={[
                      styles.testingBox,
                      {
                        backgroundColor: colors.accentSoft,
                        borderColor: colors.accentBorder,
                      },
                    ]}
                  >
                    <Ionicons
                      name="checkmark-circle-outline"
                      size={17}
                      color={colors.primary}
                    />
                    <View style={styles.testingTextWrap}>
                      <Text
                        style={[styles.testingTitle, { color: colors.text }]}
                      >
                        Hasil Pengujian
                      </Text>
                      <Text
                        style={[
                          styles.testingDesc,
                          { color: colors.textSecondary },
                        ]}
                      >
                        {caseStudy.testingResult}
                      </Text>
                    </View>
                  </View>
                ) : null}
              </View>
            )}

            {/* Tech Stack */}
            <View style={styles.modalSection}>
              <Text style={[styles.modalSubLabel, { color: colors.text }]}>
                Tech Stack
              </Text>
              <View style={styles.techRow}>
                {(project.techStack || []).map((tech) => (
                  <View
                    key={`m-${tech}`}
                    style={[
                      styles.techTag,
                      {
                        backgroundColor: colors.tagBg,
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    <Text
                      style={[styles.techTagText, { color: colors.tagText }]}
                    >
                      {tech}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={onClose}
              style={[
                styles.modalCloseAction,
                { backgroundColor: colors.primary },
              ]}
            >
              <Text style={styles.modalCloseActionText}>Tutup Detail</Text>
            </TouchableOpacity>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

/**
 * ProjectCard — Kartu proyek Clean Dark Minimalist dilengkapi badge status
 * ("● On-Progress (2026)" / "✓ Completed") dan tombol "Details" untuk membuka
 * Modal Popup "Case Study Detail".
 */
export default function ProjectCard({ project }) {
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  if (!project) return null;

  return (
    <>
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        {/* Baris Atas: Maksimal 2 Badge (Kategori & Status Proyek) agar rapi & lega */}
        <View style={styles.topRow}>
          <View
            style={[
              styles.categoryBadge,
              {
                backgroundColor: colors.accentSoft,
                borderColor: colors.accentBorder,
              },
            ]}
          >
            <Text style={[styles.categoryText, { color: colors.primary }]}>
              {project.category}
            </Text>
          </View>

          <ProjectStatusBadge status={project.status} />
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => setModalVisible(true)}
        >
          <Text style={[styles.title, { color: colors.text }]}>
            {project.title}
          </Text>

          {project.client ? (
            <View style={styles.clientInlineRow}>
              <Ionicons
                name="business-outline"
                size={13}
                color={colors.textSecondary}
              />
              <Text
                style={[
                  styles.clientInlineText,
                  { color: colors.textSecondary },
                ]}
              >
                Instansi: {project.client}
              </Text>
            </View>
          ) : null}

          {project.context ? (
            <Text style={[styles.contextText, { color: colors.primary }]}>
              {project.context}
            </Text>
          ) : null}

          <Text style={[styles.description, { color: colors.textSecondary }]}>
            {project.shortDescription}
          </Text>
        </TouchableOpacity>

        {/* Tag Teknologi: Abu-abu gelap dengan teks ungu muda */}
        {Array.isArray(project.techStack) && project.techStack.length > 0 && (
          <View style={styles.techRow}>
            {project.techStack.map((tech) => (
              <View
                key={tech}
                style={[
                  styles.techTag,
                  {
                    backgroundColor: colors.tagBg,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text style={[styles.techTagText, { color: colors.tagText }]}>
                  {tech}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Baris Aksi Bawah: Tombol Details Studi Kasus */}
        <View
          style={[
            styles.cardFooter,
            { borderTopColor: colors.border },
          ]}
        >
          <Text style={[styles.footerHintText, { color: colors.textMuted }]}>
            Case Study & Architecture
          </Text>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setModalVisible(true)}
            style={[
              styles.detailsBtn,
              {
                backgroundColor: colors.surfaceElevated,
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={[styles.detailsBtnText, { color: colors.primary }]}>
              Details
            </Text>
            <Ionicons
              name="arrow-forward"
              size={13}
              color={colors.primary}
            />
          </TouchableOpacity>
        </View>
      </View>

      <CaseStudyModal
        project={project}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
    marginBottom: 14,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    flexShrink: 1,
  },
  categoryText: {
    fontSize: 11.5,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.1,
  },
  title: {
    fontSize: 16.5,
    fontWeight: '700',
    lineHeight: 23,
    marginBottom: 5,
  },
  clientInlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 4,
  },
  clientInlineText: {
    fontSize: 12.5,
    fontWeight: '600',
  },
  contextText: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 18,
    marginBottom: 6,
  },
  description: {
    fontSize: 13.5,
    lineHeight: 22,
    marginBottom: 14,
  },
  techRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  techTag: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  techTagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  footerHintText: {
    fontSize: 12,
    fontWeight: '500',
  },
  detailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  detailsBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    padding: 18,
  },
  modalCard: {
    maxHeight: '86%',
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
  modalHeaderLeft: {
    flex: 1,
  },
  modalHeaderCaption: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  modalHeaderSub: {
    fontSize: 12,
    marginTop: 1,
  },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalScrollContent: {
    padding: 18,
  },
  modalBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  clientPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  clientPillText: {
    fontSize: 11.5,
    fontWeight: '600',
  },
  modalTitle: {
    fontSize: 17.5,
    fontWeight: '700',
    lineHeight: 24,
    marginBottom: 8,
  },
  modalDesc: {
    fontSize: 13.5,
    lineHeight: 22,
    marginBottom: 16,
  },
  caseStudyContainer: {
    marginBottom: 4,
  },
  infoBox: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    marginBottom: 12,
  },
  infoMetaBlock: {
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 13,
    lineHeight: 21,
  },
  modalSection: {
    marginTop: 4,
    marginBottom: 14,
  },
  modalSubLabel: {
    fontSize: 13.5,
    fontWeight: '700',
    marginBottom: 10,
  },
  dbTablesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },
  dbChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  dbChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  reqItem: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 13,
    marginBottom: 8,
  },
  reqHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 5,
  },
  spHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: 5,
  },
  reqIndexBadge: {
    width: 20,
    height: 20,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reqIndexText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  codeIdentifier: {
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
  },
  reqCodeText: {
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
  },
  reqDetailText: {
    fontSize: 13,
    lineHeight: 20.5,
  },
  testingBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 14,
  },
  testingTextWrap: {
    flex: 1,
  },
  testingTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  testingDesc: {
    fontSize: 13,
    lineHeight: 20,
  },
  modalCloseAction: {
    marginTop: 6,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseActionText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '600',
  },
});
