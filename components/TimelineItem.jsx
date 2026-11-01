import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

/**
 * TimelineItem — Komponen reusable Education & Experience bergaya Cyber-Glassmorphism
 * dengan garis vertikal timeline berwarna #6366F1 (Syarat Redesign Section 3).
 */
export default function TimelineItem({ item, isLast = false }) {
  const { colors } = useTheme();
  if (!item) return null;

  const isEducation = item.type === 'education';
  const accentColor = isEducation ? colors.accentCyan : colors.purple;
  const accentSoft = isEducation ? colors.cyanSoft : colors.secondarySoft;

  return (
    <View style={styles.row}>
      {/* Vertical Rail (#6366F1) & Gradient Node */}
      <View style={styles.railContainer}>
        <LinearGradient
          colors={['#6366F1', '#A855F7']}
          style={styles.nodeRing}
        >
          <View
            style={[
              styles.nodeCenter,
              { backgroundColor: colors.surfaceSolid },
            ]}
          />
        </LinearGradient>

        {!isLast && <View style={styles.railLine} />}
      </View>

      {/* Cyber-Glass Card */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            marginBottom: isLast ? 4 : 14,
          },
          colors.shadowGlow,
        ]}
      >
        <View style={styles.metaHeader}>
          <View
            style={[
              styles.periodBadge,
              {
                backgroundColor: colors.primarySoft,
                borderColor: 'rgba(99, 102, 241, 0.32)',
              },
            ]}
          >
            <Ionicons name="calendar-outline" size={12} color="#818CF8" />
            <Text style={[styles.periodText, { color: colors.text }]}>
              {item.period}
            </Text>
          </View>

          {item.badge ? (
            <View style={[styles.typeBadge, { backgroundColor: accentSoft }]}>
              <Text style={[styles.typeBadgeText, { color: accentColor }]}>
                {item.badge}
              </Text>
            </View>
          ) : null}
        </View>

        <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
        <Text style={[styles.organization, { color: accentColor }]}>
          {item.organization}
        </Text>

        {item.location ? (
          <Text style={[styles.location, { color: colors.textSecondary }]}>
            {item.location}
          </Text>
        ) : null}

        {item.description ? (
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            {item.description}
          </Text>
        ) : null}

        {Array.isArray(item.highlights) && item.highlights.length > 0 && (
          <View style={styles.tagsWrap}>
            {item.highlights.map((tag) => (
              <View
                key={tag}
                style={[
                  styles.tagChip,
                  {
                    backgroundColor: colors.surfaceElevated,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text style={[styles.tagText, { color: colors.text }]}>{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  railContainer: {
    width: 26,
    alignItems: 'center',
    marginRight: 10,
  },
  nodeRing: {
    width: 18,
    height: 18,
    borderRadius: 9,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  nodeCenter: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
  railLine: {
    flex: 1,
    width: 2.5,
    backgroundColor: '#6366F1',
    marginVertical: 4,
    borderRadius: 2,
  },
  card: {
    flex: 1,
    flexShrink: 1,
    borderRadius: 18,
    borderWidth: 1,
    padding: 15,
  },
  metaHeader: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 8,
  },
  periodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  periodText: {
    fontSize: 11,
    fontWeight: '700',
  },
  typeBadge: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  title: {
    fontSize: 15.5,
    fontWeight: '800',
    marginBottom: 3,
  },
  organization: {
    fontSize: 13.5,
    fontWeight: '700',
    marginBottom: 3,
  },
  location: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  description: {
    fontSize: 13,
    lineHeight: 19.5,
    marginBottom: 10,
  },
  tagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tagChip: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
