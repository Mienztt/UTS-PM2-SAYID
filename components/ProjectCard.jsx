import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

/**
 * ProjectCard — Kartu proyek minimalis tanpa gambar banner ramai.
 * Fokus pada tipografi rapi, badge kategori tipis, deskripsi mudah dibaca (lineHeight: 22),
 * serta tag teknologi abu-abu gelap dengan teks ungu muda.
 */
export default function ProjectCard({ project }) {
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  if (!project) return null;

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => setModalVisible(true)}
        style={[
          styles.card,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        {/* Header Tipografi Rapi + Badge Kategori */}
        <View style={styles.topRow}>
          <View
            style={[
              styles.categoryBadge,
              {
                backgroundColor: colors.accentSoft,
                borderColor: colors.accentBorder,
              },
            ]}
          >
            <Text style={[styles.categoryText, { color: colors.primary }]}>
              {project.category}
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={16}
            color={colors.textMuted}
          />
        </View>

        <Text style={[styles.title, { color: colors.text }]}>
          {project.title}
        </Text>

        <Text style={[styles.description, { color: colors.textSecondary }]}>
          {project.shortDescription}
        </Text>

        {/* Tag Teknologi: Abu-abu gelap dengan teks ungu muda */}
        {Array.isArray(project.techStack) && project.techStack.length > 0 && (
          <View style={styles.techRow}>
            {project.techStack.map((tech) => (
              <View
                key={tech}
                style={[
                  styles.techTag,
                  {
                    backgroundColor: colors.tagBg,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text style={[styles.techTagText, { color: colors.tagText }]}>
                  {tech}
                </Text>
              </View>
            ))}
          </View>
        )}
      </TouchableOpacity>

      {/* Modal Detail Proyek Minimalis */}
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={[styles.backdrop, { backgroundColor: colors.overlay }]}
          onPress={() => setModalVisible(false)}
        >
          <Pressable
            style={[
              styles.modalCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHeader}>
              <View
                style={[
                  styles.categoryBadge,
                  {
                    backgroundColor: colors.accentSoft,
                    borderColor: colors.accentBorder,
                  },
                ]}
              >
                <Text style={[styles.categoryText, { color: colors.primary }]}>
                  {project.category}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={[
                  styles.closeBtn,
                  {
                    backgroundColor: colors.surfaceElevated,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Ionicons name="close" size={16} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {project.title}
              </Text>

              <Text style={[styles.modalDesc, { color: colors.textSecondary }]}>
                {project.fullDescription || project.shortDescription}
              </Text>

              <Text style={[styles.modalSubLabel, { color: colors.text }]}>
                Teknologi yang Digunakan
              </Text>
              <View style={styles.techRow}>
                {(project.techStack || []).map((tech) => (
                  <View
                    key={`m-${tech}`}
                    style={[
                      styles.techTag,
                      {
                        backgroundColor: colors.tagBg,
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    <Text style={[styles.techTagText, { color: colors.tagText }]}>
                      {tech}
                    </Text>
                  </View>
                ))}
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
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
    marginBottom: 14,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 11.5,
    fontWeight: '600',
  },
  title: {
    fontSize: 16.5,
    fontWeight: '700',
    lineHeight: 23,
    marginBottom: 6,
  },
  description: {
    fontSize: 13.5,
    lineHeight: 22,
    marginBottom: 14,
  },
  techRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  techTag: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  techTagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    maxHeight: '80%',
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 25,
    marginBottom: 10,
  },
  modalDesc: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 18,
  },
  modalSubLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 10,
  },
});
