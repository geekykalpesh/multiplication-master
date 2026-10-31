import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { getDatabase } from '../src/services/database';
import { useUserStore } from '../src/stores/userStore';
import { useLearningStore } from '../src/stores/learningStore';
import { useTheme } from '../src/hooks/useTheme';

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const loadUserData = useUserStore((s) => s.loadUserData);
  const refreshLearningData = useLearningStore((s) => s.refreshLearningData);

  useEffect(() => {
    async function setupApp() {
      try {
        // Initialize SQLite database, seed tables & facts
        await getDatabase();
        // Load user preferences & stats
        await loadUserData();
        await refreshLearningData();
      } catch (err) {
        console.error('Initialization error:', err);
      } finally {
        setIsReady(true);
      }
    }
    setupApp();
  }, []);

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <AppNavigationContent />
    </SafeAreaProvider>
  );
}

function AppNavigationContent() {
  const { theme, themeMode } = useTheme();

  return (
    <>
      <StatusBar style={themeMode === 'dark' || themeMode === 'high_contrast' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: theme.surface },
          headerTintColor: theme.text,
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: theme.background },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding/index" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding/language" options={{ title: 'Select Language' }} />
        <Stack.Screen name="onboarding/audience" options={{ title: 'Learning Profile' }} />
        <Stack.Screen name="onboarding/mode" options={{ title: 'Learning Mode' }} />
        <Stack.Screen name="onboarding/assessment" options={{ title: 'Quick Diagnostic' }} />
        <Stack.Screen name="onboarding/speech-setup" options={{ title: 'Offline Speech Setup' }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="lessons/[id]" options={{ title: 'Lesson' }} />
        <Stack.Screen name="tables/[num]" options={{ title: 'Table Learning' }} />
        <Stack.Screen name="practice/session" options={{ title: 'Practice Session' }} />
        <Stack.Screen name="practice/voice" options={{ title: 'Hands-Free Voice Practice' }} />
        <Stack.Screen name="practice/audio-focus" options={{ title: 'Audio Focus Mode' }} />
        <Stack.Screen name="practice/results" options={{ title: 'Session Results', headerBackVisible: false }} />
        <Stack.Screen name="progress/weak-facts" options={{ title: 'Targeted Weak Facts' }} />
        <Stack.Screen name="progress/spaced-repetition" options={{ title: 'Spaced Repetition Review' }} />
        <Stack.Screen name="progress/achievements" options={{ title: 'Achievements & Badges' }} />
        <Stack.Screen name="settings/accessibility" options={{ title: 'Accessibility Settings' }} />
        <Stack.Screen name="settings/voice" options={{ title: 'Voice & Speech Settings' }} />
        <Stack.Screen name="settings/speech-models" options={{ title: 'Offline Speech Models' }} />
        <Stack.Screen name="settings/backup" options={{ title: 'Backup & Restore' }} />
        <Stack.Screen name="settings/about" options={{ title: 'About Multiplication Master' }} />
      </Stack>
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },
});
