import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Linking,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

/**
 * ProjectCard — Kartu proyek Cyber-Glassmorphism dengan visual header banner bergradasi,
 * ikon kategori, deskripsi, tag teknologi, dan tombol "Details ↗" + Modal Detail.
 */
export default function ProjectCard({ project }) {
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  if (!project) return null;

  const bannerGradient = project.bannerGradient || ['#6366F1', '#A855F7'];
  const bannerIcon = project.bannerIcon || 'rocket-outline';

  const openExternal = async (url) => {
    if (!url) return;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      }
    } catch {
      // Abaikan apabila perangkat gagal membuka browser
    }
  };

  return (
    <>
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
          colors.shadowGlow,
        ]}
      >
        {/* Visual Header Banner Bergradasi */}
        <LinearGradient
          colors={bannerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.bannerHeader}
        >
          <View style={styles.bannerDecorCircle} />
          <View style={styles.bannerTopBar}>
            <View style={styles.bannerCategoryPill}>
              <Text style={styles.bannerCategoryText}>{project.category}</Text>
            </View>
            <View style={styles.bannerYearPill}>
              <Text style={styles.bannerYearText}>
                {project.status || project.year}
              </Text>
            </View>
          </View>

          <View style={styles.bannerCenterIconWrap}>
            <View style={styles.bannerIconGlass}>
              <Ionicons name={bannerIcon} size={30} color="#FFFFFF" />
            </View>
          </View>
        </LinearGradient>

        {/* Body Content */}
        <View style={styles.body}>
          <Text style={[styles.title, { color: colors.text }]}>
            {project.title}
          </Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            {project.shortDescription}
          </Text>

          {/* Tech Stack Pills */}
          {Array.isArray(project.techStack) && project.techStack.length > 0 && (
            <View style={styles.techWrap}>
              {project.techStack.map((tech) => (
                <View
                  key={tech}
                  style={[
                    styles.techChip,
                    {
                      backgroundColor: colors.primarySoft,
                      borderColor: 'rgba(99, 102, 241, 0.3)',
                    },
                  ]}
                >
                  <Text style={[styles.techText, { color: colors.text }]}>
                    {tech}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Footer Action Row */}
          <View style={[styles.footerRow, { borderTopColor: colors.border }]}>
            <View style={styles.externalLinks}>
              {project.repoUrl ? (
                <TouchableOpacity
                  activeOpacity={0.78}
                  onPress={() => openExternal(project.repoUrl)}
                  style={[
                    styles.iconBtn,
                    {
                      backgroundColor: colors.surfaceElevated,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Ionicons name="logo-github" size={17} color={colors.text} />
                </TouchableOpacity>
              ) : null}

              {project.demoUrl ? (
                <TouchableOpacity
                  activeOpacity={0.78}
                  onPress={() => openExternal(project.demoUrl)}
                  style={[
                    styles.iconBtn,
                    {
                      backgroundColor: colors.surfaceElevated,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Ionicons
                    name="globe-outline"
                    size={17}
                    color={colors.accentCyan}
                  />
                </TouchableOpacity>
              ) : null}
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setModalVisible(true)}
            >
              <LinearGradient
                colors={['#6366F1', '#A855F7']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.detailsBtn}
              >
                <Text style={styles.detailsBtnText}>Details ↗</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Cyber-Glass Project Detail Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={[styles.modalBackdrop, { backgroundColor: colors.overlay }]}
          onPress={() => setModalVisible(false)}
        >
          <Pressable
            style={[
              styles.modalSheet,
              {
                backgroundColor: colors.surfaceSolid,
                borderColor: colors.borderStrong,
              },
            ]}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHeader}>
              <View style={styles.modalBadgeWrap}>
                <View
                  style={[
                    styles.modalCategoryPill,
                    { backgroundColor: colors.primarySoft },
                  ]}
                >
                  <Text
                    style={[
                      styles.modalCategoryText,
                      { color: colors.accentCyan },
                    ]}
                  >
                    {project.category} • {project.year}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={[
                  styles.closeBtn,
                  { backgroundColor: colors.surfaceElevated },
                ]}
              >
                <Ionicons name="close" size={20} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.modalBody}
            >
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {project.title}
              </Text>
              <Text
                style={[styles.modalDescription, { color: colors.textSecondary }]}
              >
                {project.fullDescription || project.shortDescription}
              </Text>

              {Array.isArray(project.keyFeatures) &&
                project.keyFeatures.length > 0 && (
                  <View style={styles.modalSection}>
                    <Text
                      style={[styles.modalSectionTitle, { color: colors.text }]}
                    >
                      Key Features & Architecture
                    </Text>
                    {project.keyFeatures.map((feat, idx) => (
                      <View
                        key={`${project.id}-feat-${idx}`}
                        style={styles.featureItem}
                      >
                        <Ionicons
                          name="sparkles"
                          size={15}
                          color={colors.secondary}
                        />
                        <Text
                          style={[
                            styles.featureText,
                            { color: colors.textSecondary },
                          ]}
                        >
                          {feat}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}

              <View style={styles.modalSection}>
                <Text
                  style={[styles.modalSectionTitle, { color: colors.text }]}
                >
                  Tech Stack
                </Text>
                <View style={styles.techWrap}>
                  {(project.techStack || []).map((tech) => (
                    <View
                      key={`modal-${tech}`}
                      style={[
                        styles.techChip,
                        {
                          backgroundColor: colors.secondarySoft,
                          borderColor: colors.borderStrong,
                        },
                      ]}
                    >
                      <Text
                        style={[styles.techText, { color: colors.secondary }]}
                      >
                        {tech}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.modalActionRow}>
                {project.repoUrl ? (
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => openExternal(project.repoUrl)}
                    style={[
                      styles.modalGhostBtn,
                      {
                        borderColor: '#6366F1',
                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                      },
                    ]}
                  >
                    <Ionicons name="logo-github" size={17} color={colors.text} />
                    <Text style={[styles.modalBtnText, { color: colors.text }]}>
                      GitHub
                    </Text>
                  </TouchableOpacity>
                ) : null}

                {project.demoUrl ? (
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => openExternal(project.demoUrl)}
                    style={styles.modalGradWrap}
                  >
                    <LinearGradient
                      colors={['#6366F1', '#A855F7']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.modalPrimaryBtn}
                    >
                      <Text style={styles.modalPrimaryBtnText}>
                        Live Demo ↗
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                ) : null}
              </View>
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 16,
  },
  bannerHeader: {
    height: 126,
    padding: 14,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  bannerDecorCircle: {
    position: 'absolute',
    right: -24,
    bottom: -28,
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  bannerTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  bannerCategoryPill: {
    backgroundColor: 'rgba(3, 0, 20, 0.45)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.22)',
  },
  bannerCategoryText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  bannerYearPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  bannerYearText: {
    color: '#F8FAFC',
    fontSize: 10.5,
    fontWeight: '700',
  },
  bannerCenterIconWrap: {
    alignItems: 'flex-start',
  },
  bannerIconGlass: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.32)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    padding: 16,
  },
  title: {
    fontSize: 17.5,
    fontWeight: '800',
    marginBottom: 6,
    lineHeight: 23,
  },
  description: {
    fontSize: 13,
    lineHeight: 19.5,
    marginBottom: 12,
  },
  techWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 14,
  },
  techChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
  },
  techText: {
    fontSize: 11,
    fontWeight: '700',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    gap: 10,
  },
  externalLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsBtn: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 11,
  },
  detailsBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalSheet: {
    maxHeight: '86%',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderWidth: 1,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    gap: 10,
  },
  modalBadgeWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    flex: 1,
  },
  modalCategoryPill: {
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 999,
  },
  modalCategoryText: {
    fontSize: 11.5,
    fontWeight: '800',
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBody: {
    paddingBottom: 18,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
    lineHeight: 26,
  },
  modalDescription: {
    fontSize: 13.5,
    lineHeight: 21,
    marginBottom: 18,
  },
  modalSection: {
    marginBottom: 18,
  },
  modalSectionTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    marginBottom: 10,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  featureText: {
    flex: 1,
    flexShrink: 1,
    fontSize: 13,
    lineHeight: 19.5,
  },
  modalActionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  modalGhostBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  modalBtnText: {
    fontSize: 13.5,
    fontWeight: '800',
  },
  modalGradWrap: {
    flex: 1,
  },
  modalPrimaryBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderRadius: 12,
  },
  modalPrimaryBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
  },
});
