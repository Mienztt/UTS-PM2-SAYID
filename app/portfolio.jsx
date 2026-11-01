import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../context/ThemeContext';
import { useSimulatedFetch } from '../hooks/useSimulatedFetch';
import portfolioJson from '../data/portfolio.json';

import ProjectCard from '../components/ProjectCard';
import SkillBadge from '../components/SkillBadge';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';

const SKILL_CATEGORIES = ['Semua', 'Mobile', 'Frontend', 'Backend', 'System Info', 'Tools'];

export default function PortfolioScreen() {
  const { colors } = useTheme();

  const {
    data: portfolio,
    loading,
    isRefreshing,
    error,
    retry,
    refresh,
    simulateError,
  } = useSimulatedFetch(() => portfolioJson, { delay: 390 });

  const [activeTab, setActiveTab] = useState('projects'); // 'projects' | 'skills' | 'achievements'
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [selectedProjectCategory, setSelectedProjectCategory] = useState('Semua');
  const [selectedSkillCategory, setSelectedSkillCategory] = useState('Semua');

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredProjects = useMemo(() => {
    const list = portfolio?.projects || [];
    return list.filter((item) => {
      const matchesCategory =
        selectedProjectCategory === 'Semua' ||
        item.category === selectedProjectCategory;

      if (!matchesCategory) return false;
      if (!normalizedQuery) return true;

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
  }, [portfolio, selectedProjectCategory, normalizedQuery]);

  const filteredSkills = useMemo(() => {
    const list = portfolio?.skills || [];
    return list.filter((skill) => {
      const matchesCat =
        selectedSkillCategory === 'Semua' ||
        skill.category === selectedSkillCategory;

      if (!matchesCat) return false;
      if (!normalizedQuery) return true;

      const haystack = `${skill.name} ${skill.category} ${skill.level}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [portfolio, selectedSkillCategory, normalizedQuery]);

  const filteredAchievements = useMemo(() => {
    const list = portfolio?.certificates || [];
    if (!normalizedQuery) return list;
    return list.filter((cert) => {
      const haystack = [
        cert.title,
        cert.issuer,
        cert.category,
        cert.credentialId,
        ...(cert.skills || []),
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [portfolio, normalizedQuery]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedProjectCategory('Semua');
    setSelectedSkillCategory('Semua');
  };

  const openVerifyUrl = async (url) => {
    if (!url) return;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      }
    } catch {
      // Abaikan apabila gagal membuka tautan eksternal
    }
  };

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
          loadingText="Memuat Projects, Tech Stack, & Achievements..."
          skeletonCount={3}
        />
      </ScrollView>
    );
  }

  const projectCategories = portfolio.projectCategories || [
    'Semua',
    'Mobile',
    'Full-Stack',
    'Web',
    'Media & UI',
  ];

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
          tintColor="#A855F7"
          colors={['#6366F1', '#A855F7']}
        />
      }
    >
      {/* Header Title */}
      <View style={styles.headerBlock}>
        <Text style={[styles.heading, { color: colors.text }]}>
          Portfolio Showcase
        </Text>
        <Text style={[styles.subheading, { color: colors.textSecondary }]}>
          Eksplorasi perjalanan projek digital, validasi tech stack, serta pencapaian akademik & organisasi.
        </Text>
      </View>

      {/* Segmented Pill Tabs with LinearGradient Active Pill */}
      <View
        style={[
          styles.segmentedCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
          colors.shadowGlow,
        ]}
      >
        {[
          { key: 'projects', label: 'Projects', icon: 'code-slash-outline' },
          { key: 'skills', label: 'Tech Stack', icon: 'layers-outline' },
          { key: 'achievements', label: 'Achievements', icon: 'trophy-outline' },
        ].map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              activeOpacity={0.85}
              onPress={() => setActiveTab(tab.key)}
              style={styles.tabSlot}
            >
              {isActive ? (
                <LinearGradient
                  colors={['#6366F1', '#A855F7']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.activeTabPill}
                >
                  <Ionicons name={tab.icon} size={14} color="#FFFFFF" />
                  <Text style={styles.activeTabText}>{tab.label}</Text>
                </LinearGradient>
              ) : (
                <View style={styles.inactiveTabPill}>
                  <Ionicons
                    name={tab.icon}
                    size={14}
                    color={colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.inactiveTabText,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {tab.label}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Live Search Bar */}
      <View
        style={[
          styles.searchBox,
          {
            backgroundColor: colors.surface,
            borderColor: searchFocused ? '#A855F7' : colors.border,
          },
        ]}
      >
        <Ionicons
          name="search-outline"
          size={18}
          color={searchFocused ? '#A855F7' : colors.accentCyan}
        />
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          placeholder="Cari projek, React Native, sertifikat..."
          placeholderTextColor={colors.textMuted}
          style={[styles.searchInput, { color: colors.text }]}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearchQuery('')}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* TAB 1: PROJECTS */}
      {activeTab === 'projects' && (
        <View>
          <View style={styles.filterChipsWrap}>
            {projectCategories.map((cat) => {
              const selected = selectedProjectCategory === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  activeOpacity={0.8}
                  onPress={() => setSelectedProjectCategory(cat)}
                  style={[
                    styles.filterChip,
                    {
                      backgroundColor: selected
                        ? colors.pillBg
                        : colors.surface,
                      borderColor: selected ? '#A855F7' : colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      { color: selected ? colors.text : colors.textSecondary },
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {filteredProjects.length === 0 ? (
            <EmptyState
              icon="folder-open-outline"
              title="Projek Tidak Ditemukan"
              description={`Tidak ada projek pada kategori "${selectedProjectCategory}" yang cocok dengan kata kunci "${searchQuery}".`}
              actionLabel="Reset Filter & Pencarian"
              onAction={handleResetFilters}
            />
          ) : (
            filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))
          )}
        </View>
      )}

      {/* TAB 2: TECH STACK */}
      {activeTab === 'skills' && (
        <View>
          <View style={styles.filterChipsWrap}>
            {SKILL_CATEGORIES.map((cat) => {
              const selected = selectedSkillCategory === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  activeOpacity={0.8}
                  onPress={() => setSelectedSkillCategory(cat)}
                  style={[
                    styles.filterChip,
                    {
                      backgroundColor: selected
                        ? colors.cyanSoft
                        : colors.surface,
                      borderColor: selected ? colors.accentCyan : colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      {
                        color: selected
                          ? colors.accentCyan
                          : colors.textSecondary,
                      },
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {filteredSkills.length === 0 ? (
            <EmptyState
              icon="code-slash-outline"
              title="Tech Stack Tidak Ditemukan"
              description={`Tidak ada skill pada kategori "${selectedSkillCategory}" dengan kata kunci "${searchQuery}".`}
              actionLabel="Reset Filter Skill"
              onAction={handleResetFilters}
            />
          ) : (
            filteredSkills.map((skill) => (
              <SkillBadge key={skill.id} skill={skill} />
            ))
          )}
        </View>
      )}

      {/* TAB 3: ACHIEVEMENTS */}
      {activeTab === 'achievements' && (
        <View>
          {filteredAchievements.length === 0 ? (
            <EmptyState
              icon="trophy-outline"
              title="Achievement Tidak Ditemukan"
              description={`Tidak ditemukan sertifikat atau penghargaan untuk kata kunci "${searchQuery}".`}
              actionLabel="Tampilkan Semua Achievements"
              onAction={handleResetFilters}
            />
          ) : (
            filteredAchievements.map((cert) => (
              <View
                key={cert.id}
                style={[
                  styles.certCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                  colors.shadowGlow,
                ]}
              >
                <View style={styles.certTopRow}>
                  <View
                    style={[
                      styles.certCategoryPill,
                      {
                        backgroundColor: colors.pillBg,
                        borderColor: colors.pillBorder,
                      },
                    ]}
                  >
                    <Ionicons
                      name="ribbon-outline"
                      size={13}
                      color={colors.secondary}
                    />
                    <Text
                      style={[
                        styles.certCategoryText,
                        { color: colors.secondary },
                      ]}
                    >
                      {cert.category}
                    </Text>
                  </View>

                  <Text style={[styles.certDate, { color: colors.textMuted }]}>
                    {cert.date}
                  </Text>
                </View>

                <Text style={[styles.certTitle, { color: colors.text }]}>
                  {cert.title}
                </Text>
                <Text style={[styles.certIssuer, { color: colors.accentCyan }]}>
                  {cert.issuer}
                </Text>
                <Text style={[styles.certId, { color: colors.textSecondary }]}>
                  ID: {cert.credentialId}
                </Text>

                {Array.isArray(cert.skills) && cert.skills.length > 0 && (
                  <View style={styles.certSkillsWrap}>
                    {cert.skills.map((sk) => (
                      <View
                        key={`${cert.id}-${sk}`}
                        style={[
                          styles.certSkillPill,
                          {
                            backgroundColor: colors.surfaceElevated,
                            borderColor: colors.border,
                          },
                        ]}
                      >
                        <Text
                          style={[styles.certSkillText, { color: colors.text }]}
                        >
                          {sk}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}

                {cert.verifyUrl ? (
                  <TouchableOpacity
                    activeOpacity={0.84}
                    onPress={() => openVerifyUrl(cert.verifyUrl)}
                    style={styles.verifyWrap}
                  >
                    <LinearGradient
                      colors={['#6366F1', '#A855F7']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.verifyBtn}
                    >
                      <Text style={styles.verifyBtnText}>Details ↗</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                ) : null}
              </View>
            ))
          )}
        </View>
      )}

      {/* Resilience Testing Trigger (Level 10) */}
      <View style={styles.demoRow}>
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
          <Ionicons name="cloud-offline-outline" size={14} color={colors.textMuted} />
          <Text style={[styles.demoBtnText, { color: colors.textMuted }]}>
            Simulasi Gangguan Fetch Data (Uji Retry Level 10)
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
    paddingBottom: 34,
  },
  headerBlock: {
    marginBottom: 14,
  },
  heading: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  subheading: {
    fontSize: 13,
    lineHeight: 19.5,
  },
  segmentedCard: {
    flexDirection: 'row',
    borderRadius: 999,
    borderWidth: 1,
    padding: 4,
    marginBottom: 14,
  },
  tabSlot: {
    flex: 1,
  },
  activeTabPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 999,
  },
  activeTabText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '800',
  },
  inactiveTabPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 999,
  },
  inactiveTabText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1.5,
    marginBottom: 14,
  },
  searchInput: {
    flex: 1,
    fontSize: 13.5,
    paddingVertical: 2,
  },
  filterChipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  filterChip: {
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  certCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    marginBottom: 14,
  },
  certTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  certCategoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  certCategoryText: {
    fontSize: 11,
    fontWeight: '800',
  },
  certDate: {
    fontSize: 11.5,
    fontWeight: '600',
  },
  certTitle: {
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 22,
    marginBottom: 4,
  },
  certIssuer: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },
  certId: {
    fontSize: 12,
    marginBottom: 12,
  },
  certSkillsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 14,
  },
  certSkillPill: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  certSkillText: {
    fontSize: 11,
    fontWeight: '600',
  },
  verifyWrap: {
    alignSelf: 'flex-start',
  },
  verifyBtn: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 10,
  },
  verifyBtnText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '800',
  },
  demoRow: {
    alignItems: 'center',
    marginTop: 12,
  },
  demoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  demoBtnText: {
    fontSize: 11.5,
    fontWeight: '600',
  },
});
