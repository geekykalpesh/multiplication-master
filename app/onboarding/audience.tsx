import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/hooks/useTheme';
import { useUserStore } from '../../src/stores/userStore';
import { TargetAudience } from '../../src/types/database';
import { AccessibleText } from '../../src/components/common/AccessibleText';
import { AccessibleButton } from '../../src/components/common/AccessibleButton';
import { Card } from '../../src/components/common/Card';

export default function OnboardingAudienceScreen() {
  const router = useRouter();
  const { theme, language } = useTheme();
  const currentAudience = useUserStore((s) => s.profile?.targetAudience || 'child');
  const setTargetAudience = useUserStore((s) => s.setTargetAudience);
  const updatePreferences = useUserStore((s) => s.updatePreferences);

  const handleSelect = async (aud: TargetAudience) => {
    await setTargetAudience(aud);
    if (aud === 'adult') {
      // Adults prefer restrained presentation
      await updatePreferences({ mascotEnabled: false });
    } else if (aud === 'visually_impaired') {
      await updatePreferences({ learningMode: 'audio_focus', highContrast: true });
    }
    router.push('/onboarding/mode');
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={styles.content}>
      <AccessibleText variant="heading" weight="bold" isHeading style={styles.title}>
        {language === 'hi' ? 'सीखने का अनुभव चुनें' : 'Who is learning?'}
      </AccessibleText>
      <AccessibleText variant="body" color={theme.textSecondary} style={styles.subtitle}>
        {language === 'hi'
          ? 'हम इंटरफ़ेस और भाषा को आपके अनुसार अनुकूलित करेंगे।'
          : 'We tailor the interface, tone, and pacing to match your comfort and goals.'}
      </AccessibleText>

      <View style={styles.list}>
        {/* Children */}
        <Card
          highlighted={currentAudience === 'child'}
          onPress={() => handleSelect('child')}
          accessibilityLabel="Children mode. Mascot, playful animations, encouraging badges."
          style={styles.card}
        >
          <View style={styles.row}>
            <AccessibleText variant="display">🚀</AccessibleText>
            <View style={{ marginLeft: 16, flex: 1 }}>
              <AccessibleText variant="subheading" weight="bold">
                {language === 'hi' ? 'बच्चे (Children)' : 'Young Learners & Students'}
              </AccessibleText>
              <AccessibleText variant="caption" color={theme.textSecondary} style={{ marginTop: 2 }}>
                {language === 'hi'
                  ? 'रोचक चित्र, एनिमेटेड ग्रिड, मित्रवत मस्कॉट और उत्साहवर्धक पुरस्कार।'
                  : 'Playful animations, friendly Numi mascot, badges, and bite-sized lessons.'}
              </AccessibleText>
            </View>
          </View>
        </Card>

        {/* Adults */}
        <Card
          highlighted={currentAudience === 'adult'}
          onPress={() => handleSelect('adult')}
          accessibilityLabel="Adults mode. Clean professional interface, practical real-world math, zero childish clutter."
          style={styles.card}
        >
          <View style={styles.row}>
            <AccessibleText variant="display">💼</AccessibleText>
            <View style={{ marginLeft: 16, flex: 1 }}>
              <AccessibleText variant="subheading" weight="bold">
                {language === 'hi' ? 'वयस्क (Adults)' : 'Adults & Professionals'}
              </AccessibleText>
              <AccessibleText variant="caption" color={theme.textSecondary} style={{ marginTop: 2 }}>
                {language === 'hi'
                  ? 'गंभीर व शांत इंटरफ़ेस, व्यावहारिक गणित (₹), बिना किसी बचकानेपन के।'
                  : 'Clean, distraction-free design, practical INR math, and respectful explanations.'}
              </AccessibleText>
            </View>
          </View>
        </Card>

        {/* Blind / Visually Impaired */}
        <Card
          highlighted={currentAudience === 'visually_impaired'}
          onPress={() => handleSelect('visually_impaired')}
          accessibilityLabel="Audio Focus & Screen Reader mode. Optimized for blind and visually impaired users."
          style={styles.card}
        >
          <View style={styles.row}>
            <AccessibleText variant="display">🎧</AccessibleText>
            <View style={{ marginLeft: 16, flex: 1 }}>
              <AccessibleText variant="subheading" weight="bold">
                {language === 'hi' ? 'दृष्टि बाधित और ऑडियो केंद्रित' : 'Audio-First & Screen Reader'}
              </AccessibleText>
              <AccessibleText variant="caption" color={theme.textSecondary} style={{ marginTop: 2 }}>
                {language === 'hi'
                  ? 'स्क्रीन देखे बिना पूर्ण शिक्षण, टॉकबैक अनुकूल, उच्च कंट्रास्ट और ध्वनि उत्तर।'
                  : 'Full audio journey, TalkBack/VoiceOver, high contrast, hands-free voice answering.'}
              </AccessibleText>
            </View>
          </View>
        </Card>
      </View>

      <AccessibleButton
        title={language === 'hi' ? 'आगे बढ़ें' : 'Continue'}
        size="lg"
        onPress={() => router.push('/onboarding/mode')}
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
