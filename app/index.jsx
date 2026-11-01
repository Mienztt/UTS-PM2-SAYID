import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Linking,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "../context/ThemeContext";
import { useSimulatedFetch } from "../hooks/useSimulatedFetch";
import profileJson from "../data/profile.json";

import ProfileHeader from "../components/ProfileHeader";
import StatCard from "../components/StatCard";
import TimelineItem from "../components/TimelineItem";
import LoadingState from "../components/LoadingState";

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const {
    data: profile,
    loading,
    isRefreshing,
    error,
    retry,
    refresh,
    simulateError,
  } = useSimulatedFetch(() => profileJson, { delay: 380 });

  const [timelineTab, setTimelineTab] = useState("all"); // 'all' | 'experience' | 'education'
  const [activeTrackId, setActiveTrackId] = useState("track-1");

  const openSpotifyTrack = async (url) => {
    if (!url) return;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      }
    } catch {
      // Abaikan apabila gagal membuka URL eksternal
    }
  };

  if (loading || error || !profile) {
    return (
      <ScrollView
        style={[styles.screen, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.contentContainer}
      >
        <LoadingState
          loading={loading}
          error={error}
          onRetry={retry}
          loadingText="Memuat profil developer & timeline..."
          skeletonCount={3}
        />
      </ScrollView>
    );
  }

  const timelineItems =
    timelineTab === "experience"
      ? profile.experience || []
      : timelineTab === "education"
        ? profile.education || []
        : [...(profile.experience || []), ...(profile.education || [])];

  const tracks = profile.spotifyRotation?.tracks || [];

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={refresh}
          tintColor={colors.primary}
          colors={[colors.primary]}
        />
      }
    >
      {/* 1. Hero & Identity Card (Props-driven) */}
      <ProfileHeader
        identity={profile.identity}
        socials={profile.socials}
        onExplorePortfolio={() => router.push("/portfolio")}
        onContactMe={() => router.push("/contact")}
      />

      {/* 2. Quick Stats Grid */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <Ionicons name="flash-outline" size={18} color={colors.primary} />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Quick Highlights
          </Text>
        </View>
        <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
          Ringkasan kontribusi & pencapaian akademik
        </Text>
      </View>

      <View style={styles.statsGrid}>
        {(profile.quickStats || []).map((stat) => (
          <StatCard
            key={stat.id}
            icon={stat.icon}
            value={stat.value}
            label={stat.label}
            subtext={stat.subtext}
            accent={stat.accent}
          />
        ))}
      </View>

      {/* 3. About Me Card */}
      <View
        style={[
          styles.sectionCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        <View style={styles.sectionTitleRow}>
          <Ionicons
            name="person-circle-outline"
            size={20}
            color={colors.secondary}
          />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {profile.about?.greeting || "Tentang Saya"}
          </Text>
        </View>

        <Text style={[styles.aboutText, { color: colors.textSecondary }]}>
          {profile.about?.description}
        </Text>

        <View style={styles.focusList}>
          {(profile.about?.focusAreas || []).map((area) => (
            <View
              key={area}
              style={[
                styles.focusPill,
                {
                  backgroundColor: colors.surfaceElevated,
                  borderColor: colors.border,
                },
              ]}
            >
              <Ionicons
                name="checkmark-done"
                size={14}
                color={colors.primary}
              />
              <Text style={[styles.focusPillText, { color: colors.text }]}>
                {area}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* 4. Education & Experience Timeline */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <Ionicons
            name="git-network-outline"
            size={18}
            color={colors.primary}
          />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Education & Experience
          </Text>
        </View>
        <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
          Perjalanan akademik, organisasi, dan pengembangan perangkat lunak
        </Text>
      </View>

      <View
        style={[
          styles.segmentedControl,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        {[
          { key: "all", label: "Semua" },
          { key: "experience", label: "Experience" },
          { key: "education", label: "Education" },
        ].map((tab) => {
          const isActive = timelineTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              activeOpacity={0.8}
              onPress={() => setTimelineTab(tab.key)}
              style={[
                styles.segmentBtn,
                isActive && { backgroundColor: colors.primary },
              ]}
            >
              <Text
                style={[
                  styles.segmentBtnText,
                  { color: isActive ? "#0B0F19" : colors.textSecondary },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.timelineWrap}>
        {timelineItems.map((item, idx) => (
          <TimelineItem
            key={item.id}
            item={item}
            isLast={idx === timelineItems.length - 1}
          />
        ))}
      </View>

      {/* 5. Hobbies & Creative Interests */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <Ionicons
            name="sparkles-outline"
            size={18}
            color={colors.secondary}
          />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Hobbies & Interests
          </Text>
        </View>
      </View>

      <View style={styles.hobbiesGrid}>
        {(profile.hobbies || []).map((hobby) => (
          <View
            key={hobby.id}
            style={[
              styles.hobbyCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <View
              style={[
                styles.hobbyIconWrap,
                { backgroundColor: colors.secondarySoft },
              ]}
            >
              <Ionicons name={hobby.icon} size={18} color={colors.secondary} />
            </View>
            <Text style={[styles.hobbyName, { color: colors.text }]}>
              {hobby.name}
            </Text>
            <Text style={[styles.hobbyDesc, { color: colors.textSecondary }]}>
              {hobby.description}
            </Text>
          </View>
        ))}
      </View>

      {/* 6. Daily Music / Spotify Coding Rotation (Inspired by alfari.my.id) */}
      <View
        style={[
          styles.spotifyCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        <View style={styles.spotifyHeader}>
          <View style={styles.spotifyTitleGroup}>
            <View
              style={[
                styles.spotifyBadgeIcon,
                { backgroundColor: colors.successSoft },
              ]}
            >
              <Ionicons name="musical-notes" size={20} color={colors.success} />
            </View>
            <View style={styles.spotifyTitleCol}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                {profile.spotifyRotation?.playlistName ||
                  "Daily Music Rotation"}
              </Text>
              <Text
                style={[
                  styles.spotifySubtitle,
                  { color: colors.textSecondary },
                ]}
              >
                {profile.spotifyRotation?.subtitle}
              </Text>
            </View>
          </View>
        </View>

        {tracks.map((track, idx) => {
          const isPlaying = activeTrackId === track.id;
          return (
            <TouchableOpacity
              key={track.id}
              activeOpacity={0.82}
              onPress={() => setActiveTrackId(track.id)}
              style={[
                styles.trackRow,
                {
                  backgroundColor: isPlaying
                    ? colors.primarySoft
                    : colors.surfaceElevated,
                  borderColor: isPlaying ? colors.primary : colors.border,
                },
              ]}
            >
              <View style={styles.trackLeft}>
                <View
                  style={[
                    styles.trackIndexCircle,
                    {
                      backgroundColor: isPlaying
                        ? colors.primary
                        : colors.surface,
                    },
                  ]}
                >
                  {isPlaying ? (
                    <Ionicons name="volume-high" size={14} color="#0B0F19" />
                  ) : (
                    <Text
                      style={[
                        styles.trackIndexText,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {idx + 1}
                    </Text>
                  )}
                </View>

                <View style={styles.trackInfo}>
                  <Text style={[styles.trackTitle, { color: colors.text }]}>
                    {track.title}
                  </Text>
                  <Text
                    style={[
                      styles.trackArtist,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {track.artist} • {track.vibe}
                  </Text>
                </View>
              </View>

              <View style={styles.trackRight}>
                <Text
                  style={[styles.trackDuration, { color: colors.textMuted }]}
                >
                  {track.duration}
                </Text>
                <TouchableOpacity
                  onPress={() => openSpotifyTrack(track.spotifyUrl)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons
                    name="open-outline"
                    size={16}
                    color={isPlaying ? colors.primary : colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Level 10 Resilience Demo Utility */}
      <View style={styles.demoFooter}>
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={simulateError}
          style={[
            styles.demoBtn,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <Ionicons name="bug-outline" size={14} color={colors.textMuted} />
          <Text style={[styles.demoBtnText, { color: colors.textMuted }]}>
            Uji Error State & Tombol Retry (Level 10)
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  sectionHeader: {
    marginBottom: 12,
    marginTop: 6,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    flexShrink: 1,
  },
  sectionSubtitle: {
    fontSize: 12.5,
    marginTop: 3,
    lineHeight: 18,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },
  sectionCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    marginBottom: 20,
  },
  aboutText: {
    fontSize: 13.5,
    lineHeight: 21,
    marginTop: 10,
    marginBottom: 14,
  },
  focusList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  focusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
  },
  focusPillText: {
    fontSize: 12,
    fontWeight: "600",
    flexShrink: 1,
  },
  segmentedControl: {
    flexDirection: "row",
    borderRadius: 12,
    borderWidth: 1,
    padding: 4,
    marginBottom: 14,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  segmentBtnText: {
    fontSize: 12.5,
    fontWeight: "700",
  },
  timelineWrap: {
    marginBottom: 18,
  },
  hobbiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 22,
  },
  hobbyCard: {
    flexGrow: 1,
    flexBasis: "46%",
    minWidth: 145,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
  },
  hobbyIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 9,
  },
  hobbyName: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
  },
  hobbyDesc: {
    fontSize: 12,
    lineHeight: 17.5,
  },
  spotifyCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    marginBottom: 18,
  },
  spotifyHeader: {
    marginBottom: 14,
  },
  spotifyTitleGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  spotifyBadgeIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  spotifyTitleCol: {
    flex: 1,
    flexShrink: 1,
  },
  spotifySubtitle: {
    fontSize: 12,
    marginTop: 2,
    lineHeight: 17,
  },
  trackRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 11,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
    gap: 10,
  },
  trackLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  trackIndexCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  trackIndexText: {
    fontSize: 12,
    fontWeight: "700",
  },
  trackInfo: {
    flex: 1,
    flexShrink: 1,
  },
  trackTitle: {
    fontSize: 13.5,
    fontWeight: "700",
  },
  trackArtist: {
    fontSize: 11.5,
    marginTop: 2,
  },
  trackRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },
  trackDuration: {
    fontSize: 11.5,
    fontWeight: "600",
  },
  demoFooter: {
    alignItems: "center",
    marginTop: 4,
  },
  demoBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  demoBtnText: {
    fontSize: 11.5,
    fontWeight: "600",
  },
});
