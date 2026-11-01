import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Linking,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../context/ThemeContext';
import profileJson from '../data/profile.json';
import { validateContactForm, validateGuestbookForm } from '../utils/validation';
import EmptyState from '../components/EmptyState';

const GUESTBOOK_STORAGE_KEY = '@sayiddev_guestbook_v2';

const DEFAULT_GUESTBOOK_ENTRIES = [
  {
    id: 'gb-seed-1',
    author: 'Rekan KSI Ma\'soem',
    role: 'Mahasiswa S1 Sistem Informasi',
    rating: 5,
    comment:
      'Tampilan Cyber-Glassmorphism-nya mirip banget sama alfari.my.id! Animasi dan gradasi warnanya keren.',
    timestamp: 'Pinned • Baru saja',
    likes: 12,
    likedByMe: false,
  },
  {
    id: 'gb-seed-2',
    author: 'Tim Media & Dokumentasi',
    role: 'Kepanitiaan Kampus',
    rating: 5,
    comment:
      'Layout responsif, informasi akademik lengkap, dan fitur Live Komentar lokalnya sangat mulus!',
    timestamp: 'Kemarin',
    likes: 7,
    likedByMe: false,
  },
];

export default function ContactScreen() {
  const { colors } = useTheme();
  const identity = profileJson.identity || {};
  const socials = profileJson.socials || [];

  const [focusedField, setFocusedField] = useState(null);

  // --- STATE CONTACT FORM ---
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [contactErrors, setContactErrors] = useState({});
  const [submittedTicket, setSubmittedTicket] = useState(null);

  // --- STATE LIVE GUESTBOOK / KOMENTAR (AsyncStorage Persistence - Level 10) ---
  const [guestbookList, setGuestbookList] = useState(DEFAULT_GUESTBOOK_ENTRIES);
  const [gbAuthor, setGbAuthor] = useState('');
  const [gbRole, setGbRole] = useState('');
  const [gbRating, setGbRating] = useState(5);
  const [gbComment, setGbComment] = useState('');
  const [gbErrors, setGbErrors] = useState({});
  const [gbSearch, setGbSearch] = useState('');
  const [gbSuccessBanner, setGbSuccessBanner] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function loadGuestbook() {
      try {
        const raw = await AsyncStorage.getItem(GUESTBOOK_STORAGE_KEY);
        if (raw && mounted) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setGuestbookList(parsed);
          }
        }
      } catch {
        // Pertahankan default komentar apabila gagal membaca storage
      }
    }
    loadGuestbook();
    return () => {
      mounted = false;
    };
  }, []);

  const persistGuestbook = async (nextList) => {
    setGuestbookList(nextList);
    try {
      await AsyncStorage.setItem(GUESTBOOK_STORAGE_KEY, JSON.stringify(nextList));
    } catch {
      // Abaikan apabila penyimpanan penuh
    }
  };

  const openSocialLink = async (url) => {
    if (!url) return;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      }
    } catch {
      // Abaikan apabila gagal membuka tautan
    }
  };

  const getBorderColor = (fieldName, hasError) => {
    if (hasError) return colors.danger;
    if (focusedField === fieldName) return '#A855F7';
    return colors.border;
  };

  // Submit Contact Form
  const handleContactSubmit = () => {
    const validation = validateContactForm(contactForm);
    setContactErrors(validation.errors);
    if (!validation.isValid) return;

    setSubmittedTicket({
      name: contactForm.name.trim(),
      email: contactForm.email.trim(),
      subject: contactForm.subject.trim(),
      message: contactForm.message.trim(),
      sentAt: new Date().toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    });

    setContactForm({ name: '', email: '', subject: '', message: '' });
    setContactErrors({});
  };

  const handleSendViaEmailApp = async () => {
    if (!submittedTicket) return;
    const mailtoUrl = `mailto:${identity.email}?subject=${encodeURIComponent(
      submittedTicket.subject
    )}&body=${encodeURIComponent(
      `Halo ${identity.name},\n\nSaya ${submittedTicket.name} (${submittedTicket.email}).\n\n${submittedTicket.message}`
    )}`;
    openSocialLink(mailtoUrl);
  };

  // Submit Live Komentar / Guestbook
  const handleAddGuestbook = () => {
    const validation = validateGuestbookForm({
      author: gbAuthor,
      role: gbRole,
      comment: gbComment,
      rating: gbRating,
    });
    setGbErrors(validation.errors);
    if (!validation.isValid) return;

    const nowLabel = new Date().toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    const newEntry = {
      id: `gb-${Date.now()}`,
      author: gbAuthor.trim(),
      role: gbRole.trim() || 'Visitor',
      rating: gbRating,
      comment: gbComment.trim(),
      timestamp: nowLabel,
      likes: 1,
      likedByMe: true,
    };

    persistGuestbook([newEntry, ...guestbookList]);
    setGbAuthor('');
    setGbRole('');
    setGbComment('');
    setGbRating(5);
    setGbErrors({});
    setGbSuccessBanner(true);
    setTimeout(() => setGbSuccessBanner(false), 3000);
  };

  const handleToggleLike = (entryId) => {
    const updated = guestbookList.map((item) => {
      if (item.id !== entryId) return item;
      const nextLiked = !item.likedByMe;
      return {
        ...item,
        likedByMe: nextLiked,
        likes: Math.max(0, (item.likes || 0) + (nextLiked ? 1 : -1)),
      };
    });
    persistGuestbook(updated);
  };

  const handleDeleteEntry = (entryId) => {
    const updated = guestbookList.filter((item) => item.id !== entryId);
    persistGuestbook(updated);
  };

  const filteredGuestbook = useMemo(() => {
    const q = gbSearch.trim().toLowerCase();
    if (!q) return guestbookList;
    return guestbookList.filter((item) =>
      `${item.author} ${item.role} ${item.comment}`.toLowerCase().includes(q)
    );
  }, [guestbookList, gbSearch]);

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* 1. Header "Hubungi Saya" */}
        <View style={styles.pageHeader}>
          <Text style={[styles.pageTitle, { color: colors.text }]}>
            Hubungi Saya
          </Text>
          <Text style={[styles.pageSubtitle, { color: colors.textSecondary }]}>
            Ada yang mau didiskusikan? Langsung kirim pesan aja ya...
          </Text>
        </View>

        {/* 2. Interactive Contact Form Card (Focus Border #A855F7) */}
        <View
          style={[
            styles.glassCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
            colors.shadowGlow,
          ]}
        >
          <View style={styles.cardHeaderRow}>
            <Ionicons name="paper-plane-outline" size={19} color="#A855F7" />
            <Text style={[styles.cardHeaderTitle, { color: colors.text }]}>
              Kirim Pesan Langsung
            </Text>
          </View>

          {submittedTicket && (
            <View
              style={[
                styles.ticketBox,
                {
                  backgroundColor: colors.successSoft,
                  borderColor: colors.success,
                },
              ]}
            >
              <Text style={[styles.ticketTitle, { color: colors.success }]}>
                ✓ Pesan Terkirim ({submittedTicket.sentAt})
              </Text>
              <Text style={[styles.ticketDesc, { color: colors.text }]}>
                Halo {submittedTicket.name}, pesan &quot;{submittedTicket.subject}&quot; telah divalidasi!
              </Text>
              <TouchableOpacity
                activeOpacity={0.82}
                onPress={handleSendViaEmailApp}
                style={[
                  styles.mailtoBtn,
                  { borderColor: colors.success },
                ]}
              >
                <Ionicons name="mail-outline" size={14} color={colors.success} />
                <Text style={[styles.mailtoText, { color: colors.success }]}>
                  Teruskan via Aplikasi Email
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Nama */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Nama Anda</Text>
            <TextInput
              value={contactForm.name}
              onFocus={() => setFocusedField('c-name')}
              onBlur={() => setFocusedField(null)}
              onChangeText={(val) => {
                setContactForm((p) => ({ ...p, name: val }));
                if (contactErrors.name) {
                  setContactErrors((p) => ({ ...p, name: undefined }));
                }
              }}
              placeholder="Masukkan nama lengkap"
              placeholderTextColor={colors.textMuted}
              style={[
                styles.input,
                {
                  backgroundColor: colors.surfaceInput,
                  borderColor: getBorderColor('c-name', !!contactErrors.name),
                  color: colors.text,
                },
              ]}
            />
            {contactErrors.name && (
              <Text style={[styles.errorText, { color: colors.danger }]}>
                {contactErrors.name}
              </Text>
            )}
          </View>

          {/* Email */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Email</Text>
            <TextInput
              value={contactForm.email}
              onFocus={() => setFocusedField('c-email')}
              onBlur={() => setFocusedField(null)}
              onChangeText={(val) => {
                setContactForm((p) => ({ ...p, email: val }));
                if (contactErrors.email) {
                  setContactErrors((p) => ({ ...p, email: undefined }));
                }
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="nama@email.com"
              placeholderTextColor={colors.textMuted}
              style={[
                styles.input,
                {
                  backgroundColor: colors.surfaceInput,
                  borderColor: getBorderColor('c-email', !!contactErrors.email),
                  color: colors.text,
                },
              ]}
            />
            {contactErrors.email && (
              <Text style={[styles.errorText, { color: colors.danger }]}>
                {contactErrors.email}
              </Text>
            )}
          </View>

          {/* Subjek */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Subjek</Text>
            <TextInput
              value={contactForm.subject}
              onFocus={() => setFocusedField('c-subject')}
              onBlur={() => setFocusedField(null)}
              onChangeText={(val) => {
                setContactForm((p) => ({ ...p, subject: val }));
                if (contactErrors.subject) {
                  setContactErrors((p) => ({ ...p, subject: undefined }));
                }
              }}
              placeholder="Topik diskusi / kolaborasi"
              placeholderTextColor={colors.textMuted}
              style={[
                styles.input,
                {
                  backgroundColor: colors.surfaceInput,
                  borderColor: getBorderColor('c-subject', !!contactErrors.subject),
                  color: colors.text,
                },
              ]}
            />
            {contactErrors.subject && (
              <Text style={[styles.errorText, { color: colors.danger }]}>
                {contactErrors.subject}
              </Text>
            )}
          </View>

          {/* Pesan */}
          <View style={styles.fieldGroup}>
            <View style={styles.labelRowBetween}>
              <Text style={[styles.label, { color: colors.text }]}>Pesan</Text>
              <Text style={[styles.counterText, { color: colors.textMuted }]}>
                {contactForm.message.length}/500
              </Text>
            </View>
            <TextInput
              value={contactForm.message}
              onFocus={() => setFocusedField('c-message')}
              onBlur={() => setFocusedField(null)}
              onChangeText={(val) => {
                setContactForm((p) => ({ ...p, message: val }));
                if (contactErrors.message) {
                  setContactErrors((p) => ({ ...p, message: undefined }));
                }
              }}
              placeholder="Tulis pesanmu di sini..."
              placeholderTextColor={colors.textMuted}
              multiline
              maxLength={500}
              textAlignVertical="top"
              style={[
                styles.textarea,
                {
                  backgroundColor: colors.surfaceInput,
                  borderColor: getBorderColor('c-message', !!contactErrors.message),
                  color: colors.text,
                },
              ]}
            />
            {contactErrors.message && (
              <Text style={[styles.errorText, { color: colors.danger }]}>
                {contactErrors.message}
              </Text>
            )}
          </View>

          <TouchableOpacity
            activeOpacity={0.86}
            onPress={handleContactSubmit}
            style={colors.shadowGlow}
          >
            <LinearGradient
              colors={['#6366F1', '#A855F7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientSubmitBtn}
            >
              <Ionicons name="send" size={16} color="#FFFFFF" />
              <Text style={styles.gradientSubmitText}>Kirim Pesan</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* 3. Kartu Find Me (Instagram, TikTok, GitHub) */}
        <View
          style={[
            styles.glassCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
            colors.shadowGlow,
          ]}
        >
          <View style={styles.cardHeaderRow}>
            <Ionicons name="share-social-outline" size={19} color="#38BDF8" />
            <Text style={[styles.cardHeaderTitle, { color: colors.text }]}>
              Find Me
            </Text>
          </View>

          {socials.map((soc) => (
            <TouchableOpacity
              key={soc.id}
              activeOpacity={0.8}
              onPress={() => openSocialLink(soc.url)}
              style={[
                styles.socialCardRow,
                {
                  backgroundColor: colors.surfaceElevated,
                  borderColor: colors.border,
                },
              ]}
            >
              <View style={styles.socialLeft}>
                <View
                  style={[
                    styles.socialIconBox,
                    { backgroundColor: 'rgba(139, 92, 246, 0.16)' },
                  ]}
                >
                  <Ionicons
                    name={soc.icon || 'link-outline'}
                    size={20}
                    color={soc.accent || '#A855F7'}
                  />
                </View>
                <View style={styles.socialTextCol}>
                  <Text style={[styles.socialLabel, { color: colors.text }]}>
                    {soc.label}
                  </Text>
                  <Text
                    style={[styles.socialHandle, { color: colors.textSecondary }]}
                  >
                    {soc.handle} • {soc.subtitle}
                  </Text>
                </View>
              </View>

              <Ionicons
                name="open-outline"
                size={17}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* 4. Live Komentar / Guestbook Lokal (AsyncStorage - Level 10) */}
        <View
          style={[
            styles.glassCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
            colors.shadowGlow,
          ]}
        >
          <View style={styles.cardHeaderRow}>
            <Ionicons
              name="chatbubbles-outline"
              size={20}
              color={colors.secondary}
            />
            <Text style={[styles.cardHeaderTitle, { color: colors.text }]}>
              Live Komentar ({guestbookList.length})
            </Text>
          </View>
          <Text style={[styles.gbHelperText, { color: colors.textSecondary }]}>
            Tinggalkan jejak atau komentar! Seluruh pesan tersimpan persisten di perangkat melalui AsyncStorage.
          </Text>

          {gbSuccessBanner && (
            <View
              style={[
                styles.successAlert,
                {
                  backgroundColor: colors.successSoft,
                  borderColor: colors.success,
                },
              ]}
            >
              <Ionicons
                name="checkmark-circle"
                size={17}
                color={colors.success}
              />
              <Text style={[styles.successAlertText, { color: colors.success }]}>
                Komentar berhasil dipublikasikan & disimpan ke AsyncStorage!
              </Text>
            </View>
          )}

          {/* Nama Pengirim */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Nama</Text>
            <TextInput
              value={gbAuthor}
              onFocus={() => setFocusedField('gb-author')}
              onBlur={() => setFocusedField(null)}
              onChangeText={(txt) => {
                setGbAuthor(txt);
                if (gbErrors.author) {
                  setGbErrors((prev) => ({ ...prev, author: undefined }));
                }
              }}
              placeholder="Nama kamu..."
              placeholderTextColor={colors.textMuted}
              style={[
                styles.input,
                {
                  backgroundColor: colors.surfaceInput,
                  borderColor: getBorderColor('gb-author', !!gbErrors.author),
                  color: colors.text,
                },
              ]}
            />
            {gbErrors.author && (
              <Text style={[styles.errorText, { color: colors.danger }]}>
                {gbErrors.author}
              </Text>
            )}
          </View>

          {/* Role / Instansi */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.label, { color: colors.text }]}>
              Role / Kampus (Opsional)
            </Text>
            <TextInput
              value={gbRole}
              onFocus={() => setFocusedField('gb-role')}
              onBlur={() => setFocusedField(null)}
              onChangeText={setGbRole}
              placeholder="Contoh: Dosen / Mahasiswa SI"
              placeholderTextColor={colors.textMuted}
              style={[
                styles.input,
                {
                  backgroundColor: colors.surfaceInput,
                  borderColor: getBorderColor('gb-role', false),
                  color: colors.text,
                },
              ]}
            />
          </View>

          {/* Rating Bintang */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.label, { color: colors.text }]}>
              Rating ({gbRating}/5)
            </Text>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  activeOpacity={0.75}
                  onPress={() => setGbRating(star)}
                  style={[
                    styles.starBtn,
                    {
                      backgroundColor:
                        star <= gbRating
                          ? colors.warningSoft
                          : colors.surfaceElevated,
                      borderColor:
                        star <= gbRating ? colors.warning : colors.border,
                    },
                  ]}
                >
                  <Ionicons
                    name={star <= gbRating ? 'star' : 'star-outline'}
                    size={18}
                    color={star <= gbRating ? '#FBBF24' : colors.textMuted}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Isi Komentar */}
          <View style={styles.fieldGroup}>
            <View style={styles.labelRowBetween}>
              <Text style={[styles.label, { color: colors.text }]}>
                Komentar
              </Text>
              <Text style={[styles.counterText, { color: colors.textMuted }]}>
                {gbComment.length}/280
              </Text>
            </View>
            <TextInput
              value={gbComment}
              onFocus={() => setFocusedField('gb-comment')}
              onBlur={() => setFocusedField(null)}
              onChangeText={(txt) => {
                setGbComment(txt);
                if (gbErrors.comment) {
                  setGbErrors((prev) => ({ ...prev, comment: undefined }));
                }
              }}
              placeholder="Tulis komentar untuk portofolio SayidDev..."
              placeholderTextColor={colors.textMuted}
              multiline
              maxLength={280}
              textAlignVertical="top"
              style={[
                styles.textareaShort,
                {
                  backgroundColor: colors.surfaceInput,
                  borderColor: getBorderColor('gb-comment', !!gbErrors.comment),
                  color: colors.text,
                },
              ]}
            />
            {gbErrors.comment && (
              <Text style={[styles.errorText, { color: colors.danger }]}>
                {gbErrors.comment}
              </Text>
            )}
          </View>

          <TouchableOpacity
            activeOpacity={0.86}
            onPress={handleAddGuestbook}
            style={colors.shadowGlow}
          >
            <LinearGradient
              colors={['#6366F1', '#A855F7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientSubmitBtn}
            >
              <Ionicons name="chatbox-ellipses-outline" size={17} color="#FFFFFF" />
              <Text style={styles.gradientSubmitText}>Kirim Komentar</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Search & Daftar Komentar */}
        <View
          style={[
            styles.gbSearchBox,
            {
              backgroundColor: colors.surface,
              borderColor: getBorderColor('gb-search', false),
            },
          ]}
        >
          <Ionicons name="search-outline" size={17} color={colors.accentCyan} />
          <TextInput
            value={gbSearch}
            onFocus={() => setFocusedField('gb-search')}
            onBlur={() => setFocusedField(null)}
            onChangeText={setGbSearch}
            placeholder="Cari komentar guestbook..."
            placeholderTextColor={colors.textMuted}
            style={[styles.gbSearchInput, { color: colors.text }]}
          />
          {gbSearch.length > 0 && (
            <TouchableOpacity onPress={() => setGbSearch('')}>
              <Ionicons
                name="close-circle"
                size={18}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          )}
        </View>

        {filteredGuestbook.length === 0 ? (
          <EmptyState
            icon="chatbubbles-outline"
            title="Belum Ada Komentar Cocok"
            description="Tidak ditemukan komentar yang sesuai dengan kata kunci pencarian."
            actionLabel={gbSearch ? 'Reset Pencarian' : 'Muat Komentar Awal'}
            onAction={() => {
              if (gbSearch) {
                setGbSearch('');
              } else {
                persistGuestbook(DEFAULT_GUESTBOOK_ENTRIES);
              }
            }}
          />
        ) : (
          filteredGuestbook.map((entry) => (
            <View
              key={entry.id}
              style={[
                styles.gbItemCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <View style={styles.gbHeader}>
                <View style={styles.gbAuthorRow}>
                  <LinearGradient
                    colors={['#6366F1', '#A855F7']}
                    style={styles.gbAvatar}
                  >
                    <Text style={styles.gbAvatarText}>
                      {(entry.author || 'V').charAt(0).toUpperCase()}
                    </Text>
                  </LinearGradient>

                  <View style={styles.gbAuthorInfo}>
                    <Text style={[styles.gbAuthorName, { color: colors.text }]}>
                      {entry.author}
                    </Text>
                    <Text
                      style={[
                        styles.gbAuthorMeta,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {entry.role} • {entry.timestamp}
                    </Text>
                  </View>
                </View>

                <View style={styles.gbStarsMini}>
                  {Array.from({ length: entry.rating || 5 }).map((_, idx) => (
                    <Ionicons
                      key={`${entry.id}-s-${idx}`}
                      name="star"
                      size={12}
                      color="#FBBF24"
                    />
                  ))}
                </View>
              </View>

              <Text style={[styles.gbCommentBody, { color: colors.text }]}>
                {entry.comment}
              </Text>

              <View
                style={[styles.gbFooter, { borderTopColor: colors.border }]}
              >
                <TouchableOpacity
                  activeOpacity={0.78}
                  onPress={() => handleToggleLike(entry.id)}
                  style={[
                    styles.likePill,
                    {
                      backgroundColor: entry.likedByMe
                        ? colors.pillBg
                        : colors.surfaceElevated,
                      borderColor: entry.likedByMe ? '#A855F7' : colors.border,
                    },
                  ]}
                >
                  <Ionicons
                    name={entry.likedByMe ? 'heart' : 'heart-outline'}
                    size={14}
                    color={entry.likedByMe ? '#EC4899' : colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.likeText,
                      {
                        color: entry.likedByMe
                          ? colors.text
                          : colors.textSecondary,
                      },
                    ]}
                  >
                    {entry.likes || 0} Suka
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={() => handleDeleteEntry(entry.id)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons
                    name="trash-outline"
                    size={16}
                    color={colors.textMuted}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 36,
  },
  pageHeader: {
    marginBottom: 16,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 13.5,
    lineHeight: 20,
  },
  glassCard: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 18,
    marginBottom: 18,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  cardHeaderTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  gbHelperText: {
    fontSize: 12.5,
    lineHeight: 18.5,
    marginBottom: 14,
  },
  ticketBox: {
    padding: 13,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 14,
  },
  ticketTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    marginBottom: 4,
  },
  ticketDesc: {
    fontSize: 12.5,
    lineHeight: 18.5,
    marginBottom: 10,
  },
  mailtoBtn: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 9,
    borderWidth: 1,
  },
  mailtoText: {
    fontSize: 12,
    fontWeight: '700',
  },
  successAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 11,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 14,
  },
  successAlertText: {
    flex: 1,
    fontSize: 12.5,
    fontWeight: '700',
    lineHeight: 18,
  },
  fieldGroup: {
    marginBottom: 13,
  },
  labelRowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
  },
  counterText: {
    fontSize: 11.5,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1.5,
    borderRadius: 13,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
  },
  textarea: {
    borderWidth: 1.5,
    borderRadius: 13,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    minHeight: 102,
  },
  textareaShort: {
    borderWidth: 1.5,
    borderRadius: 13,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    minHeight: 84,
  },
  errorText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 5,
  },
  gradientSubmitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 13.5,
    borderRadius: 14,
    marginTop: 4,
  },
  gradientSubmitText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  socialCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 13,
    borderRadius: 15,
    borderWidth: 1,
    marginBottom: 10,
    gap: 10,
  },
  socialLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  socialIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialTextCol: {
    flex: 1,
    flexShrink: 1,
  },
  socialLabel: {
    fontSize: 14.5,
    fontWeight: '800',
  },
  socialHandle: {
    fontSize: 12,
    marginTop: 2,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  starBtn: {
    width: 40,
    height: 40,
    borderRadius: 11,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gbSearchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1.5,
    marginBottom: 12,
  },
  gbSearchInput: {
    flex: 1,
    fontSize: 13.5,
    paddingVertical: 2,
  },
  gbItemCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 15,
    marginBottom: 12,
  },
  gbHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 10,
  },
  gbAuthorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  gbAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gbAvatarText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  gbAuthorInfo: {
    flex: 1,
    flexShrink: 1,
  },
  gbAuthorName: {
    fontSize: 14,
    fontWeight: '800',
  },
  gbAuthorMeta: {
    fontSize: 11.5,
    marginTop: 1,
  },
  gbStarsMini: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 2,
  },
  gbCommentBody: {
    fontSize: 13.5,
    lineHeight: 20,
    marginBottom: 12,
  },
  gbFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
  },
  likePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
  },
  likeText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
