import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../context/ThemeContext';
import { useSimulatedFetch } from '../hooks/useSimulatedFetch';
import academicScoreJson from '../data/academicScore.json';
import {
  calculateAcademicMetrics,
  calculateCourseFinalScore,
  getGradeInfo,
} from '../utils/validation';

import ScoreProgressBar from '../components/ScoreProgressBar';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';

export default function ScoreScreen() {
  const { colors } = useTheme();

  const {
    data: academicData,
    loading,
    isRefreshing,
    error,
    retry,
    refresh,
    simulateError,
  } = useSimulatedFetch(() => academicScoreJson, { delay: 380 });

  const [activeTab, setActiveTab] = useState('progress'); // 'progress' | 'levels' | 'simulator'
  const [courseSearch, setCourseSearch] = useState('');
  const [focusedInput, setFocusedInput] = useState(null);

  // State Kalkulator Simulasi Nilai (Level 4 & Level 8)
  const [simTugas, setSimTugas] = useState('92');
  const [simUts, setSimUts] = useState('92');
  const [simUas, setSimUas] = useState('92');

  const overallMetrics = useMemo(() => {
    return calculateAcademicMetrics(academicData?.courses || []);
  }, [academicData]);

  const filteredCourses = useMemo(() => {
    const q = courseSearch.trim().toLowerCase();
    if (!q) return overallMetrics.enrichedCourses;
    return overallMetrics.enrichedCourses.filter((c) =>
      `${c.code} ${c.name} ${c.lecturer || ''} ${c.grade}`
        .toLowerCase()
        .includes(q)
    );
  }, [overallMetrics.enrichedCourses, courseSearch]);

  const simResult = useMemo(() => {
    const finalScore = calculateCourseFinalScore({
      tugas: simTugas,
      uts: simUts,
      uas: simUas,
    });
    const gradeInfo = getGradeInfo(finalScore);
    return { finalScore, ...gradeInfo };
  }, [simTugas, simUts, simUas]);

  if (loading || error || !academicData) {
    return (
      <ScrollView
        style={[styles.screen, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.contentContainer}
      >
        <LoadingState
          loading={loading}
          error={error}
          onRetry={retry}
          loadingText="Memuat My Score & Learning Progress..."
          skeletonCount={3}
        />
      </ScrollView>
    );
  }

  const summary = academicData.academicSummary || {};
  const learningProgress = academicData.learningProgress || [];

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={refresh}
          tintColor="#A855F7"
          colors={['#6366F1', '#A855F7']}
        />
      }
    >
      {/* 1. Kartu Identitas Akademik (Cyber-Glass Card) */}
      <View
        style={[
          styles.identityCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
          colors.shadowGlow,
        ]}
      >
        <View style={styles.identityTopRow}>
          <View
            style={[
              styles.verifiedAcademicPill,
              {
                backgroundColor: colors.pillBg,
                borderColor: colors.pillBorder,
              },
            ]}
          >
            <Ionicons name="school" size={13} color={colors.secondary} />
            <Text style={[styles.verifiedText, { color: colors.secondary }]}>
              Academic Dashboard • Level 8
            </Text>
          </View>
        </View>

        <Text style={[styles.studentName, { color: colors.text }]}>
          {summary.studentName}
        </Text>

        <View
          style={[
            styles.nimChip,
            {
              backgroundColor: colors.cyanSoft,
              borderColor: 'rgba(56, 189, 248, 0.35)',
            },
          ]}
        >
          <Ionicons name="id-card-outline" size={14} color={colors.accentCyan} />
          <Text style={[styles.nimChipText, { color: colors.accentCyan }]}>
            NIM: {summary.nim}
          </Text>
        </View>

        <Text style={[styles.campusText, { color: colors.textSecondary }]}>
          {summary.programCampus}
        </Text>

        <View style={[styles.courseMetaDivider, { borderTopColor: colors.border }]}>
          <View style={styles.courseMetaItem}>
            <Text style={[styles.metaLabel, { color: colors.textMuted }]}>
              Mata Kuliah
            </Text>
            <Text style={[styles.metaValue, { color: colors.text }]}>
              {summary.courseName}
            </Text>
          </View>

          <View style={styles.courseMetaItem}>
            <Text style={[styles.metaLabel, { color: colors.textMuted }]}>
              Dosen Pengampu
            </Text>
            <Text style={[styles.metaValue, { color: colors.accentCyan }]}>
              {summary.lecturer}
            </Text>
          </View>
        </View>
      </View>

      {/* 2. Kartu Current Score dengan LinearGradient (#1E1B4B -> #311042) */}
      <View style={[styles.scoreGradientWrap, colors.shadowGlow]}>
        <LinearGradient
          colors={['#1E1B4B', '#311042']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.scoreGradientCard}
        >
          <View style={styles.scoreDecorOrb} />

          <View style={styles.scoreTopBar}>
            <View style={styles.currentScoreTag}>
              <Ionicons name="sparkles" size={13} color="#38BDF8" />
              <Text style={styles.currentScoreTagText}>Current Score</Text>
            </View>

            <View style={styles.lpPill}>
              <Ionicons name="flash" size={14} color="#FBBF24" />
              <Text style={styles.lpPillText}>
                {summary.learningPointsLabel || `${summary.learningPoints} LP`}
              </Text>
            </View>
          </View>

          <View style={styles.scoreMainRow}>
            <View style={styles.scoreNumberBlock}>
              <Text style={styles.bigScoreNumber}>{summary.currentScore}</Text>
              <Text style={styles.outOfText}>/ 100 Points</Text>
            </View>

            <LinearGradient
              colors={['#6366F1', '#A855F7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradeBadgeBox}
            >
              <Text style={styles.gradeCaption}>GRADE</Text>
              <Text style={styles.gradeLetter}>{summary.grade}</Text>
            </LinearGradient>
          </View>

          <Text style={styles.scoreCourseFooter}>
            {summary.courseName} • Dosen: {summary.lecturer}
          </Text>
        </LinearGradient>
      </View>

      {/* 3. Segmented Pill Switcher */}
      <View
        style={[
          styles.segmentedCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        {[
          { key: 'progress', label: 'Learning Progress' },
          { key: 'levels', label: 'Level 1–10' },
          { key: 'simulator', label: 'Simulator' },
        ].map((tab) => {
          const active = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              activeOpacity={0.85}
              onPress={() => setActiveTab(tab.key)}
              style={styles.tabSlot}
            >
              {active ? (
                <LinearGradient
                  colors={['#6366F1', '#A855F7']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.activeTabPill}
                >
                  <Text style={styles.activeTabText}>{tab.label}</Text>
                </LinearGradient>
              ) : (
                <View style={styles.inactiveTabPill}>
                  <Text
                    style={[
                      styles.inactiveTabText,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {tab.label}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* VIEW 1: 4 LEARNING PROGRESS BARS + COURSES */}
      {activeTab === 'progress' && (
        <View>
          {/* 4 Neon Learning Progress Card */}
          <View
            style={[
              styles.glassSectionCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
              colors.shadowGlow,
            ]}
          >
            <View style={styles.sectionTitleRow}>
              <Ionicons
                name="trending-up-outline"
                size={19}
                color={colors.accentCyan}
              />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Learning Progress ({summary.learningPointsLabel || '12375 LP'})
              </Text>
            </View>

            {learningProgress.map((item) => (
              <ScoreProgressBar
                key={item.id}
                label={item.label}
                subtitle={item.subtitle}
                value={item.percentage}
                maxValue={100}
                gradientColors={item.gradient}
              />
            ))}
          </View>

          {/* Riwayat Mata Kuliah Sistem Informasi */}
          <View style={styles.subHeaderBlock}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Rekapitulasi Mata Kuliah & IP ({overallMetrics.gpa.toFixed(2)})
            </Text>
          </View>

          <View
            style={[
              styles.searchBar,
              {
                backgroundColor: colors.surface,
                borderColor:
                  focusedInput === 'courseSearch' ? '#A855F7' : colors.border,
              },
            ]}
          >
            <Ionicons name="search-outline" size={17} color={colors.accentCyan} />
            <TextInput
              value={courseSearch}
              onChangeText={setCourseSearch}
              onFocus={() => setFocusedInput('courseSearch')}
              onBlur={() => setFocusedInput(null)}
              placeholder="Cari mata kuliah atau dosen..."
              placeholderTextColor={colors.textMuted}
              style={[styles.searchInput, { color: colors.text }]}
            />
            {courseSearch.length > 0 && (
              <TouchableOpacity onPress={() => setCourseSearch('')}>
                <Ionicons
                  name="close-circle"
                  size={18}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            )}
          </View>

          {filteredCourses.length === 0 ? (
            <EmptyState
              icon="document-text-outline"
              title="Mata Kuliah Tidak Ditemukan"
              description={`Tidak ada mata kuliah dengan kata kunci "${courseSearch}".`}
              actionLabel="Reset Pencarian"
              onAction={() => setCourseSearch('')}
            />
          ) : (
            filteredCourses.map((course) => (
              <View
                key={course.id}
                style={[
                  styles.courseCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
              >
                <ScoreProgressBar
                  label={`${course.code} • ${course.name}`}
                  subtitle={`Semester ${course.semester} • ${course.sks} SKS${
                    course.lecturer ? ` • ${course.lecturer}` : ''
                  }`}
                  value={course.finalScore}
                  maxValue={100}
                  badgeText={`Grade ${course.grade}`}
                  gradientColors={['#6366F1', '#A855F7']}
                />
              </View>
            ))
          )}
        </View>
      )}

      {/* VIEW 2: LEVEL 1-10 RUBRIC TRACKER */}
      {activeTab === 'levels' && (
        <View
          style={[
            styles.glassSectionCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
            colors.shadowGlow,
          ]}
        >
          <View style={styles.sectionTitleRow}>
            <Ionicons
              name="checkmark-done-circle"
              size={20}
              color={colors.success}
            />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Capaian Proyek UTS (Level 1 – 10)
            </Text>
          </View>

          {(academicData.levelAchievements || []).map((lvl) => (
            <View
              key={`lvl-${lvl.level}`}
              style={[
                styles.levelItemBox,
                {
                  backgroundColor: colors.surfaceElevated,
                  borderColor: colors.border,
                },
              ]}
            >
              <ScoreProgressBar
                label={lvl.title}
                subtitle={lvl.detail}
                value={lvl.percentage}
                maxValue={100}
                badgeText="100%"
                showPercentage={false}
                gradientColors={
                  lvl.level % 2 === 0
                    ? ['#A855F7', '#EC4899']
                    : ['#6366F1', '#38BDF8']
                }
              />
            </View>
          ))}
        </View>
      )}

      {/* VIEW 3: INTERACTIVE GRADE SIMULATOR */}
      {activeTab === 'simulator' && (
        <View
          style={[
            styles.glassSectionCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
            colors.shadowGlow,
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Kalkulator Simulasi Nilai Akhir
          </Text>
          <Text style={[styles.simSubtitle, { color: colors.textSecondary }]}>
            Uji perhitungan skor otomatis (30% Tugas, 35% UTS, 35% UAS).
          </Text>

          <View style={styles.simInputRow}>
            {[
              { id: 'tugas', label: 'Tugas (30%)', val: simTugas, setter: setSimTugas },
              { id: 'uts', label: 'UTS (35%)', val: simUts, setter: setSimUts },
              { id: 'uas', label: 'UAS (35%)', val: simUas, setter: setSimUas },
            ].map((field) => (
              <View key={field.id} style={styles.simField}>
                <Text style={[styles.simLabel, { color: colors.textSecondary }]}>
                  {field.label}
                </Text>
                <TextInput
                  value={field.val}
                  onChangeText={field.setter}
                  onFocus={() => setFocusedInput(field.id)}
                  onBlur={() => setFocusedInput(null)}
                  keyboardType="numeric"
                  maxLength={3}
                  style={[
                    styles.simInput,
                    {
                      backgroundColor: colors.surfaceInput,
                      borderColor:
                        focusedInput === field.id ? '#A855F7' : colors.border,
                      color: colors.text,
                    },
                  ]}
                />
              </View>
            ))}
          </View>

          <LinearGradient
            colors={['#1E1B4B', '#311042']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.simResultBox}
          >
            <View style={styles.simResultLeft}>
              <Text style={styles.simResultCaption}>Skor Akhir Terhitung</Text>
              <Text style={styles.simResultScore}>
                {simResult.finalScore} / 100
              </Text>
              <Text style={styles.simResultPredicate}>
                Bobot {simResult.point.toFixed(1)} • {simResult.predicate}
              </Text>
            </View>

            <LinearGradient
              colors={['#6366F1', '#A855F7']}
              style={styles.simGradeBadge}
            >
              <Text style={styles.simGradeText}>{simResult.grade}</Text>
            </LinearGradient>
          </LinearGradient>
        </View>
      )}

      {/* Resilience Testing Trigger (Level 10) */}
      <View style={styles.demoRow}>
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={simulateError}
          style={[
            styles.demoBtn,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <Ionicons name="pulse-outline" size={14} color={colors.textMuted} />
          <Text style={[styles.demoBtnText, { color: colors.textMuted }]}>
            Uji Error State & Retry Akademik (Level 10)
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 34,
  },
  identityCard: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 18,
    marginBottom: 16,
  },
  identityTopRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  verifiedAcademicPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
  },
  verifiedText: {
    fontSize: 11.5,
    fontWeight: '800',
  },
  studentName: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8,
  },
  nimChip: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    marginBottom: 8,
  },
  nimChipText: {
    fontSize: 12,
    fontWeight: '800',
  },
  campusText: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 19,
    marginBottom: 14,
  },
  courseMetaDivider: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  courseMetaItem: {
    flex: 1,
    minWidth: 130,
  },
  metaLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 14,
    fontWeight: '800',
  },
  scoreGradientWrap: {
    borderRadius: 24,
    marginBottom: 16,
  },
  scoreGradientCard: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.38)',
    overflow: 'hidden',
  },
  scoreDecorOrb: {
    position: 'absolute',
    right: -30,
    top: -30,
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(168, 85, 247, 0.18)',
  },
  scoreTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  currentScoreTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    borderColor: 'rgba(56, 189, 248, 0.38)',
    borderWidth: 1,
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 999,
  },
  currentScoreTagText: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '800',
  },
  lpPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(251, 191, 36, 0.16)',
    borderColor: 'rgba(251, 191, 36, 0.4)',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
  },
  lpPillText: {
    color: '#FDE68A',
    fontSize: 12.5,
    fontWeight: '900',
  },
  scoreMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  scoreNumberBlock: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  bigScoreNumber: {
    color: '#FFFFFF',
    fontSize: 52,
    fontWeight: '900',
    letterSpacing: -1,
  },
  outOfText: {
    color: '#CBD5E1',
    fontSize: 14,
    fontWeight: '700',
  },
  gradeBadgeBox: {
    width: 68,
    height: 68,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradeCaption: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  gradeLetter: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
  },
  scoreCourseFooter: {
    color: '#E2E8F0',
    fontSize: 12.5,
    fontWeight: '600',
  },
  segmentedCard: {
    flexDirection: 'row',
    borderRadius: 999,
    borderWidth: 1,
    padding: 4,
    marginBottom: 16,
  },
  tabSlot: {
    flex: 1,
  },
  activeTabPill: {
    paddingVertical: 9,
    paddingHorizontal: 6,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTabText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '800',
  },
  inactiveTabPill: {
    paddingVertical: 9,
    paddingHorizontal: 6,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inactiveTabText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  glassSectionCard: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 18,
    marginBottom: 18,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16.5,
    fontWeight: '800',
    flexShrink: 1,
  },
  subHeaderBlock: {
    marginBottom: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 13,
    borderWidth: 1.5,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 13.5,
    paddingVertical: 2,
  },
  courseCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    paddingBottom: 2,
    marginBottom: 10,
  },
  levelItemBox: {
    borderRadius: 15,
    borderWidth: 1,
    padding: 12,
    paddingBottom: 0,
    marginBottom: 10,
  },
  simSubtitle: {
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4,
    marginBottom: 16,
  },
  simInputRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  simField: {
    flex: 1,
    minWidth: 88,
  },
  simLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    marginBottom: 6,
  },
  simInput: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
  },
  simResultBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.35)',
    gap: 12,
  },
  simResultLeft: {
    flex: 1,
  },
  simResultCaption: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  simResultScore: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 2,
  },
  simResultPredicate: {
    color: '#38BDF8',
    fontSize: 12.5,
    fontWeight: '700',
  },
  simGradeBadge: {
    width: 54,
    height: 54,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  simGradeText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
  },
  demoRow: {
    alignItems: 'center',
    marginTop: 10,
  },
  demoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  demoBtnText: {
    fontSize: 11.5,
    fontWeight: '600',
  },
});
