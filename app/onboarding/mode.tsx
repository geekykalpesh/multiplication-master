import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/hooks/useTheme';
import { useUserStore } from '../../src/stores/userStore';
import { LearningMode } from '../../src/types/database';
import { AccessibleText } from '../../src/components/common/AccessibleText';
import { AccessibleButton } from '../../src/components/common/AccessibleButton';
import { Card } from '../../src/components/common/Card';

export default function OnboardingModeScreen() {
  const router = useRouter();
  const { theme, language } = useTheme();
  const currentMode = useUserStore((s) => s.preferences.learningMode);
  const setLearningMode = useUserStore((s) => s.setLearningMode);

  const handleSelect = async (mode: LearningMode) => {
    await setLearningMode(mode);
    router.push('/onboarding/assessment');
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={styles.content}>
      <AccessibleText variant="heading" weight="bold" isHeading style={styles.title}>
        {language === 'hi' ? 'सीखने का तरीका चुनें' : 'Choose Learning Mode'}
      </AccessibleText>
      <AccessibleText variant="body" color={theme.textSecondary} style={styles.subtitle}>
        {language === 'hi'
          ? 'आप अपनी सुविधा अनुसार किसी भी समय मोड बदल सकते हैं।'
          : 'You can switch between modes at any time from settings or before any session.'}
      </AccessibleText>

      <View style={styles.list}>
        {/* Visual Learning */}
        <Card
          highlighted={currentMode === 'visual'}
          onPress={() => handleSelect('visual')}
          accessibilityLabel="Visual Learning mode. See interactive cards, number grids, and visual arrays."
          style={styles.card}
        >
          <View style={styles.row}>
            <AccessibleText variant="display">👁️</AccessibleText>
            <View style={{ marginLeft: 16, flex: 1 }}>
              <AccessibleText variant="subheading" weight="bold">
                {language === 'hi' ? 'दृश्य शिक्षण (Visual Learning)' : 'Visual Learning'}
              </AccessibleText>
              <AccessibleText variant="caption" color={theme.textSecondary} style={{ marginTop: 2 }}>
                {language === 'hi'
                  ? 'चित्रमय व्यूह, टोकरियां और सेब, दृश्य संख्या कार्ड और स्क्रीन कीपैड।'
                  : 'Interactive arrays, visual grouping of items, animated flashcards, and keypad input.'}
              </AccessibleText>
            </View>
          </View>
        </Card>

        {/* Audio Focus */}
        <Card
          highlighted={currentMode === 'audio_focus'}
          onPress={() => handleSelect('audio_focus')}
          accessibilityLabel="Audio Focus mode. Listen to spoken questions and lessons, screen reader accessible."
          style={styles.card}
        >
          <View style={styles.row}>
            <AccessibleText variant="display">🔊</AccessibleText>
            <View style={{ marginLeft: 16, flex: 1 }}>
              <AccessibleText variant="subheading" weight="bold">
                {language === 'hi' ? 'ऑडियो केंद्रित (Audio Focus)' : 'Audio Focus'}
              </AccessibleText>
              <AccessibleText variant="caption" color={theme.textSecondary} style={{ marginTop: 2 }}>
                {language === 'hi'
                  ? 'बोलकर प्रश्न सुनना, स्पष्ट उच्चारण, धीमा या तेज भाषण, बिना स्क्रीन देखे अभ्यास।'
                  : 'Spoken questions, verbal hints, adjustable speech speed, designed for listening practice.'}
              </AccessibleText>
            </View>
          </View>
        </Card>

        {/* Hands-Free Voice */}
        <Card
          highlighted={currentMode === 'hands_free'}
          onPress={() => handleSelect('hands_free')}
          accessibilityLabel="Hands-Free Voice Practice. Listen to questions and speak answers aloud."
          style={styles.card}
        >
          <View style={styles.row}>
            <AccessibleText variant="display">🎙️</AccessibleText>
            <View style={{ marginLeft: 16, flex: 1 }}>
              <AccessibleText variant="subheading" weight="bold">
                {language === 'hi' ? 'हैंड्स-फ्री वॉयस अभ्यास' : 'Hands-Free Voice Practice'}
              </AccessibleText>
              <AccessibleText variant="caption" color={theme.textSecondary} style={{ marginTop: 2 }}>
                {language === 'hi'
                  ? 'फोन छुए बिना अभ्यास करें! ऐप प्रश्न बोलेगा, आप उत्तर बोलेंगे।'
                  : 'Practice completely hands-free. App asks, you speak the number, app automatically evaluates.'}
              </AccessibleText>
            </View>
          </View>
        </Card>
      </View>

      <AccessibleButton
        title={language === 'hi' ? 'शुरुआती मूल्यांकन' : 'Next: Initial Assessment'}
        size="lg"
        onPress={() => router.push('/onboarding/assessment')}
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
  card: {
    padding: 18,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
