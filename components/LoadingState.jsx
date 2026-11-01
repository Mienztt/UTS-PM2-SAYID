import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

/**
 * LoadingState — Skeleton shimmer Cyber-Glassmorphism & Error state dengan tombol Retry (Level 10).
 */
export default function LoadingState({
  loading = false,
  error = null,
  onRetry,
  loadingText = 'Memuat data portofolio...',
  skeletonCount = 3,
}) {
  const { colors } = useTheme();
  const pulseAnim = useRef(new Animated.Value(0.45)).current;

  useEffect(() => {
    if (!loading) return undefined;

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.92,
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
            borderColor: colors.danger,
          },
          colors.shadowGlow,
        ]}
      >
        <View
          style={[
            styles.errorIconWrap,
            { backgroundColor: colors.dangerSoft },
          ]}
        >
          <Ionicons name="cloud-offline-outline" size={30} color={colors.danger} />
        </View>

        <Text style={[styles.errorTitle, { color: colors.text }]}>
          Gagal Memuat Data
        </Text>
        <Text style={[styles.errorDesc, { color: colors.textSecondary }]}>
          {error}
        </Text>

        {onRetry && (
          <TouchableOpacity activeOpacity={0.85} onPress={onRetry}>
            <LinearGradient
              colors={['#6366F1', '#A855F7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.retryBtn}
            >
              <Ionicons name="reload-outline" size={16} color="#FFFFFF" />
              <Text style={styles.retryBtnText}>Coba Lagi (Retry)</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  if (!loading) return null;

  return (
    <View style={styles.skeletonWrapper}>
      <View style={styles.loadingBanner}>
        <ActivityIndicator size="small" color={colors.secondary} />
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
          <View style={styles.skeletonHeader}>
            <View
              style={[
                styles.skeletonAvatar,
                { backgroundColor: colors.surfaceElevated },
              ]}
            />
            <View style={styles.skeletonLines}>
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
            </View>
          </View>

          <View
            style={[
              styles.skeletonBlock,
              { backgroundColor: colors.surfaceElevated },
            ]}
          />
          <View style={styles.skeletonTags}>
            <View
              style={[
                styles.skeletonPill,
                { backgroundColor: colors.surfaceElevated },
              ]}
            />
            <View
              style={[
                styles.skeletonPill,
                { backgroundColor: colors.surfaceElevated },
              ]}
            />
          </View>
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  skeletonWrapper: {
    paddingVertical: 8,
  },
  loadingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
    paddingHorizontal: 4,
  },
  loadingLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  skeletonCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    marginBottom: 14,
  },
  skeletonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  skeletonAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  skeletonLines: {
    flex: 1,
    gap: 8,
  },
  skeletonLineWide: {
    height: 14,
    width: '72%',
    borderRadius: 6,
  },
  skeletonLineShort: {
    height: 11,
    width: '45%',
    borderRadius: 6,
  },
  skeletonBlock: {
    height: 44,
    width: '100%',
    borderRadius: 10,
    marginBottom: 12,
  },
  skeletonTags: {
    flexDirection: 'row',
    gap: 8,
  },
  skeletonPill: {
    height: 24,
    width: 78,
    borderRadius: 999,
  },
  errorCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
    marginVertical: 14,
  },
  errorIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  errorTitle: {
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 6,
    textAlign: 'center',
  },
  errorDesc: {
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 18,
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 12,
  },
  retryBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
  },
});
