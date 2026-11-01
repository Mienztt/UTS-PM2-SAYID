import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const profilePhoto = require('../assets/profile.jpg');

/**
 * ProfileHeader — Hero minimalis bersih (Clean Dark Minimalist).
 * Menampilkan foto formal 96x96 bulat rapi berborder tipis #8B5CF6,
 * identitas asli CV, bio singkat dengan lineHeight nyaman (22), dan 2 tombol bersih.
 */
export default function ProfileHeader({
  identity,
  onExplorePortfolio,
  onContactMe,
}) {
  const { colors } = useTheme();
  const [imageError, setImageError] = useState(false);

  if (!identity) return null;

  const fullName = identity.nama || identity.name;
  const role = identity.profesi || identity.role;
  const campus = identity.kampus || identity.university;
  const location = identity.lokasiSingkat || identity.lokasi;
  const summary = identity.deskripsi || identity.tagline;

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
      {/* Top Identity Row / Centered Minimalist Avatar */}
      <View style={styles.identityHeader}>
        <View
          style={[
            styles.avatarFrame,
            {
              borderColor: colors.primary,
              backgroundColor: colors.surfaceElevated,
            },
          ]}
        >
          {!imageError ? (
            <Image
              source={profilePhoto}
              style={styles.avatarImage}
              resizeMode="cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={[styles.avatarInitials, { color: colors.text }]}>
                {identity.inisial || 'SA'}
              </Text>
            </View>
          )}
        </View>

        <Text style={[styles.nameText, { color: colors.text }]}>
          {fullName}
        </Text>

        <Text style={[styles.roleText, { color: colors.primary }]}>
          {role}
        </Text>

        {campus ? (
          <Text style={[styles.campusText, { color: colors.textSecondary }]}>
            {campus}
          </Text>
        ) : null}

        {/* Info Ringkas: NIM & Lokasi tanpa tumpukan badge ramai */}
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons
              name="id-card-outline"
              size={14}
              color={colors.textSecondary}
            />
            <Text style={[styles.metaText, { color: colors.textSecondary }]}>
              NIM {identity.nim}
            </Text>
          </View>

          <Text style={[styles.metaDot, { color: colors.border }]}>•</Text>

          <View style={styles.metaItem}>
            <Ionicons
              name="location-outline"
              size={14}
              color={colors.textSecondary}
            />
            <Text style={[styles.metaText, { color: colors.textSecondary }]}>
              {location}
            </Text>
          </View>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      {/* Profile Summary */}
      {summary ? (
        <Text style={[styles.bioText, { color: colors.textSecondary }]}>
          {summary}
        </Text>
      ) : null}

      {/* 2 Tombol Bersih: Lihat Portofolio & Kontak */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onExplorePortfolio}
          style={[styles.primaryBtn, { backgroundColor: colors.primary }]}
        >
          <Text style={styles.primaryBtnText}>Lihat Portofolio</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onContactMe}
          style={[
            styles.secondaryBtn,
            {
              backgroundColor: colors.surfaceElevated,
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.secondaryBtnText, { color: colors.text }]}>
            Kontak
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
  },
  identityHeader: {
    alignItems: 'center',
  },
  avatarFrame: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 1.5,
    overflow: 'hidden',
    marginBottom: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarFallback: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitials: {
    fontSize: 28,
    fontWeight: '700',
  },
  nameText: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.3,
    textAlign: 'center',
    marginBottom: 4,
  },
  roleText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  campusText: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 10,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaText: {
    fontSize: 12.5,
  },
  metaDot: {
    fontSize: 13,
  },
  divider: {
    height: 1,
    width: '100%',
    marginVertical: 16,
  },
  bioText: {
    fontSize: 13.5,
    lineHeight: 22,
    textAlign: 'left',
    marginBottom: 18,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  primaryBtn: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '600',
  },
  secondaryBtn: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    fontSize: 13.5,
    fontWeight: '600',
  },
});
