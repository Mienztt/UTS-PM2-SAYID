import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

/**
 * SkillBadge — Pill/Badge minimalis untuk menampilkan item keahlian (skill).
 */
export default function SkillBadge({ name }) {
  const { colors } = useTheme();
  if (!name) return null;

  return (
    <View
      style={[
        styles.pill,
        {
          backgroundColor: colors.tagBg,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={[styles.dot, { backgroundColor: colors.primary }]} />
      <Text style={[styles.label, { color: colors.text }]}>{name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
  },
});
