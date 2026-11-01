import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';

/**
 * ScoreProgressBar — Indikator visual persentase Learning Progress & nilai akademik
 * menggunakan bar berujung bulat (borderRadius: 999) dengan gradasi warna neon.
 */
export default function ScoreProgressBar({
  label,
  subtitle,
  value = 0,
  maxValue = 100,
  badgeText,
  gradientColors,
  showPercentage = true,
}) {
  const { colors } = useTheme();

  const safeMax = maxValue > 0 ? maxValue : 100;
  const rawPercent = (Number(value) / safeMax) * 100;
  const percentage = Math.min(100, Math.max(0, Math.round(rawPercent * 10) / 10));

  const barGradient =
    Array.isArray(gradientColors) && gradientColors.length >= 2
      ? gradientColors
      : percentage >= 95
      ? ['#38BDF8', '#6366F1']
      : percentage >= 85
      ? ['#6366F1', '#A855F7']
      : ['#A855F7', '#EC4899'];

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.labelWrap}>
          <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
          {subtitle ? (
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              {subtitle}
            </Text>
          ) : null}
        </View>

        <View style={styles.rightMeta}>
          {badgeText ? (
            <View
              style={[
                styles.gradeBadge,
                {
                  backgroundColor: colors.pillBg,
                  borderColor: colors.pillBorder,
                },
              ]}
            >
              <Text style={[styles.gradeText, { color: colors.accentCyan }]}>
                {badgeText}
              </Text>
            </View>
          ) : null}

          {showPercentage && (
            <Text style={[styles.percentText, { color: colors.accentCyan }]}>
              {percentage}%
            </Text>
          )}
        </View>
      </View>

      <View
        style={[
          styles.track,
          {
            backgroundColor: colors.surfaceElevated,
            borderColor: colors.border,
          },
        ]}
      >
        <LinearGradient
          colors={barGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.fill, { width: `${percentage}%` }]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 7,
  },
  labelWrap: {
    flex: 1,
    flexShrink: 1,
  },
  label: {
    fontSize: 13.5,
    fontWeight: '800',
    lineHeight: 19,
  },
  subtitle: {
    fontSize: 11.5,
    marginTop: 2,
    lineHeight: 16,
  },
  rightMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  gradeBadge: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
  },
  gradeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  percentText: {
    fontSize: 13,
    fontWeight: '800',
  },
  track: {
    height: 10,
    borderRadius: 999,
    borderWidth: 1,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
  },
});
