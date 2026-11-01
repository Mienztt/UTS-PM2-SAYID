import React, { useEffect, useState } from 'react';
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
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../context/ThemeContext';
import profileJson from '../data/profile.json';
import { validateContactForm } from '../utils/validation';
import EmptyState from '../components/EmptyState';

const MESSAGES_STORAGE_KEY = '@sayiddev_saved_messages_v3';

export default function ContactScreen() {
  const { colors } = useTheme();
  const identity = profileJson.identity || {};

  const phoneDisplay = identity.telepon || '0812-1370-6230';
  const emailDisplay = identity.email || 'sayidaziz35@gmail.com';
  const addressDisplay = identity.lokasiSingkat || 'Rancaekek, Kab. Bandung';

  const [focusedField, setFocusedField] = useState(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [savedMessages, setSavedMessages] = useState([]);
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function loadMessages() {
      try {
        const raw = await AsyncStorage.getItem(MESSAGES_STORAGE_KEY);
        if (raw && mounted) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            setSavedMessages(parsed);
          }
        }
      } catch {
        // Biarkan kosong apabila gagal memuat storage
      }
    }
    loadMessages();
    return () => {
      mounted = false;
    };
  }, []);

  const persistMessages = async (nextList) => {
    setSavedMessages(nextList);
    try {
      await AsyncStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(nextList));
    } catch {
      // Abaikan apabila penyimpanan penuh
    }
  };

  const openExternal = async (url) => {
    if (!url) return;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      }
    } catch {
      // Abaikan apabila gagal membuka aplikasi eksternal
    }
  };

  const getInputBorder = (fieldName, hasError) => {
    if (hasError) return colors.danger;
    if (focusedField === fieldName) return colors.primary;
    return colors.border;
  };

  const handleSubmit = () => {
    const result = validateContactForm(form);
    setErrors(result.errors);
    if (!result.isValid) return;

    const timestamp = new Date().toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const newItem = {
      id: `msg-${Date.now()}`,
      name: form.name.trim(),
      email: form.email.trim(),
      message: form.message.trim(),
      createdAt: timestamp,
    };

    persistMessages([newItem, ...savedMessages]);
    setForm({ name: '', email: '', message: '' });
    setErrors({});
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 3000);
  };

  const handleDeleteMessage = (id) => {
    const updated = savedMessages.filter((item) => item.id !== id);
    persistMessages(updated);
  };

  const contactItems = [
    {
      id: 'whatsapp',
      icon: 'logo-whatsapp',
      label: 'WhatsApp / Telepon',
      value: phoneDisplay,
      onPress: () => openExternal('https://wa.me/6281213706230'),
    },
    {
      id: 'email',
      icon: 'mail-outline',
      label: 'Email',
      value: emailDisplay,
      onPress: () => openExternal(`mailto:${emailDisplay}`),
    },
    {
      id: 'address',
      icon: 'location-outline',
      label: 'Alamat',
      value: addressDisplay,
      onPress: null,
    },
  ];

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
        {/* 1. Kartu Informasi Kontak Asli di Bagian Atas */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Informasi Kontak
          </Text>

          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            {contactItems.map((item, idx) => {
              const isLast = idx === contactItems.length - 1;
              const Wrapper = item.onPress ? TouchableOpacity : View;

              return (
                <View key={item.id}>
                  <Wrapper
                    activeOpacity={0.75}
                    onPress={item.onPress || undefined}
                    style={styles.contactRow}
                  >
                    <View
                      style={[
                        styles.contactIconWrap,
                        {
                          backgroundColor: colors.accentSoft,
                          borderColor: colors.accentBorder,
                        },
                      ]}
                    >
                      <Ionicons
                        name={item.icon}
                        size={16}
                        color={colors.primary}
                      />
                    </View>

                    <View style={styles.contactTextCol}>
                      <Text
                        style={[
                          styles.contactLabel,
                          { color: colors.textSecondary },
                        ]}
                      >
                        {item.label}
                      </Text>
                      <Text
                        style={[styles.contactValue, { color: colors.text }]}
                      >
                        {item.value}
                      </Text>
                    </View>

                    {item.onPress && (
                      <Ionicons
                        name="open-outline"
                        size={15}
                        color={colors.textMuted}
                      />
                    )}
                  </Wrapper>

                  {!isLast && (
                    <View
                      style={[
                        styles.divider,
                        { backgroundColor: colors.border },
                      ]}
                    />
                  )}
                </View>
              );
            })}
          </View>
        </View>

        {/* 2. Form Kirim Pesan (Nama, Email, Pesan) */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Kirim Pesan
          </Text>

          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            {justSaved && (
              <View
                style={[
                  styles.savedBanner,
                  {
                    backgroundColor: colors.accentSoft,
                    borderColor: colors.accentBorder,
                  },
                ]}
              >
                <Ionicons
                  name="checkmark-circle-outline"
                  size={16}
                  color={colors.primary}
                />
                <Text style={[styles.savedBannerText, { color: colors.text }]}>
                  Pesan berhasil divalidasi dan disimpan.
                </Text>
              </View>
            )}

            {/* Nama */}
            <View style={styles.fieldGroup}>
              <Text style={[styles.fieldLabel, { color: colors.text }]}>
                Nama
              </Text>
              <TextInput
                value={form.name}
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
                onChangeText={(val) => {
                  setForm((p) => ({ ...p, name: val }));
                  if (errors.name) {
                    setErrors((p) => ({ ...p, name: undefined }));
                  }
                }}
                placeholder="Nama lengkap Anda"
                placeholderTextColor={colors.textMuted}
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.surfaceInput,
                    borderColor: getInputBorder('name', !!errors.name),
                    color: colors.text,
                  },
                ]}
              />
              {errors.name && (
                <Text style={[styles.errorText, { color: colors.danger }]}>
                  {errors.name}
                </Text>
              )}
            </View>

            {/* Email */}
            <View style={styles.fieldGroup}>
              <Text style={[styles.fieldLabel, { color: colors.text }]}>
                Email
              </Text>
              <TextInput
                value={form.email}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                onChangeText={(val) => {
                  setForm((p) => ({ ...p, email: val }));
                  if (errors.email) {
                    setErrors((p) => ({ ...p, email: undefined }));
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
                    borderColor: getInputBorder('email', !!errors.email),
                    color: colors.text,
                  },
                ]}
              />
              {errors.email && (
                <Text style={[styles.errorText, { color: colors.danger }]}>
                  {errors.email}
                </Text>
              )}
            </View>

            {/* Pesan */}
            <View style={styles.fieldGroup}>
              <View style={styles.labelRow}>
                <Text style={[styles.fieldLabel, { color: colors.text }]}>
                  Pesan
                </Text>
                <Text style={[styles.counter, { color: colors.textMuted }]}>
                  {form.message.length}/500
                </Text>
              </View>
              <TextInput
                value={form.message}
                onFocus={() => setFocusedField('message')}
                onBlur={() => setFocusedField(null)}
                onChangeText={(val) => {
                  setForm((p) => ({ ...p, message: val }));
                  if (errors.message) {
                    setErrors((p) => ({ ...p, message: undefined }));
                  }
                }}
                placeholder="Tulis pesan atau keperluan Anda..."
                placeholderTextColor={colors.textMuted}
                multiline
                maxLength={500}
                textAlignVertical="top"
                style={[
                  styles.textarea,
                  {
                    backgroundColor: colors.surfaceInput,
                    borderColor: getInputBorder('message', !!errors.message),
                    color: colors.text,
                  },
                ]}
              />
              {errors.message && (
                <Text style={[styles.errorText, { color: colors.danger }]}>
                  {errors.message}
                </Text>
              )}
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleSubmit}
              style={[styles.submitBtn, { backgroundColor: colors.primary }]}
            >
              <Text style={styles.submitBtnText}>Kirim Pesan</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 3. Daftar Pesan Tersimpan (AsyncStorage) */}
        <View style={styles.bottomSection}>
          <View style={styles.savedHeaderRow}>
            <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 0 }]}>
              Pesan Tersimpan
            </Text>
            <View
              style={[
                styles.countPill,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text style={[styles.countText, { color: colors.textSecondary }]}>
                {savedMessages.length}
              </Text>
            </View>
          </View>

          {savedMessages.length === 0 ? (
            <EmptyState
              icon="mail-open-outline"
              title="Belum Ada Pesan Tersimpan"
              description="Pesan yang Anda kirim melalui formulir di atas akan tersimpan secara lokal di sini."
            />
          ) : (
            savedMessages.map((msg) => (
              <View
                key={msg.id}
                style={[
                  styles.messageCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
              >
                <View style={styles.messageTopRow}>
                  <View style={styles.messageSenderCol}>
                    <Text style={[styles.senderName, { color: colors.text }]}>
                      {msg.name}
                    </Text>
                    <Text
                      style={[
                        styles.senderMeta,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {msg.email} • {msg.createdAt}
                    </Text>
                  </View>

                  <TouchableOpacity
                    activeOpacity={0.75}
                    onPress={() => handleDeleteMessage(msg.id)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons
                      name="trash-outline"
                      size={16}
                      color={colors.textMuted}
                    />
                  </TouchableOpacity>
                </View>

                <Text
                  style={[styles.messageBody, { color: colors.textSecondary }]}
                >
                  {msg.message}
                </Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  contactIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 9,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactTextCol: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginVertical: 14,
  },
  savedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 14,
  },
  savedBannerText: {
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  fieldGroup: {
    marginBottom: 14,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  counter: {
    fontSize: 11.5,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 13,
    paddingVertical: 11,
    fontSize: 14,
  },
  textarea: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 13,
    paddingVertical: 11,
    fontSize: 14,
    minHeight: 96,
    lineHeight: 21,
  },
  errorText: {
    fontSize: 12,
    marginTop: 5,
  },
  submitBtn: {
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  savedHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  countPill: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
  },
  countText: {
    fontSize: 12,
    fontWeight: '600',
  },
  messageCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
    marginBottom: 12,
  },
  messageTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 8,
  },
  messageSenderCol: {
    flex: 1,
  },
  senderName: {
    fontSize: 14.5,
    fontWeight: '700',
  },
  senderMeta: {
    fontSize: 12,
    marginTop: 2,
  },
  messageBody: {
    fontSize: 13.5,
    lineHeight: 22,
  },
});
