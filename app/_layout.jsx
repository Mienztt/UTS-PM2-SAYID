import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ThemeProvider, useTheme } from '../context/ThemeContext';

function BrandLogo() {
  const { colors } = useTheme();
  return (
    <View style={styles.brandWrap}>
      <Text style={[styles.brandText, { color: colors.text }]}>
        Sayid<Text style={[styles.brandAccent, { color: colors.primary }]}>Dev.</Text>
      </Text>
    </View>
  );
}

function ThemeToggleButton() {
  const { isDark, toggleTheme, colors } = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={toggleTheme}
      accessibilityRole="button"
      accessibilityLabel="Toggle Dark atau Light Mode"
      style={[
        styles.themeBtn,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
      <Ionicons
        name={isDark ? 'sunny-outline' : 'moon-outline'}
        size={14}
        color={colors.textSecondary}
      />
      <Text style={[styles.themeBtnText, { color: colors.textSecondary }]}>
        {isDark ? 'Light' : 'Dark'}
      </Text>
    </TouchableOpacity>
  );
}

function AppTabs() {
  const { colors } = useTheme();

  return (
    <>
      <StatusBar
        style={colors.statusBarStyle}
        backgroundColor={colors.background}
      />
      <Tabs
        screenOptions={{
          headerTitle: '',
          headerStyle: {
            backgroundColor: colors.background,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          },
          headerLeft: () => <BrandLogo />,
          headerRight: () => (
            <View style={styles.headerRightWrap}>
              <ThemeToggleButton />
            </View>
          ),
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarStyle: {
            backgroundColor: colors.tabBar,
            borderTopColor: colors.border,
            borderTopWidth: 1,
            elevation: 0,
            shadowOpacity: 0,
            height: Platform.OS === 'ios' ? 84 : 64,
            paddingTop: 6,
            paddingBottom: Platform.OS === 'ios' ? 24 : 10,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
          },
          sceneStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? 'home' : 'home-outline'}
                size={19}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="portfolio"
          options={{
            title: 'Portfolio',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? 'layers' : 'layers-outline'}
                size={19}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="score"
          options={{
            title: 'My Score',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? 'school' : 'school-outline'}
                size={19}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="contact"
          options={{
            title: 'Contact',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? 'mail' : 'mail-outline'}
                size={19}
                color={color}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppTabs />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  brandWrap: {
    marginLeft: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandText: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  brandAccent: {
    fontWeight: '800',
  },
  headerRightWrap: {
    marginRight: 18,
  },
  themeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  themeBtnText: {
    fontSize: 11.5,
    fontWeight: '600',
  },
});
