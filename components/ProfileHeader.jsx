import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

/**
 * ProfileHeader — Hero Cyber-Glassmorphism terinspirasi langsung dari alfari.my.id
 * Menampilkan Glowing Pill Badge, Avatar cincin LinearGradient (#6366F1 -> #EC4899),
 * identitas Sayid Abdul Aziz (NIM 2425050522 - Universitas Ma'soem), & Dual Action Buttons.
 */
export default function ProfileHeader({
  identity,
  onExplorePortfolio,
  onContactMe,
}) {
  const { colors, isDark } = useTheme();
  const [imageError, setImageError] = useState(false);

  if (!identity) return null;

  return (
    <View
      style={[
        styles.heroCard,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
        colors.shadowGlow,
      ]}
    >
      {/* Ambient Cyber Glow Overlay */}
      <LinearGradient
        colors={colors.gradientHeroGlow}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.ambientGlow}
      />

      {/* 1. Glowing Pill Badge */}
      <View
        style={[
          styles.welcomePill,
          {
            backgroundColor: 'rgba(139, 92, 246, 0.15)',
            borderColor: 'rgba(139, 92, 246, 0.4)',
          },
        ]}
      >
        <Text
          style={[
            styles.welcomePillText,
            { color: isDark ? '#E9D5FF' : colors.secondary },
          ]}
        >
          {identity.welcomeBadge || '✨ Welcome to My Portfolio'}
        </Text>
      </View>

      {/* 2. Circular Avatar Frame with LinearGradient Ring (#6366F1 -> #EC4899) */}
      <View style={[styles.avatarShadowWrap, colors.shadowGlow]}>
        <LinearGradient
          colors={['#6366F1', '#EC4899']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.avatarGradientRing}
        >
          <View
            style={[
              styles.avatarInnerBorder,
              { backgroundColor: colors.surfaceSolid },
            ]}
          >
            {identity.avatarUrl && !imageError ? (
              <Image
                source={{ uri: identity.avatarUrl }}
                style={styles.avatarImage}
                onError={() => setImageError(true)}
              />
            ) : (
              <LinearGradient
                colors={['#1E1B4B', '#311042']}
                style={styles.avatarFallback}
              >
                <Text style={styles.avatarInitials}>
                  {identity.avatarInitials || 'SA'}
                </Text>
              </LinearGradient>
            )}
          </View>
        </LinearGradient>
      </View>

      {/* 3. Hero Typography */}
      <Text style={[styles.hiText, { color: colors.textSecondary }]}>
        {identity.greetingPrefix || "Hi, I'm"}
      </Text>

      <Text style={[styles.fullName, { color: colors.text }]}>
        {identity.name}
      </Text>

      {/* NIM & Semester Pill Badge */}
      <View
        style={[
          styles.nimPill,
          {
            backgroundColor: colors.cyanSoft,
            borderColor: isDark ? 'rgba(56, 189, 248, 0.35)' : colors.accentCyan,
          },
        ]}
      >
        <Ionicons name="id-card-outline" size={14} color={colors.accentCyan} />
        <Text style={[styles.nimPillText, { color: colors.accentCyan }]}>
          {identity.nimBadge || `NIM: ${identity.nim} • Semester ${identity.semester}`}
        </Text>
      </View>

      {/* Campus & Role */}
      <Text style={[styles.campusText, { color: colors.text }]}>
        {identity.campusShort || "S1 Sistem Informasi - Universitas Ma'soem"}
      </Text>

      <Text style={[styles.roleText, { color: colors.secondary }]}>
        {identity.role}
      </Text>

      {identity.tagline ? (
        <Text style={[styles.tagline, { color: colors.textSecondary }]}>
          {identity.tagline}
        </Text>
      ) : null}

      {/* 4. Dual Action Buttons */}
      <View style={styles.dualBtnRow}>
        <TouchableOpacity
          activeOpacity={0.86}
          onPress={onExplorePortfolio}
          style={[styles.primaryBtnWrapper, colors.shadowGlow]}
        >
          <LinearGradient
            colors={['#6366F1', '#A855F7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientBtn}
          >
            <Text style={styles.primaryBtnText}>Lihat Projek</Text>
            <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.82}
          onPress={onContactMe}
          style={[
            styles.ghostBtn,
            {
              borderColor: '#6366F1',
              backgroundColor: 'rgba(99, 102, 241, 0.08)',
            },
          ]}
        >
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={16}
            color={isDark ? '#C7D2FE' : '#4F46E5'}
          />
          <Text
            style={[
              styles.ghostBtnText,
              { color: isDark ? '#F8FAFC' : '#4F46E5' },
            ]}
          >
            Hubungi Saya
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 18,
  },
  ambientGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 170,
  },
  welcomePill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    marginBottom: 18,
  },
  welcomePillText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  avatarShadowWrap: {
    borderRadius: 999,
    marginBottom: 14,
  },
  avatarGradientRing: {
    width: 108,
    height: 108,
    borderRadius: 54,
    padding: 3.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInnerBorder: {
    width: '100%',
    height: '100%',
    borderRadius: 51,
    padding: 2.5,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 48,
  },
  avatarFallback: {
    width: '100%',
    height: '100%',
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitials: {
    color: '#F8FAFC',
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: 1,
  },
  hiText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  fullName: {
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -0.4,
    marginBottom: 10,
  },
  nimPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 13,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    marginBottom: 10,
  },
  nimPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  campusText: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  roleText: {
    fontSize: 12.5,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  tagline: {
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 18,
  },
  dualBtnRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 10,
  },
  primaryBtnWrapper: {
    flex: 1,
    borderRadius: 14,
  },
  gradientBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    paddingVertical: 12.5,
    paddingHorizontal: 12,
    borderRadius: 14,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
  },
  ghostBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  ghostBtnText: {
    fontSize: 13.5,
    fontWeight: '800',
  },
});
