import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/hooks/useTheme';
import { useUserStore } from '../../src/stores/userStore';
import { AccessibleText } from '../../src/components/common/AccessibleText';
import { AccessibleButton } from '../../src/components/common/AccessibleButton';
import { Card } from '../../src/components/common/Card';
import { Mascot } from '../../src/components/common/Mascot';

export default function SessionResultsScreen() {
  const router = useRouter();
  const { theme, language } = useTheme();
  const profile = useUserStore((s) => s.profile);
  const isAdult = profile?.targetAudience === 'adult';

  const params = useLocalSearchParams<{
    total?: string;
    correct?: string;
    accuracy?: string;
    latency?: string;
    mode?: string;
  }>();

  const total = parseInt(params.total || '10', 10);
  const correct = parseInt(params.correct || '0', 10);
  const accuracy = parseInt(params.accuracy || '0', 10);
  const latencyMs = parseInt(params.latency || '2500', 10);

  const getRecallPraise = () => {
    if (latencyMs < 2000) {
      return language === 'hi' ? 'बिजली जैसी गति (Instant Recall)' : 'Lightning Instant Recall!';
    } else if (latencyMs < 4000) {
      return language === 'hi' ? 'सटीक प्रवाह (Fluent Recall)' : 'Smooth & Fluent Recall!';
    } else {
      return language === 'hi' ? 'अच्छी एकाग्रता (Calculated Recall)' : 'Thoughtful Accuracy!';
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={styles.content}>
      {/* Mascot / Celebration */}
      {!isAdult && (
        <Mascot mood={accuracy >= 80 ? 'celebrating' : 'encouraging'} size={110} style={{ marginBottom: 12 }} />
      )}

      <AccessibleText variant="heading" weight="black" isHeading style={styles.title}>
        {accuracy >= 80
          ? language === 'hi'
            ? 'शानदार अभ्यास सत्र!'
            : 'Fantastic Session!'
          : language === 'hi'
          ? 'सत्र पूरा हुआ!'
          : 'Session Completed!'}
      </AccessibleText>

      <AccessibleText variant="subheading" color={theme.primary} weight="bold" style={styles.speedPraise}>
        {getRecallPraise()}
      </AccessibleText>

      {/* Main Score Card */}
      <Card style={styles.scoreCard}>
        <View style={styles.scoreRow}>
          <View style={styles.scoreCol}>
            <AccessibleText variant="huge" weight="black" color={theme.primary}>
              {accuracy}%
            </AccessibleText>
            <AccessibleText variant="caption" color={theme.textSecondary}>
              {language === 'hi' ? 'सटीकता' : 'Accuracy'}
            </AccessibleText>
          </View>

          <View style={styles.divider} />

          <View style={styles.scoreCol}>
            <AccessibleText variant="huge" weight="black" color={theme.success}>
              {correct}/{total}
            </AccessibleText>
            <AccessibleText variant="caption" color={theme.textSecondary}>
              {language === 'hi' ? 'सही उत्तर' : 'Correct'}
            </AccessibleText>
          </View>

          <View style={styles.divider} />

          <View style={styles.scoreCol}>
            <AccessibleText variant="huge" weight="black" color={theme.secondary}>
              {(latencyMs / 1000).toFixed(1)}s
            </AccessibleText>
            <AccessibleText variant="caption" color={theme.textSecondary}>
              {language === 'hi' ? 'औसत गति' : 'Avg Latency'}
            </AccessibleText>
          </View>
        </View>
      </Card>

      {/* Respectful Feedback Card */}
      <Card style={[styles.feedbackCard, { backgroundColor: theme.surfaceSubtle }]}>
        <AccessibleText variant="body" color={theme.textSecondary} style={{ textAlign: 'center', lineHeight: 22 }}>
          {accuracy === 100
            ? language === 'hi'
              ? 'शत प्रतिशत सटीकता! आपकी स्मृति में ये संख्या सम्बन्ध पूरी तरह सुदृढ़ हो रहे हैं।'
              : 'Flawless 100% precision! Your brain is solidifying these multiplication bonds into long-term memory.'
            : language === 'hi'
            ? 'निरंतर अभ्यास से मस्तिष्क में त्वरित स्मरण शक्ति स्वतः विकसित होती है।'
            : 'Every completed session deepens neural pathways. Consistent spaced practice turns calculation into automatic recall.'}
        </AccessibleText>
      </Card>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <AccessibleButton
          title={language === 'hi' ? 'एक और सत्र खेलें' : 'Practice Another Session'}
          size="lg"
          variant="primary"
          onPress={() => router.replace('/practice/session')}
          style={{ width: '100%' }}
        />

        <AccessibleButton
          title={language === 'hi' ? 'डैशबोर्ड पर वापस जाएं' : 'Return to Dashboard'}
          size="md"
          variant="outline"
          onPress={() => router.replace('/(tabs)')}
          style={{ width: '100%', marginTop: 8 }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 4,
  },
  speedPraise: {
    textAlign: 'center',
    marginBottom: 20,
  },
  scoreCard: {
    width: '100%',
    padding: 20,
    marginBottom: 20,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  scoreCol: {
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: 48,
    backgroundColor: '#E2E8F0',
  },
  feedbackCard: {
    width: '100%',
    padding: 16,
    marginBottom: 24,
  },
  actions: {
    width: '100%',
    gap: 8,
  },
});
