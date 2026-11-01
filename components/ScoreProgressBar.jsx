import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

/**
 * ScoreProgressBar — Indikator persentase Learning Progress minimalis
 * dengan satu warna aksen konsisten (#8B5CF6) tanpa gradasi mencolok.
 */
export default function ScoreProgressBar({
  label,
  subtitle,
  value = 0,
  maxValue = 100,
  isLast = false,
}) {
  const { colors } = useTheme();

  const safeMax = maxValue > 0 ? maxValue : 100;
  const rawPercent = (Number(value) / safeMax) * 100;
  const percentage = Math.min(100, Math.max(0, Math.round(rawPercent * 10) / 10));

  return (
    <View style={[styles.container, !isLast && styles.spacing]}>
      <View style={styles.headerRow}>
        <View style={styles.labelWrap}>
          <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
          {subtitle ? (
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              {subtitle}
            </Text>
          ) : null}
        </View>

        <Text style={[styles.percentText, { color: colors.primary }]}>
          {percentage}%
        </Text>
      </View>

      <View
        style={[
          styles.track,
          {
            backgroundColor: colors.tagBg,
            borderColor: colors.border,
          },
        ]}
      >
        <View
          style={[
            styles.fill,
            {
              width: `${percentage}%`,
              backgroundColor: colors.primary,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  spacing: {
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 8,
  },
  labelWrap: {
    flex: 1,
    flexShrink: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 2,
  },
  percentText: {
    fontSize: 13.5,
    fontWeight: '700',
  },
  track: {
    height: 7,
    borderRadius: 999,
    borderWidth: 1,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
  },
});
