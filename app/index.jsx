import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../context/ThemeContext';
import { useSimulatedFetch } from '../hooks/useSimulatedFetch';
import profileJson from '../data/profile.json';

import ProfileHeader from '../components/ProfileHeader';
import StatCard from '../components/StatCard';
import TimelineItem from '../components/TimelineItem';
import LoadingState from '../components/LoadingState';

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
  } = useSimulatedFetch(() => profileJson, { delay: 260 });

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
          loadingText="Memuat profil & riwayat CV..."
          skeletonCount={3}
        />
      </ScrollView>
    );
  }

  const educationList = profile.education || [];
  const experienceList = profile.experience || [];
  const hobbiesList = profile.hobbies || [];

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
      {/* 1. Hero Profile */}
      <View style={styles.section}>
        <ProfileHeader
          identity={profile.identity}
          onExplorePortfolio={() => router.push('/portfolio')}
          onContactMe={() => router.push('/contact')}
        />
      </View>

      {/* 2. Quick Stats (3 Kartu Ringkas) */}
      <View style={styles.section}>
        <View style={styles.statsRow}>
          {(profile.quickStats || []).map((stat) => (
            <StatCard
              key={stat.id}
              icon={stat.icon}
              value={stat.value}
              label={stat.label}
              subtext={stat.subtext}
            />
          ))}
        </View>
      </View>

      {/* 3. Timeline Education */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Education
        </Text>
        <View>
          {educationList.map((item, idx) => (
            <TimelineItem
              key={item.id}
              item={item}
              isLast={idx === educationList.length - 1}
            />
          ))}
        </View>
      </View>

      {/* 4. Timeline Work Experience */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Work Experience
        </Text>
        <View>
          {experienceList.map((item, idx) => (
            <TimelineItem
              key={item.id}
              item={item}
              isLast={idx === experienceList.length - 1}
            />
          ))}
        </View>
      </View>

      {/* 5. Seksi Kecil Hobi (Badminton & Lari) di Paling Bawah */}
      {hobbiesList.length > 0 && (
        <View style={styles.bottomSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Hobbies
          </Text>
          <View
            style={[
              styles.hobbiesCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            {hobbiesList.map((hobby, idx) => {
              const isLast = idx === hobbiesList.length - 1;
              return (
                <View key={hobby.id}>
                  <View style={styles.hobbyRow}>
                    <View
                      style={[
                        styles.hobbyIconBox,
                        {
                          backgroundColor: colors.accentSoft,
                          borderColor: colors.accentBorder,
                        },
                      ]}
                    >
                      <Ionicons
                        name={hobby.icon || 'fitness-outline'}
                        size={15}
                        color={colors.primary}
                      />
                    </View>
                    <View style={styles.hobbyTextCol}>
                      <Text style={[styles.hobbyName, { color: colors.text }]}>
                        {hobby.name}
                      </Text>
                      {hobby.detail ? (
                        <Text
                          style={[
                            styles.hobbyDetail,
                            { color: colors.textSecondary },
                          ]}
                        >
                          {hobby.detail}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                  {!isLast && (
                    <View
                      style={[
                        styles.hobbyDivider,
                        { backgroundColor: colors.border },
                      ]}
                    />
                  )}
                </View>
              );
            })}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  contentContainer: {
    padding: 18,
    paddingBottom: 36,
  },
  section: {
    marginBottom: 28,
  },
  bottomSection: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.2,
    marginBottom: 14,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  hobbiesCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
  },
  hobbyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  hobbyIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hobbyTextCol: {
    flex: 1,
  },
  hobbyName: {
    fontSize: 14,
    fontWeight: '600',
  },
  hobbyDetail: {
    fontSize: 12.5,
    lineHeight: 19,
    marginTop: 1,
  },
  hobbyDivider: {
    height: 1,
    marginVertical: 12,
  },
});
