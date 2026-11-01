import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

/**
 * LoadingState — Skeleton shimmer & Error state minimalis dengan tombol Retry.
 */
export default function LoadingState({
  loading = false,
  error = null,
  onRetry,
  loadingText = 'Memuat data...',
  skeletonCount = 3,
}) {
  const { colors } = useTheme();
  const pulseAnim = useRef(new Animated.Value(0.45)).current;

  useEffect(() => {
    if (!loading) return undefined;

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.85,
          duration: 650,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.45,
          duration: 650,
          useNativeDriver: true,
        }),
      ])
    );

    loop.start();
    return () => loop.stop();
  }, [loading, pulseAnim]);

  if (error) {
    return (
      <View
        style={[
          styles.errorCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        <View
          style={[
            styles.errorIconWrap,
            { backgroundColor: colors.dangerSoft },
          ]}
        >
          <Ionicons name="alert-circle-outline" size={22} color={colors.danger} />
        </View>

        <Text style={[styles.errorTitle, { color: colors.text }]}>
          Gagal Memuat Data
        </Text>
        <Text style={[styles.errorDesc, { color: colors.textSecondary }]}>
          {error}
        </Text>

        {onRetry && (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={onRetry}
            style={[styles.retryBtn, { backgroundColor: colors.primary }]}
          >
            <Text style={styles.retryBtnText}>Coba Lagi</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  if (!loading) return null;

  return (
    <View style={styles.skeletonWrapper}>
      <View style={styles.loadingBanner}>
        <ActivityIndicator size="small" color={colors.primary} />
        <Text style={[styles.loadingLabel, { color: colors.textSecondary }]}>
          {loadingText}
        </Text>
      </View>

      {Array.from({ length: skeletonCount }).map((_, idx) => (
        <Animated.View
          key={`skeleton-${idx}`}
          style={[
            styles.skeletonCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              opacity: pulseAnim,
            },
          ]}
        >
          <View
            style={[
              styles.skeletonLineWide,
              { backgroundColor: colors.surfaceElevated },
            ]}
          />
          <View
            style={[
              styles.skeletonLineShort,
              { backgroundColor: colors.surfaceElevated },
            ]}
          />
          <View
            style={[
              styles.skeletonBlock,
              { backgroundColor: colors.surfaceElevated },
            ]}
          />
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  skeletonWrapper: {
    paddingVertical: 4,
  },
  loadingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  loadingLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  skeletonCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
    marginBottom: 14,
  },
  skeletonLineWide: {
    height: 14,
    width: '65%',
    borderRadius: 6,
    marginBottom: 8,
  },
  skeletonLineShort: {
    height: 11,
    width: '40%',
    borderRadius: 6,
    marginBottom: 14,
  },
  skeletonBlock: {
    height: 38,
    width: '100%',
    borderRadius: 10,
  },
  errorCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
  },
  errorIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
    textAlign: 'center',
  },
  errorDesc: {
    fontSize: 13.5,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
});
