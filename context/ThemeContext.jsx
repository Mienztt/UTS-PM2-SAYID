import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_STORAGE_KEY = '@sayiddev_cyber_theme_v2';

/**
 * Sistem Warna Cyber-Glassmorphism terinspirasi penuh dari https://www.alfari.my.id/
 * - Main Background: #030014 (Deep Space Indigo/Black)
 * - Glass Card: rgba(17, 25, 40, 0.78) dengan border tipis rgba(255, 255, 255, 0.12)
 * - Primary Gradient: #6366F1 (Indigo) -> #A855F7 (Purple) & aksen #38BDF8 (Sky Cyan)
 * - Glow Shadow: #8B5CF6 (opacity 0.25, radius 12, elevation 6)
 */
export const THEME_PALETTES = {
  dark: {
    mode: 'dark',
    background: '#030014',
    surface: 'rgba(17, 25, 40, 0.78)',
    surfaceSolid: '#0F172A',
    surfaceElevated: 'rgba(30, 41, 59, 0.68)',
    surfaceInput: 'rgba(15, 23, 42, 0.88)',
    border: 'rgba(255, 255, 255, 0.12)',
    borderStrong: 'rgba(139, 92, 246, 0.4)',
    indigo: '#6366F1',
    purple: '#A855F7',
    pink: '#EC4899',
    cyan: '#38BDF8',
    primary: '#6366F1',
    secondary: '#A855F7',
    accentCyan: '#38BDF8',
    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
    success: '#22C55E',
    warning: '#F59E0B',
    danger: '#EF4444',
    pillBg: 'rgba(139, 92, 246, 0.15)',
    pillBorder: 'rgba(139, 92, 246, 0.4)',
    primarySoft: 'rgba(99, 102, 241, 0.16)',
    secondarySoft: 'rgba(168, 85, 247, 0.16)',
    cyanSoft: 'rgba(56, 189, 248, 0.15)',
    successSoft: 'rgba(34, 197, 94, 0.15)',
    warningSoft: 'rgba(245, 158, 11, 0.15)',
    dangerSoft: 'rgba(239, 68, 68, 0.16)',
    gradientPrimary: ['#6366F1', '#A855F7'],
    gradientAvatar: ['#6366F1', '#EC4899'],
    gradientScore: ['#1E1B4B', '#311042'],
    gradientHeroGlow: ['rgba(99, 102, 241, 0.22)', 'rgba(168, 85, 247, 0.08)', 'transparent'],
    shadowGlow: {
      shadowColor: '#8B5CF6',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 12,
      elevation: 6,
    },
    tabBar: '#07051A',
    overlay: 'rgba(3, 0, 20, 0.84)',
    statusBarStyle: 'light',
  },
  light: {
    mode: 'light',
    background: '#F5F3FF',
    surface: 'rgba(255, 255, 255, 0.92)',
    surfaceSolid: '#FFFFFF',
    surfaceElevated: '#EEF2FF',
    surfaceInput: '#FFFFFF',
    border: 'rgba(99, 102, 241, 0.18)',
    borderStrong: 'rgba(139, 92, 246, 0.45)',
    indigo: '#4F46E5',
    purple: '#9333EA',
    pink: '#DB2777',
    cyan: '#0284C7',
    primary: '#4F46E5',
    secondary: '#9333EA',
    accentCyan: '#0284C7',
    text: '#0F172A',
    textSecondary: '#475569',
    textMuted: '#64748B',
    success: '#16A34A',
    warning: '#D97706',
    danger: '#DC2626',
    pillBg: 'rgba(139, 92, 246, 0.12)',
    pillBorder: 'rgba(139, 92, 246, 0.38)',
    primarySoft: 'rgba(79, 70, 229, 0.12)',
    secondarySoft: 'rgba(147, 51, 234, 0.12)',
    cyanSoft: 'rgba(2, 132, 199, 0.12)',
    successSoft: 'rgba(22, 163, 74, 0.12)',
    warningSoft: 'rgba(217, 119, 6, 0.12)',
    dangerSoft: 'rgba(220, 38, 38, 0.12)',
    gradientPrimary: ['#6366F1', '#A855F7'],
    gradientAvatar: ['#6366F1', '#EC4899'],
    gradientScore: ['#312E81', '#581C87'],
    gradientHeroGlow: ['rgba(99, 102, 241, 0.14)', 'rgba(168, 85, 247, 0.05)', 'transparent'],
    shadowGlow: {
      shadowColor: '#8B5CF6',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.18,
      shadowRadius: 10,
      elevation: 4,
    },
    tabBar: '#FFFFFF',
    overlay: 'rgba(15, 23, 42, 0.55)',
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
        // Pertahankan default Cyber-Glass Dark Mode (#030014)
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
