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
        Sayid<Text style={styles.brandAccent}>Dev.</Text>
      </Text>
    </View>
  );
}

function ThemeToggleButton() {
  const { isDark, toggleTheme, colors } = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.82}
      onPress={toggleTheme}
      accessibilityRole="button"
      accessibilityLabel="Toggle Dark atau Light Mode"
      style={[
        styles.themeBtn,
        {
          backgroundColor: colors.pillBg,
          borderColor: colors.pillBorder,
        },
      ]}
    >
      <Ionicons
        name={isDark ? 'sunny-outline' : 'moon-outline'}
        size={16}
        color={isDark ? '#FBBF24' : '#9333EA'}
      />
      <Text style={[styles.themeBtnText, { color: colors.text }]}>
        {isDark ? 'Light' : 'Dark'}
      </Text>
    </TouchableOpacity>
  );
}

function AppTabs() {
  const { colors, isDark } = useTheme();

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
          tabBarActiveTintColor: isDark ? '#A855F7' : '#6366F1',
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarStyle: {
            backgroundColor: colors.tabBar,
            borderTopColor: colors.border,
            borderTopWidth: 1,
            height: Platform.OS === 'ios' ? 84 : 66,
            paddingTop: 6,
            paddingBottom: Platform.OS === 'ios' ? 24 : 10,
          },
          tabBarLabelStyle: {
            fontSize: 11.5,
            fontWeight: '700',
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
                size={21}
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
                size={21}
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
                size={21}
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
                name={focused ? 'chatbubbles' : 'chatbubbles-outline'}
                size={21}
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
    marginLeft: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandText: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.4,
  },
  brandAccent: {
    color: '#A855F7',
  },
  headerRightWrap: {
    marginRight: 16,
  },
  themeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  themeBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
