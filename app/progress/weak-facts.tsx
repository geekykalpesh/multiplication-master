import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/hooks/useTheme';
import { useLearningStore } from '../../src/stores/learningStore';
import { AccessibleText } from '../../src/components/common/AccessibleText';
import { AccessibleButton } from '../../src/components/common/AccessibleButton';
import { Card } from '../../src/components/common/Card';
import { Badge } from '../../src/components/common/Badge';

export default function WeakFactsScreen() {
  const router = useRouter();
  const { theme, language } = useTheme();
  const weakFacts = useLearningStore((s) => s.weakFacts);

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={styles.content}>
      <AccessibleText variant="heading" weight="bold" isHeading style={styles.title}>
        {language === 'hi' ? 'लक्षित कमजोर तथ्य' : 'Targeted Weak Facts'}
      </AccessibleText>
      <AccessibleText variant="caption" color={theme.textSecondary} style={styles.subtitle}>
        {language === 'hi'
          ? 'हम उन गुणन तथ्यों की पहचान करते हैं जिनमें आपको अधिक समय लगता है या त्रुटियां होती हैं, ताकि आप केवल उन्हीं पर ध्यान केंद्रित कर सकें।'
          : 'Facts with lower accuracy or hesitation latency are prioritized for targeted reinforcement.'}
      </AccessibleText>

      {weakFacts.length === 0 ? (
        <Card style={styles.emptyCard}>
          <AccessibleText variant="display">🎉</AccessibleText>
          <AccessibleText variant="subheading" weight="bold" style={{ marginTop: 12 }}>
            {language === 'hi' ? 'कोई कमजोर तथ्य नहीं मिला!' : 'No Weak Facts Detected!'}
          </AccessibleText>
          <AccessibleText variant="caption" color={theme.textSecondary} style={{ textAlign: 'center', marginTop: 4 }}>
            {language === 'hi'
              ? 'आप सभी अभ्यास किए गए तथ्यों में अच्छा प्रदर्शन कर रहे हैं।'
              : 'You have shown high accuracy and fluid recall across all practiced facts.'}
          </AccessibleText>
          <AccessibleButton
            title={language === 'hi' ? 'नया अभ्यास शुरू करें' : 'Practice Mixed Tables'}
            variant="primary"
            size="md"
            onPress={() => router.push('/practice/session')}
            style={{ marginTop: 16 }}
          />
        </Card>
      ) : (
        <View style={styles.list}>
          {weakFacts.map((wf) => (
            <Card key={wf.factId} style={styles.factCard}>
              <View style={styles.factHeader}>
                <AccessibleText variant="heading" weight="black">
                  {wf.factorA} × {wf.factorB} = {wf.product}
                </AccessibleText>
                <Badge
                  label={wf.severity.toUpperCase()}
                  variant={wf.severity === 'high' ? 'warning' : 'info'}
                />
              </View>

              <View style={styles.reasonsList}>
                {wf.reasons.map((r, i) => (
                  <View key={`r_${i}`} style={styles.reasonRow}>
                    <Ionicons name="alert-circle-outline" size={16} color={theme.warning} />
                    <AccessibleText variant="caption" color={theme.textSecondary} style={{ marginLeft: 6 }}>
                      {r}
                    </AccessibleText>
                  </View>
                ))}
              </View>

              <AccessibleText variant="caption" color={theme.textMuted} style={{ marginTop: 6 }}>
                Related practice pairs: {wf.suggestedPracticeIds.join(', ')}
              </AccessibleText>
            </Card>
          ))}

          <AccessibleButton
            title={language === 'hi' ? 'कमजोर तथ्यों का लक्षित अभ्यास करें' : 'Start Targeted Drill Now'}
            size="lg"
            variant="primary"
            onPress={() => router.push('/practice/session')}
            style={{ marginTop: 16 }}
          />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    marginBottom: 4,
  },
  subtitle: {
    marginBottom: 20,
  },
  emptyCard: {
    padding: 32,
    alignItems: 'center',
  },
  list: {
    gap: 12,
  },
  factCard: {
    padding: 16,
  },
  factHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reasonsList: {
    gap: 4,
  },
  reasonRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
