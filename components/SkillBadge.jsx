import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

/**
 * SkillBadge — Komponen daftar skill Cyber-Glassmorphism dengan bar bergradasi neon.
 */
export default function SkillBadge({ skill, compact = false }) {
  const { colors } = useTheme();
  if (!skill) return null;

  const isAdvanced = skill.level === 'Advanced';
  const accentColor = isAdvanced ? colors.accentCyan : colors.secondary;
  const accentSoft = isAdvanced ? colors.cyanSoft : colors.secondarySoft;
  const proficiency = Math.min(100, Math.max(0, Number(skill.proficiency) || 85));

  if (compact) {
    return (
      <View
        style={[
          styles.compactPill,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        <Ionicons
          name={skill.icon || 'code-slash-outline'}
          size={14}
          color={accentColor}
        />
        <Text style={[styles.compactText, { color: colors.text }]}>{skill.name}</Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
        colors.shadowGlow,
      ]}
    >
      <View style={styles.topRow}>
        <View style={styles.titleRow}>
          <View style={[styles.iconBox, { backgroundColor: accentSoft }]}>
            <Ionicons
              name={skill.icon || 'code-slash-outline'}
              size={18}
              color={accentColor}
            />
          </View>
          <View style={styles.textCol}>
            <Text style={[styles.name, { color: colors.text }]}>{skill.name}</Text>
            <Text style={[styles.category, { color: colors.textSecondary }]}>
              {skill.category}
            </Text>
          </View>
        </View>

        <View style={[styles.levelPill, { backgroundColor: accentSoft }]}>
          <Text style={[styles.levelText, { color: accentColor }]}>
            {skill.level || 'Verified'}
          </Text>
        </View>
      </View>

      <View style={styles.progressRow}>
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
            colors={
              isAdvanced ? ['#6366F1', '#38BDF8'] : ['#6366F1', '#A855F7']
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.fill, { width: `${proficiency}%` }]}
          />
        </View>
        <Text style={[styles.percentText, { color: colors.text }]}>
          {proficiency}%
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  compactPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
  },
  compactText: {
    fontSize: 12.5,
    fontWeight: '600',
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    marginBottom: 11,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    minWidth: 150,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textCol: {
    flex: 1,
    flexShrink: 1,
  },
  name: {
    fontSize: 14.5,
    fontWeight: '800',
  },
  category: {
    fontSize: 11.5,
    marginTop: 1,
  },
  levelPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  levelText: {
    fontSize: 11,
    fontWeight: '700',
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  track: {
    flex: 1,
    height: 8,
    borderRadius: 999,
    borderWidth: 1,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
  },
  percentText: {
    fontSize: 12,
    fontWeight: '800',
    minWidth: 36,
    textAlign: 'right',
  },
});
