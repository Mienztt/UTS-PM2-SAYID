import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

/**
 * StatCard — Kartu Bento Row 3 kolom sejajar (4+ Projects, 10+ Tech Stack, 3+ Roles)
 * dengan ikon di pojok atas, angka tebal, dan sub-teks tanpa teks terpotong.
 */
export default function StatCard({
  icon = 'code-slash-outline',
  value,
  label,
  subtext,
  accent = 'indigo',
}) {
  const { colors } = useTheme();

  const accentColor =
    accent === 'purple'
      ? colors.purple
      : accent === 'cyan'
      ? colors.accentCyan
      : colors.indigo;

  const accentBg =
    accent === 'purple'
      ? colors.secondarySoft
      : accent === 'cyan'
      ? colors.cyanSoft
      : colors.primarySoft;

  return (
    <View
      style={[
        styles.bentoCard,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
        colors.shadowGlow,
      ]}
    >
      <View style={styles.topCornerRow}>
        <View style={[styles.iconBadge, { backgroundColor: accentBg }]}>
          <Ionicons name={icon} size={16} color={accentColor} />
        </View>
        <Ionicons
          name="arrow-up-outline"
          size={13}
          color={colors.textMuted}
          style={styles.diagonalArrow}
        />
      </View>

      <Text style={[styles.numberText, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.labelText, { color: accentColor }]}>{label}</Text>
      {subtext ? (
        <Text style={[styles.subText, { color: colors.textSecondary }]}>
          {subtext}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  bentoCard: {
    flex: 1,
    minWidth: 96,
    borderRadius: 18,
    borderWidth: 1,
    paddingVertical: 13,
    paddingHorizontal: 11,
    justifyContent: 'space-between',
  },
  topCornerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  iconBadge: {
    width: 30,
    height: 30,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  diagonalArrow: {
    transform: [{ rotate: '45deg' }],
  },
  numberText: {
    fontSize: 21,
    fontWeight: '800',
    letterSpacing: -0.4,
    marginBottom: 2,
  },
  labelText: {
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 2,
  },
  subText: {
    fontSize: 10.5,
    lineHeight: 14,
    fontWeight: '500',
  },
});
