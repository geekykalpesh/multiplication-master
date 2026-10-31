import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../src/hooks/useTheme';
import { AccessibleText } from '../src/components/common/AccessibleText';
import { AccessibleButton } from '../src/components/common/AccessibleButton';
import { Mascot } from '../src/components/common/Mascot';

export default function WelcomeScreen() {
  const router = useRouter();
  const { theme, language } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.mascotWrapper}>
          <Mascot mood="happy" size={130} />
        </View>

        <AccessibleText variant="huge" weight="black" style={styles.title}>
          Multiplication{'\n'}Master
        </AccessibleText>

        <AccessibleText
          variant="subheading"
          color={theme.primary}
          weight="semibold"
          style={styles.tagline}
        >
          {language === 'hi'
            ? 'गुणन और मानसिक गणित में सहज निपुणता'
            : 'Effortless Numerical Recall & Mental Mathematics'}
        </AccessibleText>

        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <AccessibleText variant="body" color={theme.textSecondary} style={styles.welcomeText}>
            {language === 'hi'
              ? 'Multiplication Master में आपका स्वागत है!\n\nचाहे आप बिल्कुल शुरुआत से सीख रहे हों या मानसिक गणित में अपनी गति बढ़ाना चाहते हों, हम कदम-दर-कदम आपका आत्मविश्वास बढ़ाएंगे।'
              : 'Welcome to Multiplication Master!\n\nWhether you are starting from zero or want to become faster at mental mathematics, we will help you build confidence one step at a time.'}
          </AccessibleText>
        </View>

        <View style={styles.actionContainer}>
          <AccessibleButton
            title={language === 'hi' ? 'सीखना शुरू करें' : 'Start Learning'}
            size="lg"
            variant="primary"
            onPress={() => router.push('/onboarding')}
            accessibilityHint="Begins the personalized onboarding setup"
          />

          <AccessibleButton
            title={language === 'hi' ? 'सीधे डैशबोर्ड पर जाएं' : 'Go directly to Dashboard'}
            size="md"
            variant="outline"
            onPress={() => router.replace('/(tabs)')}
            accessibilityHint="Skips onboarding and opens home dashboard"
            style={{ marginTop: 12 }}
          />
        </View>
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
    justifyContent: 'center',
    flexGrow: 1,
  },
  mascotWrapper: {
    marginBottom: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  tagline: {
    textAlign: 'center',
    marginBottom: 24,
  },
  card: {
    width: '100%',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 32,
  },
  welcomeText: {
    textAlign: 'center',
    lineHeight: 24,
  },
  actionContainer: {
    width: '100%',
  },
});
