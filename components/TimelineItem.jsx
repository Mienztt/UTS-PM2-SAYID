import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

/**
 * TimelineItem — Komponen timeline minimalis untuk Education & Work Experience.
 */
export default function TimelineItem({ item, isLast = false }) {
  const { colors } = useTheme();
  if (!item) return null;

  const subtitle = item.subtitle || item.organization;

  return (
    <View style={styles.row}>
      {/* Garis vertikal & titik minimalis */}
      <View style={styles.railCol}>
        <View
          style={[
            styles.dot,
            {
              borderColor: colors.primary,
              backgroundColor: colors.background,
            },
          ]}
        />
        {!isLast && (
          <View style={[styles.line, { backgroundColor: colors.border }]} />
        )}
      </View>

      {/* Kartu Konten */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            marginBottom: isLast ? 0 : 14,
          },
        ]}
      >
        <Text style={[styles.period, { color: colors.primary }]}>
          {item.period}
        </Text>

        <Text style={[styles.title, { color: colors.text }]}>
          {item.title}
        </Text>

        {subtitle ? (
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {subtitle}
          </Text>
        ) : null}

        {item.description ? (
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            {item.description}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  railCol: {
    width: 20,
    alignItems: 'center',
    marginRight: 12,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    marginTop: 20,
  },
  line: {
    flex: 1,
    width: 1,
    marginTop: 6,
  },
  card: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
  },
  period: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  title: {
    fontSize: 15.5,
    fontWeight: '700',
    lineHeight: 21,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13.5,
    fontWeight: '500',
    lineHeight: 20,
  },
  description: {
    fontSize: 13.5,
    lineHeight: 22,
    marginTop: 8,
  },
});
