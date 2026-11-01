import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../context/ThemeContext';
import { useSimulatedFetch } from '../hooks/useSimulatedFetch';
import portfolioJson from '../data/portfolio.json';

import ProjectCard from '../components/ProjectCard';
import SkillBadge from '../components/SkillBadge';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';

export default function PortfolioScreen() {
  const { colors } = useTheme();

  const {
    data: portfolio,
    loading,
    isRefreshing,
    error,
    retry,
    refresh,
  } = useSimulatedFetch(() => portfolioJson, { delay: 260 });

  const [activeTab, setActiveTab] = useState('projects'); // 'projects' | 'skills'
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredProjects = useMemo(() => {
    const list = portfolio?.projects || [];
    if (!normalizedQuery) return list;

    return list.filter((item) => {
      const haystack = [
        item.title,
        item.category,
        item.shortDescription,
        ...(item.techStack || []),
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [portfolio, normalizedQuery]);

  const filteredSkillGroups = useMemo(() => {
    const groups = portfolio?.skillGroups || [];
    if (!normalizedQuery) return groups;

    return groups
      .map((group) => {
        const categoryMatches = group.category
          .toLowerCase()
          .includes(normalizedQuery);

        const matchedSkills = categoryMatches
          ? group.skills
          : (group.skills || []).filter((sk) =>
              sk.toLowerCase().includes(normalizedQuery)
            );

        return {
          ...group,
          skills: matchedSkills,
        };
      })
      .filter((group) => group.skills.length > 0);
  }, [portfolio, normalizedQuery]);

  if (loading || error || !portfolio) {
    return (
      <ScrollView
        style={[styles.screen, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.contentContainer}
      >
        <LoadingState
          loading={loading}
          error={error}
          onRetry={retry}
          loadingText="Memuat daftar proyek & keahlian..."
          skeletonCount={3}
        />
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={refresh}
          tintColor={colors.primary}
          colors={[colors.primary]}
        />
      }
    >
      {/* 1. Search Bar Minimalis di Atas */}
      <View
        style={[
          styles.searchBox,
          {
            backgroundColor: colors.surface,
            borderColor: searchFocused ? colors.primary : colors.border,
          },
        ]}
      >
        <Ionicons
          name="search-outline"
          size={17}
          color={searchFocused ? colors.primary : colors.textSecondary}
        />
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          placeholder={
            activeTab === 'projects'
              ? 'Cari proyek atau teknologi (Laravel, VB.NET, Expo)...'
              : 'Cari keahlian (PHP, Figma, Kerja Sama Tim)...'
          }
          placeholderTextColor={colors.textMuted}
          style={[styles.searchInput, { color: colors.text }]}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearchQuery('')}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name="close-circle"
              size={17}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* 2. Dua Tab Bersih: Projects & Skills */}
      <View
        style={[
          styles.tabContainer,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        {[
          { key: 'projects', label: 'Projects' },
          { key: 'skills', label: 'Skills' },
        ].map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              activeOpacity={0.85}
              onPress={() => setActiveTab(tab.key)}
              style={[
                styles.tabBtn,
                isActive && { backgroundColor: colors.primary },
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: isActive ? '#FFFFFF' : colors.textSecondary },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 3. Konten Berdasarkan Tab Aktif */}
      {activeTab === 'projects' ? (
        <View style={styles.listSection}>
          {filteredProjects.length === 0 ? (
            <EmptyState
              icon="folder-open-outline"
              title="Proyek Tidak Ditemukan"
              description={`Tidak ada proyek yang cocok dengan pencarian "${searchQuery}".`}
              actionLabel="Reset Pencarian"
              onAction={() => setSearchQuery('')}
            />
          ) : (
            filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))
          )}
        </View>
      ) : (
        <View style={styles.listSection}>
          {filteredSkillGroups.length === 0 ? (
            <EmptyState
              icon="code-slash-outline"
              title="Skill Tidak Ditemukan"
              description={`Tidak ada keahlian yang cocok dengan kata kunci "${searchQuery}".`}
              actionLabel="Reset Pencarian"
              onAction={() => setSearchQuery('')}
            />
          ) : (
            filteredSkillGroups.map((group) => (
              <View
                key={group.id}
                style={[
                  styles.skillGroupCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text style={[styles.groupTitle, { color: colors.text }]}>
                  {group.category}
                </Text>

                <View style={styles.badgesWrap}>
                  {group.skills.map((skillName) => (
                    <SkillBadge
                      key={`${group.id}-${skillName}`}
                      name={skillName}
                    />
                  ))}
                </View>
              </View>
            ))
          )}
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
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 14,
  },
  searchInput: {
    flex: 1,
    fontSize: 13.5,
    paddingVertical: 2,
  },
  tabContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    padding: 4,
    marginBottom: 24,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 13.5,
    fontWeight: '600',
  },
  listSection: {
    marginBottom: 8,
  },
  skillGroupCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
    marginBottom: 16,
  },
  groupTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 14,
  },
  badgesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});
