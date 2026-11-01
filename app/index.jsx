import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../context/ThemeContext';
import { useSimulatedFetch } from '../hooks/useSimulatedFetch';
import profileJson from '../data/profile.json';
import portfolioJson from '../data/portfolio.json';

import ProfileHeader from '../components/ProfileHeader';
import StatCard from '../components/StatCard';
import TimelineItem from '../components/TimelineItem';
import LoadingState from '../components/LoadingState';
import {
  ProjectStatusBadge,
  CaseStudyModal,
} from '../components/ProjectCard';

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [selectedPub, setSelectedPub] = useState(null);
  const [simtsModalVisible, setSimtsModalVisible] = useState(false);

  const {
    data: profile,
    loading,
    isRefreshing,
    error,
    retry,
    refresh,
  } = useSimulatedFetch(() => profileJson, { delay: 260 });

  if (loading || error || !profile) {
    return (
      <ScrollView
        style={[styles.screen, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.contentContainer}
      >
        <LoadingState
          loading={loading}
          error={error}
          onRetry={retry}
          loadingText="Memuat profil, riset & riwayat CV..."
          skeletonCount={3}
        />
      </ScrollView>
    );
  }

  const competencies = profile.competencies || [];
  const currentWork = profile.currentWork || null;
  const simtsProject =
    (portfolioJson.projects || []).find((p) => p.id === 'proj-simts') || null;
  const publications = profile.publications || [];
  const educationList = profile.education || [];
  const experienceList = profile.experience || [];

  return (
    <>
      <ScrollView
        style={[styles.screen, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {/* 1. Hero Profile */}
        <View style={styles.section}>
          <ProfileHeader
            identity={profile.identity}
            onExplorePortfolio={() => router.push('/portfolio')}
            onContactMe={() => router.push('/contact')}
          />
        </View>

        {/* 2. Quick Stats Row */}
        <View style={styles.section}>
          <View style={styles.statsRow}>
            {(profile.quickStats || []).map((stat) => (
              <StatCard
                key={stat.id}
                icon={stat.icon}
                value={stat.value}
                label={stat.label}
                subtext={stat.subtext}
              />
            ))}
          </View>
        </View>

        {/* 3. What I Do / Core Competencies */}
        {competencies.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              What I Do
            </Text>

            <View
              style={[
                styles.competencyCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              {competencies.map((comp, idx) => {
                const isLast = idx === competencies.length - 1;
                return (
                  <View key={comp.id}>
                    <View style={styles.compRow}>
                      <View
                        style={[
                          styles.compIconBox,
                          {
                            backgroundColor: colors.accentSoft,
                            borderColor: colors.accentBorder,
                          },
                        ]}
                      >
                        <Ionicons
                          name={comp.icon || 'code-slash-outline'}
                          size={16}
                          color={colors.primary}
                        />
                      </View>

                      <View style={styles.compBody}>
                        <Text style={[styles.compTitle, { color: colors.text }]}>
                          {comp.title}
                        </Text>
                        <Text
                          style={[
                            styles.compDesc,
                            { color: colors.textSecondary },
                          ]}
                        >
                          {comp.description}
                        </Text>
                      </View>
                    </View>

                    {!isLast && (
                      <View
                        style={[
                          styles.compDivider,
                          { backgroundColor: colors.border },
                        ]}
                      />
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* 4. Currently Working On (SIMTS Rumah Qur'an Qurtuba — Oktober 2026) */}
        {currentWork && (
          <View style={styles.section}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => {
                if (simtsProject) {
                  setSimtsModalVisible(true);
                } else {
                  router.push('/portfolio');
                }
              }}
              style={[
                styles.currentWorkCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text
                style={[styles.currentWorkLabel, { color: colors.primary }]}
              >
                {currentWork.label || '🚀 CURRENTLY WORKING ON (OKTOBER 2026)'}
              </Text>

              <View style={styles.currentWorkMetaRow}>
                <View style={styles.currentWorkClientRow}>
                  <Ionicons
                    name="business-outline"
                    size={13}
                    color={colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.currentWorkClientText,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {currentWork.client}
                  </Text>
                </View>

                <ProjectStatusBadge
                  status={currentWork.status || 'On-Progress'}
                />
              </View>

              <Text style={[styles.currentWorkTitle, { color: colors.text }]}>
                {currentWork.title}
              </Text>

              {currentWork.roleContext ? (
                <Text
                  style={[
                    styles.currentWorkRole,
                    { color: colors.textSecondary },
                  ]}
                >
                  {currentWork.roleContext}
                </Text>
              ) : null}

              <Text
                style={[
                  styles.currentWorkSummary,
                  { color: colors.textSecondary },
                ]}
              >
                {currentWork.summary}
              </Text>

              {Array.isArray(currentWork.techStack) &&
                currentWork.techStack.length > 0 && (
                  <View style={styles.pubTechRow}>
                    {currentWork.techStack.map((tech) => (
                      <View
                        key={`cw-${tech}`}
                        style={[
                          styles.pubTechChip,
                          {
                            backgroundColor: colors.tagBg,
                            borderColor: colors.border,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.pubTechChipText,
                            { color: colors.tagText },
                          ]}
                        >
                          {tech}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}

              <View
                style={[
                  styles.currentWorkFooter,
                  { borderTopColor: colors.border },
                ]}
              >
                <Text
                  style={[
                    styles.currentWorkFooterHint,
                    { color: colors.textMuted },
                  ]}
                >
                  BPMN 2.0 • UML • Black Box & UAT
                </Text>

                <View style={styles.pubActionHint}>
                  <Text
                    style={[
                      styles.pubActionHintText,
                      { color: colors.primary },
                    ]}
                  >
                    Studi Kasus
                  </Text>
                  <Ionicons
                    name="arrow-forward"
                    size={13}
                    color={colors.primary}
                  />
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* 5. Featured Research & Academic Projects (Jurnal SIPEDA & Final Project Quran ku) */}
        {publications.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Featured Research & Academic Projects
            </Text>

            {publications.map((pub, idx) => {
              const isLast = idx === publications.length - 1;
              return (
                <TouchableOpacity
                  key={pub.id}
                  activeOpacity={0.85}
                  onPress={() => setSelectedPub(pub)}
                  style={[
                    styles.pubCard,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                      marginBottom: isLast ? 0 : 14,
                    },
                  ]}
                >
                  <View style={styles.pubTopRow}>
                    <View
                      style={[
                        styles.pubBadge,
                        {
                          backgroundColor: colors.accentSoft,
                          borderColor: colors.accentBorder,
                        },
                      ]}
                    >
                      <Ionicons
                        name="document-text-outline"
                        size={13}
                        color={colors.primary}
                      />
                      <Text
                        style={[styles.pubBadgeText, { color: colors.primary }]}
                      >
                        {pub.badge || 'Academic Research'}
                      </Text>
                    </View>

                    <View style={styles.pubActionHint}>
                      <Text
                        style={[
                          styles.pubActionHintText,
                          { color: colors.primary },
                        ]}
                      >
                        {pub.actionLabel || 'Baca Abstrak'}
                      </Text>
                      <Ionicons
                        name="chevron-forward"
                        size={14}
                        color={colors.primary}
                      />
                    </View>
                  </View>

                  <Text style={[styles.pubTitle, { color: colors.text }]}>
                    {pub.title}
                  </Text>

                  <Text
                    style={[styles.pubAuthor, { color: colors.textSecondary }]}
                  >
                    {pub.author} • {pub.affiliation}
                  </Text>

                  <View
                    style={[
                      styles.pubMethodBox,
                      {
                        backgroundColor: colors.surfaceElevated,
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    <Text
                      style={[styles.pubMethodLabel, { color: colors.text }]}
                    >
                      {pub.methodLabel || 'Metode'}:{' '}
                      <Text
                        style={[
                          styles.pubMethodValue,
                          { color: colors.textSecondary },
                        ]}
                      >
                        {pub.method}
                      </Text>
                    </Text>
                  </View>

                  <Text
                    numberOfLines={3}
                    style={[styles.pubPreview, { color: colors.textSecondary }]}
                  >
                    {pub.abstract}
                  </Text>

                  {Array.isArray(pub.techStack) && pub.techStack.length > 0 && (
                    <View style={styles.pubTechRow}>
                      {pub.techStack.map((tech) => (
                        <View
                          key={tech}
                          style={[
                            styles.pubTechChip,
                            {
                              backgroundColor: colors.tagBg,
                              borderColor: colors.border,
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.pubTechChipText,
                              { color: colors.tagText },
                            ]}
                          >
                            {tech}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* 6. Timeline Education */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Education
          </Text>
          <View>
            {educationList.map((item, idx) => (
              <TimelineItem
                key={item.id}
                item={item}
                isLast={idx === educationList.length - 1}
              />
            ))}
          </View>
        </View>

        {/* 7. Timeline Work & Organization Experience */}
        <View style={styles.bottomSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Work & Organization Experience
          </Text>
          <View>
            {experienceList.map((item, idx) => (
              <TimelineItem
                key={item.id}
                item={item}
                isLast={idx === experienceList.length - 1}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Modal Studi Kasus Lengkap untuk Proyek On-Progress SIMTS */}
      <CaseStudyModal
        project={simtsProject}
        visible={simtsModalVisible}
        onClose={() => setSimtsModalVisible(false)}
      />

      {/* Modal Detail Publikasi Jurnal & Final Project Akademik */}
      <Modal
        visible={!!selectedPub}
        animationType="fade"
        transparent
        onRequestClose={() => setSelectedPub(null)}
      >
        <Pressable
          style={[styles.backdrop, { backgroundColor: colors.overlay }]}
          onPress={() => setSelectedPub(null)}
        >
          {selectedPub && (
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
              <View
                style={[
                  styles.modalHeader,
                  { borderBottomColor: colors.border },
                ]}
              >
                <Text
                  style={[styles.modalHeaderTitle, { color: colors.primary }]}
                >
                  {selectedPub.badge || 'Featured Research & Academic Project'}
                </Text>

                <TouchableOpacity
                  onPress={() => setSelectedPub(null)}
                  style={[
                    styles.closeBtn,
                    {
                      backgroundColor: colors.surfaceElevated,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Ionicons
                    name="close"
                    size={16}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>

              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.modalBody}
              >
                <Text style={[styles.modalTitle, { color: colors.text }]}>
                  {selectedPub.title}
                </Text>

                <View
                  style={[
                    styles.modalMetaBox,
                    {
                      backgroundColor: colors.surfaceElevated,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <View style={styles.modalMetaRow}>
                    <Text
                      style={[
                        styles.modalMetaLabel,
                        { color: colors.textSecondary },
                      ]}
                    >
                      Penulis / Pengembang
                    </Text>
                    <Text
                      style={[styles.modalMetaValue, { color: colors.text }]}
                    >
                      {selectedPub.author}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.modalMetaDivider,
                      { backgroundColor: colors.border },
                    ]}
                  />

                  <View style={styles.modalMetaRow}>
                    <Text
                      style={[
                        styles.modalMetaLabel,
                        { color: colors.textSecondary },
                      ]}
                    >
                      Afiliasi / Konteks Akademik
                    </Text>
                    <Text
                      style={[styles.modalMetaValue, { color: colors.text }]}
                    >
                      {selectedPub.affiliation}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.modalMetaDivider,
                      { backgroundColor: colors.border },
                    ]}
                  />

                  <View style={styles.modalMetaRow}>
                    <Text
                      style={[
                        styles.modalMetaLabel,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {selectedPub.methodLabel || 'Metode Pengembangan'}
                    </Text>
                    <Text
                      style={[styles.modalMetaValue, { color: colors.text }]}
                    >
                      {selectedPub.method}
                    </Text>
                  </View>
                </View>

                <Text style={[styles.modalSubHeading, { color: colors.text }]}>
                  Ringkasan & Abstrak
                </Text>
                <Text
                  style={[
                    styles.modalAbstract,
                    { color: colors.textSecondary },
                  ]}
                >
                  {selectedPub.abstract}
                </Text>

                {Array.isArray(selectedPub.highlights) &&
                  selectedPub.highlights.length > 0 && (
                    <View style={styles.highlightsWrap}>
                      <Text
                        style={[styles.modalSubHeading, { color: colors.text }]}
                      >
                        Sorotan Teknis Utama
                      </Text>
                      {selectedPub.highlights.map((pt, idx) => (
                        <View
                          key={`pub-hl-${idx}`}
                          style={[
                            styles.highlightItem,
                            {
                              backgroundColor: colors.surfaceElevated,
                              borderColor: colors.border,
                            },
                          ]}
                        >
                          <View
                            style={[
                              styles.highlightDot,
                              { backgroundColor: colors.primary },
                            ]}
                          />
                          <Text
                            style={[
                              styles.highlightText,
                              { color: colors.textSecondary },
                            ]}
                          >
                            {pt}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}

                <Text style={[styles.modalSubHeading, { color: colors.text }]}>
                  Tech Stack
                </Text>
                <View style={styles.pubTechRow}>
                  {(selectedPub.techStack || []).map((tech) => (
                    <View
                      key={`pub-modal-${tech}`}
                      style={[
                        styles.pubTechChip,
                        {
                          backgroundColor: colors.tagBg,
                          borderColor: colors.border,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.pubTechChipText,
                          { color: colors.tagText },
                        ]}
                      >
                        {tech}
                      </Text>
                    </View>
                  ))}
                </View>

                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => setSelectedPub(null)}
                  style={[
                    styles.modalCloseBtnFull,
                    { backgroundColor: colors.primary },
                  ]}
                >
                  <Text style={styles.modalCloseBtnText}>Tutup</Text>
                </TouchableOpacity>
              </ScrollView>
            </Pressable>
          )}
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  contentContainer: {
    padding: 18,
    paddingBottom: 36,
  },
  section: {
    marginBottom: 28,
  },
  bottomSection: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.2,
    marginBottom: 14,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  competencyCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
  },
  compRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  compIconBox: {
    width: 34,
    height: 34,
    borderRadius: 9,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  compBody: {
    flex: 1,
  },
  compTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    marginBottom: 3,
  },
  compDesc: {
    fontSize: 13,
    lineHeight: 21,
  },
  compDivider: {
    height: 1,
    marginVertical: 14,
  },
  currentWorkCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
  },
  currentWorkLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    letterSpacing: 0.4,
    marginBottom: 10,
  },
  currentWorkMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  currentWorkClientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flexShrink: 1,
  },
  currentWorkClientText: {
    fontSize: 12.5,
    fontWeight: '600',
  },
  currentWorkTitle: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 23,
    marginBottom: 4,
  },
  currentWorkRole: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 10,
  },
  currentWorkSummary: {
    fontSize: 13.5,
    lineHeight: 22,
    marginBottom: 14,
  },
  currentWorkFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  currentWorkFooterHint: {
    fontSize: 12,
    fontWeight: '500',
  },
  pubCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
  },
  pubTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 12,
  },
  pubBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    flexShrink: 1,
  },
  pubBadgeText: {
    fontSize: 11.5,
    fontWeight: '600',
  },
  pubActionHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pubActionHintText: {
    fontSize: 12,
    fontWeight: '600',
  },
  pubTitle: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 23,
    marginBottom: 6,
  },
  pubAuthor: {
    fontSize: 12.5,
    lineHeight: 19,
    marginBottom: 12,
  },
  pubMethodBox: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginBottom: 12,
  },
  pubMethodLabel: {
    fontSize: 12.5,
    fontWeight: '600',
    lineHeight: 19,
  },
  pubMethodValue: {
    fontWeight: '400',
  },
  pubPreview: {
    fontSize: 13.5,
    lineHeight: 22,
    marginBottom: 14,
  },
  pubTechRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pubTechChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  pubTechChipText: {
    fontSize: 12,
    fontWeight: '500',
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
  modalHeaderTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    flex: 1,
  },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBody: {
    padding: 18,
  },
  modalTitle: {
    fontSize: 17.5,
    fontWeight: '700',
    lineHeight: 24,
    marginBottom: 14,
  },
  modalMetaBox: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    marginBottom: 16,
  },
  modalMetaRow: {
    gap: 2,
  },
  modalMetaLabel: {
    fontSize: 11.5,
    fontWeight: '500',
  },
  modalMetaValue: {
    fontSize: 13.5,
    fontWeight: '600',
    lineHeight: 20,
  },
  modalMetaDivider: {
    height: 1,
    marginVertical: 10,
  },
  modalSubHeading: {
    fontSize: 13.5,
    fontWeight: '700',
    marginBottom: 8,
  },
  modalAbstract: {
    fontSize: 13.5,
    lineHeight: 22,
    marginBottom: 16,
  },
  highlightsWrap: {
    marginBottom: 16,
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 8,
  },
  highlightDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 7,
  },
  highlightText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
  },
  modalCloseBtnFull: {
    marginTop: 18,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '600',
  },
});
