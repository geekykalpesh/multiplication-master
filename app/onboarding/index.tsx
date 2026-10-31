import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/hooks/useTheme';
import { AccessibleText } from '../../src/components/common/AccessibleText';
import { AccessibleButton } from '../../src/components/common/AccessibleButton';
import { Card } from '../../src/components/common/Card';
import { Mascot } from '../../src/components/common/Mascot';

export default function OnboardingWelcomeScreen() {
  const router = useRouter();
  const { theme, language } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Mascot mood="encouraging" size={120} style={{ marginBottom: 16 }} />

        <AccessibleText variant="heading" weight="bold" isHeading style={styles.title}>
          {language === 'hi' ? 'स्वागत है!' : 'Let us personalize your journey'}
        </AccessibleText>

        <AccessibleText variant="body" color={theme.textSecondary} style={styles.subtitle}>
          {language === 'hi'
            ? 'हम आपकी प्राथमिकताओं और गति के अनुसार गणित शिक्षण को अनुकूलित करेंगे।'
            : 'Multiplication Master adapts to your unique learning style, whether visual, auditory, or hands-free.'}
        </AccessibleText>

        <View style={styles.cardsList}>
          <Card style={styles.infoCard}>
            <AccessibleText variant="subheading" weight="bold">
              🔒 100% Offline & Private
            </AccessibleText>
            <AccessibleText variant="caption" color={theme.textSecondary} style={{ marginTop: 4 }}>
              {language === 'hi'
                ? 'कोई खाता नहीं, कोई क्लाउड सर्वर नहीं। आपकी प्रगति केवल आपके डिवाइस पर सुरक्षित रहती है।'
                : 'Zero logins, zero cloud tracking. Your learning and audio stay entirely on your device.'}
            </AccessibleText>
          </Card>

          <Card style={styles.infoCard}>
            <AccessibleText variant="subheading" weight="bold">
              🧠 Real Fluency & Automatic Recall
            </AccessibleText>
            <AccessibleText variant="caption" color={theme.textSecondary} style={{ marginTop: 4 }}>
              {language === 'hi'
                ? 'केवल रटना नहीं, बल्कि अवधारणाओं और त्वरित गणना में आत्मविश्वास हासिल करना।'
                : 'Move beyond rote memorization to automatic mathematical fluency.'}
            </AccessibleText>
          </Card>
        </View>

        <AccessibleButton
          title={language === 'hi' ? 'अगला: भाषा चुनें' : 'Next: Choose Language'}
          size="lg"
          onPress={() => router.push('/onboarding/language')}
          style={{ width: '100%', marginTop: 24 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    padding: 24,
    alignItems: 'center',
    flexGrow: 1,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  cardsList: {
    width: '100%',
    gap: 16,
  },
  infoCard: {
    width: '100%',
  },
});
