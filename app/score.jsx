import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  RefreshControl,
} from 'react-native';

import { useTheme } from '../context/ThemeContext';
import { useSimulatedFetch } from '../hooks/useSimulatedFetch';
import academicScoreJson from '../data/academicScore.json';
import { calculateCourseFinalScore, getGradeInfo } from '../utils/validation';

import ScoreProgressBar from '../components/ScoreProgressBar';
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
  } = useSimulatedFetch(() => academicScoreJson, { delay: 260 });

  const [focusedField, setFocusedField] = useState(null);
  const [simTugas, setSimTugas] = useState('92');
  const [simUts, setSimUts] = useState('92');
  const [simUas, setSimUas] = useState('92');

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
          loadingText="Memuat data capaian akademik..."
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
          tintColor={colors.primary}
          colors={[colors.primary]}
        />
      }
    >
      {/* 1. Kartu Identitas Mahasiswa & Mata Kuliah (Level 8) */}
      <View style={styles.section}>
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.studentName, { color: colors.text }]}>
            {summary.studentName}
          </Text>
          <Text style={[styles.nimText, { color: colors.primary }]}>
            NIM {summary.nim}
          </Text>
          <Text style={[styles.campusText, { color: colors.textSecondary }]}>
            {summary.programCampus}
          </Text>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.courseInfoGrid}>
            <View style={styles.courseInfoCol}>
              <Text style={[styles.metaLabel, { color: colors.textSecondary }]}>
                Mata Kuliah
              </Text>
              <Text style={[styles.metaValue, { color: colors.text }]}>
                {summary.courseName}
              </Text>
            </View>

            <View style={styles.courseInfoCol}>
              <Text style={[styles.metaLabel, { color: colors.textSecondary }]}>
                Dosen Pengampu
              </Text>
              <Text style={[styles.metaValue, { color: colors.text }]}>
                {summary.lecturer}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* 2. Kartu Nilai Akhir & Learning Points Minimalis */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Academic Score
        </Text>

        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.scoreHeaderRow}>
            <Text style={[styles.scoreCaption, { color: colors.textSecondary }]}>
              Current Score
            </Text>
            <View
              style={[
                styles.lpBadge,
                {
                  backgroundColor: colors.accentSoft,
                  borderColor: colors.accentBorder,
                },
              ]}
            >
              <Text style={[styles.lpText, { color: colors.primary }]}>
                {summary.learningPointsLabel || `${summary.learningPoints} LP`}
              </Text>
            </View>
          </View>

          <View style={styles.scoreMainRow}>
            <View style={styles.scoreNumberWrap}>
              <Text style={[styles.scoreNumber, { color: colors.text }]}>
                {summary.currentScore}
              </Text>
              <Text style={[styles.scoreMax, { color: colors.textSecondary }]}>
                / 100
              </Text>
            </View>

            <View
              style={[
                styles.gradeBox,
                {
                  backgroundColor: colors.accentSoft,
                  borderColor: colors.accentBorder,
                },
              ]}
            >
              <Text style={[styles.gradeSmall, { color: colors.textSecondary }]}>
                Grade
              </Text>
              <Text style={[styles.gradeLetter, { color: colors.primary }]}>
                {summary.grade}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* 3. Learning Progress (Attendance, Practice, Quest, Challenge) */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Learning Progress
        </Text>

        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          {learningProgress.map((item, idx) => (
            <ScoreProgressBar
              key={item.id}
              label={item.label}
              subtitle={item.subtitle}
              value={item.percentage}
              maxValue={100}
              isLast={idx === learningProgress.length - 1}
            />
          ))}
        </View>
      </View>

      {/* 4. Kalkulator Simulasi Nilai Ringkas */}
      <View style={styles.bottomSection}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Grade Simulator
        </Text>

        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.simDesc, { color: colors.textSecondary }]}>
            Simulasi nilai akhir berdasarkan bobot Tugas (30%), UTS (35%), dan UAS (35%).
          </Text>

          <View style={styles.simInputsRow}>
            {[
              { id: 'tugas', label: 'Tugas', val: simTugas, setter: setSimTugas },
              { id: 'uts', label: 'UTS', val: simUts, setter: setSimUts },
              { id: 'uas', label: 'UAS', val: simUas, setter: setSimUas },
            ].map((field) => (
              <View key={field.id} style={styles.simField}>
                <Text style={[styles.simLabel, { color: colors.textSecondary }]}>
                  {field.label}
                </Text>
                <TextInput
                  value={field.val}
                  onChangeText={field.setter}
                  onFocus={() => setFocusedField(field.id)}
                  onBlur={() => setFocusedField(null)}
                  keyboardType="numeric"
                  maxLength={3}
                  style={[
                    styles.simInput,
                    {
                      backgroundColor: colors.surfaceInput,
                      borderColor:
                        focusedField === field.id
                          ? colors.primary
                          : colors.border,
                      color: colors.text,
                    },
                  ]}
                />
              </View>
            ))}
          </View>

          <View
            style={[
              styles.simResultRow,
              {
                backgroundColor: colors.surfaceElevated,
                borderColor: colors.border,
              },
            ]}
          >
            <View>
              <Text style={[styles.simResultLabel, { color: colors.textSecondary }]}>
                Hasil Perhitungan
              </Text>
              <Text style={[styles.simResultValue, { color: colors.text }]}>
                {simResult.finalScore} / 100 • {simResult.predicate}
              </Text>
            </View>

            <Text style={[styles.simResultGrade, { color: colors.primary }]}>
              {simResult.grade}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
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
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
  },
  studentName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  nimText: {
    fontSize: 13.5,
    fontWeight: '600',
    marginBottom: 4,
  },
  campusText: {
    fontSize: 13,
    lineHeight: 20,
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  courseInfoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  courseInfoCol: {
    flex: 1,
    minWidth: 130,
  },
  metaLabel: {
    fontSize: 12,
    marginBottom: 3,
  },
  metaValue: {
    fontSize: 14.5,
    fontWeight: '600',
  },
  scoreHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  scoreCaption: {
    fontSize: 13,
    fontWeight: '500',
  },
  lpBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  lpText: {
    fontSize: 12,
    fontWeight: '700',
  },
  scoreMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scoreNumberWrap: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  scoreNumber: {
    fontSize: 44,
    fontWeight: '800',
    letterSpacing: -1,
  },
  scoreMax: {
    fontSize: 15,
    fontWeight: '500',
  },
  gradeBox: {
    minWidth: 64,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  gradeSmall: {
    fontSize: 10.5,
    fontWeight: '600',
  },
  gradeLetter: {
    fontSize: 24,
    fontWeight: '800',
  },
  simDesc: {
    fontSize: 13.5,
    lineHeight: 22,
    marginBottom: 14,
  },
  simInputsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  simField: {
    flex: 1,
  },
  simLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 6,
  },
  simInput: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  simResultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  simResultLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  simResultValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  simResultGrade: {
    fontSize: 22,
    fontWeight: '800',
  },
});
