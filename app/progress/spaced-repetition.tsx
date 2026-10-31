import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/hooks/useTheme';
import { getSpacedRepetitionDue } from '../../src/services/database/repositories/factsRepo';
import { SpacedRepetitionItem } from '../../src/types/database';
import { AccessibleText } from '../../src/components/common/AccessibleText';
import { AccessibleButton } from '../../src/components/common/AccessibleButton';
import { Card } from '../../src/components/common/Card';
import { Badge } from '../../src/components/common/Badge';

export default function SpacedRepetitionScreen() {
  const router = useRouter();
  const { theme, language } = useTheme();
  const [dueItems, setDueItems] = useState<SpacedRepetitionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDue() {
      const items = await getSpacedRepetitionDue(50);
      setDueItems(items);
      setLoading(false);
    }
    fetchDue();
  }, []);

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={styles.content}>
      <AccessibleText variant="heading" weight="bold" isHeading style={styles.title}>
        {language === 'hi' ? 'स्मरण अंतराल अनुसूची' : 'Spaced Repetition Schedule'}
      </AccessibleText>
      <AccessibleText variant="caption" color={theme.textSecondary} style={styles.subtitle}>
        {language === 'hi'
          ? 'सुपरमेमो (SM-2) एल्गोरिदम पर आधारित वैज्ञानिक समीक्षा प्रणाली। (1 दिन, 3 दिन, 7 दिन, 14 दिन, 30 दिन)'
          : 'Scientifically timed recall intervals (1d, 3d, 7d, 14d, 30d) based on local SM-2 algorithm.'}
      </AccessibleText>

      {dueItems.length === 0 ? (
        <Card style={styles.emptyCard}>
          <AccessibleText variant="display">✨</AccessibleText>
          <AccessibleText variant="subheading" weight="bold" style={{ marginTop: 12 }}>
            {language === 'hi' ? 'आज कोई समीक्षा देय नहीं है!' : 'All Reviews Complete!'}
          </AccessibleText>
          <AccessibleText variant="caption" color={theme.textSecondary} style={{ textAlign: 'center', marginTop: 4 }}>
            {language === 'hi'
              ? 'आपकी सभी गुणन तालिकाएं अपने निर्धारित अंतराल के अनुसार सुरक्षित हैं।'
              : 'Your scheduled retention intervals are optimal. Check back tomorrow for the next review batch.'}
          </AccessibleText>
          <AccessibleButton
            title={language === 'hi' ? 'सामान्य अभ्यास करें' : 'Practice Ahead Anyway'}
            variant="outline"
            onPress={() => router.push('/practice/session')}
            style={{ marginTop: 16 }}
          />
        </Card>
      ) : (
        <View style={styles.list}>
          <Card style={[styles.summaryCard, { backgroundColor: theme.primaryLight }]}>
            <AccessibleText variant="subheading" weight="bold" color={theme.primaryDark}>
              {language === 'hi'
                ? `आज ${dueItems.length} तथ्यों की समीक्षा देय है`
                : `${dueItems.length} facts due for review today`}
            </AccessibleText>
            <AccessibleText variant="caption" color={theme.textSecondary} style={{ marginTop: 2 }}>
              {language === 'hi'
                ? 'नियमित समीक्षा भूलने की गति को रोकती है।'
                : 'Reviewing on exact interval days prevents memory decay.'}
            </AccessibleText>
          </Card>

          {dueItems.map((item) => (
            <Card key={item.factId} style={styles.itemCard}>
              <View style={styles.itemHeader}>
                <AccessibleText variant="subheading" weight="black">
                  {item.factId.replace('x', ' × ')}
                </AccessibleText>
                <Badge
                  label={`${item.intervalDays}d interval`}
                  variant="info"
                />
              </View>
              <AccessibleText variant="caption" color={theme.textSecondary}>
                Repetitions: {item.repetitionCount} • Ease Factor: {item.easeFactor}
              </AccessibleText>
            </Card>
          ))}

          <AccessibleButton
            title={language === 'hi' ? 'देय समीक्षा अभी शुरू करें' : 'Review Due Facts Now'}
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
  summaryCard: {
    padding: 16,
  },
  itemCard: {
    padding: 14,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
});
