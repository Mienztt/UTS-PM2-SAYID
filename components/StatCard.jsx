import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

/**
 * StatCard — Kartu statistik ringkas & bersih (3 kolom sejajar).
 */
export default function StatCard({
  icon = 'code-slash-outline',
  value,
  label,
  subtext,
}) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
      <Ionicons
        name={icon}
        size={16}
        color={colors.primary}
        style={styles.icon}
      />
      <Text style={[styles.valueText, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.labelText, { color: colors.text }]}>{label}</Text>
      {subtext ? (
        <Text style={[styles.subText, { color: colors.textSecondary }]}>
          {subtext}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 96,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
  },
  icon: {
    marginBottom: 8,
  },
  valueText: {
    fontSize: 19,
    fontWeight: '700',
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  labelText: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  subText: {
    fontSize: 11,
    lineHeight: 15,
  },
});
