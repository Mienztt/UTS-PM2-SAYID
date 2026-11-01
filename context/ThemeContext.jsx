import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_STORAGE_KEY = '@sayiddev_clean_theme_v3';

/**
 * Sistem Warna "Clean Dark Minimalist" ala alfari.my.id
 * Maksimal 3 warna utama yang konsisten, tenang, dan fokus pada keterbacaan:
 * - Background Layar: #090A0F
 * - Background Kartu (Surface): #12141D dengan border tipis #1E2230 (borderWidth: 1)
 * - Aksen Utama: #8B5CF6 (Soft Violet) untuk tombol utama, tab aktif, dan teks highlight
 * - Teks Utama: #F3F4F6 | Teks Deskripsi/Sub: #9CA3AF
 */
export const THEME_PALETTES = {
  dark: {
    mode: 'dark',
    background: '#090A0F',
    surface: '#12141D',
    surfaceElevated: '#181B26',
    surfaceInput: '#0E1017',
    border: '#1E2230',
    primary: '#8B5CF6',
    accentSoft: 'rgba(139, 92, 246, 0.12)',
    accentBorder: 'rgba(139, 92, 246, 0.28)',
    tagBg: '#191C28',
    tagText: '#C4B5FD',
    text: '#F3F4F6',
    textSecondary: '#9CA3AF',
    textMuted: '#6B7280',
    danger: '#F87171',
    dangerSoft: 'rgba(248, 113, 113, 0.10)',
    tabBar: '#090A0F',
    overlay: 'rgba(9, 10, 15, 0.80)',
    statusBarStyle: 'light',
  },
  light: {
    mode: 'light',
    background: '#F9FAFB',
    surface: '#FFFFFF',
    surfaceElevated: '#F3F4F6',
    surfaceInput: '#F9FAFB',
    border: '#E5E7EB',
    primary: '#8B5CF6',
    accentSoft: 'rgba(139, 92, 246, 0.10)',
    accentBorder: 'rgba(139, 92, 246, 0.26)',
    tagBg: '#F3F4F6',
    tagText: '#7C3AED',
    text: '#111827',
    textSecondary: '#4B5563',
    textMuted: '#9CA3AF',
    danger: '#DC2626',
    dangerSoft: 'rgba(220, 38, 38, 0.08)',
    tabBar: '#FFFFFF',
    overlay: 'rgba(17, 24, 39, 0.45)',
    statusBarStyle: 'dark',
  },
};

const ThemeContext = createContext({
  themeMode: 'dark',
  isDark: true,
  colors: THEME_PALETTES.dark,
  isThemeLoaded: false,
  toggleTheme: async () => {},
  setThemeMode: async () => {},
});

export function ThemeProvider({ children }) {
  const [themeMode, setThemeModeState] = useState('dark');
  const [isThemeLoaded, setIsThemeLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadSavedTheme() {
      try {
        const storedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (isMounted && (storedTheme === 'dark' || storedTheme === 'light')) {
          setThemeModeState(storedTheme);
        }
      } catch {
        // Pertahankan default Clean Dark Minimalist (#090A0F)
      } finally {
        if (isMounted) {
          setIsThemeLoaded(true);
        }
      }
    }

    loadSavedTheme();
    return () => {
      isMounted = false;
    };
  }, []);

  const persistTheme = useCallback(async (nextMode) => {
    const validMode = nextMode === 'light' ? 'light' : 'dark';
    setThemeModeState(validMode);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, validMode);
    } catch {
      // Abaikan apabila gagal menulis storage
    }
  }, []);

  const toggleTheme = useCallback(() => {
    const nextMode = themeMode === 'dark' ? 'light' : 'dark';
    persistTheme(nextMode);
  }, [themeMode, persistTheme]);

  const value = useMemo(
    () => ({
      themeMode,
      isDark: themeMode === 'dark',
      colors: THEME_PALETTES[themeMode] || THEME_PALETTES.dark,
      isThemeLoaded,
      toggleTheme,
      setThemeMode: persistTheme,
    }),
    [themeMode, isThemeLoaded, toggleTheme, persistTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
