import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/hooks/useTheme';

export default function TabLayout() {
  const { theme, isHighContrast, language } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: theme.surface },
        headerTintColor: theme.text,
        headerTitleStyle: { fontWeight: '700' },
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopColor: isHighContrast ? theme.border : theme.border,
          borderTopWidth: isHighContrast ? 2 : 1,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarLabelStyle: { fontWeight: '600', fontSize: 12 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: language === 'hi' ? 'डैशबोर्ड' : 'Dashboard',
          tabBarLabel: language === 'hi' ? 'डैशबोर्ड' : 'Home',
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color as string} />,
        }}
      />
      <Tabs.Screen
        name="journey"
        options={{
          title: language === 'hi' ? 'पाठ्यक्रम' : 'Journey',
          tabBarLabel: language === 'hi' ? 'यात्रा' : 'Journey',
          tabBarIcon: ({ color, size }) => <Ionicons name="map" size={size} color={color as string} />,
        }}
      />
      <Tabs.Screen
        name="practice"
        options={{
          title: language === 'hi' ? 'अभ्यास' : 'Practice',
          tabBarLabel: language === 'hi' ? 'अभ्यास' : 'Practice',
          tabBarIcon: ({ color, size }) => <Ionicons name="flash" size={size} color={color as string} />,
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: language === 'hi' ? 'प्रगति' : 'Progress',
          tabBarLabel: language === 'hi' ? 'प्रगति' : 'Progress',
          tabBarIcon: ({ color, size }) => <Ionicons name="stats-chart" size={size} color={color as string} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: language === 'hi' ? 'सेटिंग्स' : 'Settings',
          tabBarLabel: language === 'hi' ? 'सेटिंग्स' : 'Settings',
          tabBarIcon: ({ color, size }) => <Ionicons name="settings-sharp" size={size} color={color as string} />,
        }}
      />
    </Tabs>
  );
}
