import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/hooks/useTheme';
import { useUserStore } from '../../src/stores/userStore';
import { AccessibleText } from '../../src/components/common/AccessibleText';
import { AccessibleButton } from '../../src/components/common/AccessibleButton';
import { Card } from '../../src/components/common/Card';

export default function OnboardingLanguageScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const currentLang = useUserStore((s) => s.preferences.language);
  const setLanguage = useUserStore((s) => s.setLanguage);

  const handleSelect = async (lang: 'en' | 'hi') => {
    await setLanguage(lang);
    router.push('/onboarding/audience');
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={styles.content}>
      <AccessibleText variant="heading" weight="bold" isHeading style={styles.title}>
        Choose Your Language
      </AccessibleText>
      <AccessibleText variant="body" color={theme.textSecondary} style={styles.subtitle}>
        अपनी पसंदीदा भाषा चुनें (आप इसे बाद में सेटिंग्स में बदल सकते हैं)
      </AccessibleText>

      <View style={styles.list}>
        <Card
          highlighted={currentLang === 'en'}
          onPress={() => handleSelect('en')}
          accessibilityLabel="English. Tap to select English as your primary language."
          style={styles.langCard}
        >
          <View style={styles.cardHeader}>
            <AccessibleText variant="display">🇬🇧</AccessibleText>
            <View style={{ marginLeft: 16, flex: 1 }}>
              <AccessibleText variant="subheading" weight="bold">
                English
              </AccessibleText>
              <AccessibleText variant="caption" color={theme.textSecondary}>
                Full lessons, number words & speech practice in English
              </AccessibleText>
            </View>
          </View>
        </Card>

        <Card
          highlighted={currentLang === 'hi'}
          onPress={() => handleSelect('hi')}
          accessibilityLabel="हिन्दी. Tap to select Hindi as your primary language."
          style={styles.langCard}
        >
          <View style={styles.cardHeader}>
            <AccessibleText variant="display">🇮🇳</AccessibleText>
            <View style={{ marginLeft: 16, flex: 1 }}>
              <AccessibleText variant="subheading" weight="bold">
                हिन्दी (Hindi)
              </AccessibleText>
              <AccessibleText variant="caption" color={theme.textSecondary}>
                सम्पूर्ण पाठ, भारतीय पहाड़े, हिन्दी संख्या शब्द और अभ्यास
              </AccessibleText>
            </View>
          </View>
        </Card>
      </View>

      <AccessibleButton
        title={currentLang === 'hi' ? 'जारी रखें' : 'Continue'}
        size="lg"
        onPress={() => router.push('/onboarding/audience')}
        style={{ marginTop: 32 }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 24,
  },
  list: {
    gap: 16,
  },
  langCard: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
