import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/hooks/useTheme';
import { useLearningStore } from '../../src/stores/learningStore';
import { getAllMasteryRecords } from '../../src/services/database/repositories/factsRepo';
import { MasteryRecord } from '../../src/types/database';
import { AccessibleText } from '../../src/components/common/AccessibleText';
import { AccessibleButton } from '../../src/components/common/AccessibleButton';
import { Card } from '../../src/components/common/Card';
import { ProgressBar } from '../../src/components/common/ProgressBar';

export default function ProgressScreen() {
  const router = useRouter();
  const { theme, language } = useTheme();

  const stats = useLearningStore((s) => s.stats);
  const weakFacts = useLearningStore((s) => s.weakFacts);
  const dueReviewsCount = useLearningStore((s) => s.dueReviewsCount);
  const unlockedBadgesCount = useLearningStore((s) => s.unlockedBadgesCount);
  const refreshLearningData = useLearningStore((s) => s.refreshLearningData);

  const [masteryRecords, setMasteryRecords] = useState<MasteryRecord[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    await refreshLearningData();
    const records = await getAllMasteryRecords();
    setMasteryRecords(records);
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const masteredCount = masteryRecords.filter((r) => r.isMastered).length;
  const inProgressCount = masteryRecords.filter((r) => r.totalAttempts > 0 && !r.isMastered).length;
  const unstartedCount = 400 - masteredCount - inProgressCount;
  const overallMasteryPercent = Math.round((masteredCount / 400) * 100);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <AccessibleText variant="heading" weight="bold" isHeading style={styles.title}>
        {language === 'hi' ? 'आपकी प्रगति व विश्लेषण' : 'Mastery & Progress'}
      </AccessibleText>
      <AccessibleText variant="caption" color={theme.textSecondary} style={styles.subtitle}>
        {language === 'hi'
          ? 'स्थानीय डेटाबेस द्वारा गणना किए गए वास्तविक आँकड़े।'
          : 'Completely private metrics derived from your local device database.'}
      </AccessibleText>

      {/* Primary Recall Mastery Card */}
      <Card style={styles.mainCard}>
        <View style={styles.mainCardHeader}>
          <View>
            <AccessibleText variant="caption" color={theme.textSecondary}>
              {language === 'hi' ? 'कुल स्मरण निपुणता' : 'Overall Recall Mastery'}
            </AccessibleText>
            <AccessibleText variant="huge" weight="black" color={theme.primary}>
              {overallMasteryPercent}%
            </AccessibleText>
          </View>
          <View style={styles.masteredPill}>
            <AccessibleText variant="caption" weight="bold" color={theme.success}>
              {masteredCount} / 400 Facts
            </AccessibleText>
          </View>
        </View>

        <ProgressBar progress={overallMasteryPercent / 100} height={10} style={{ marginVertical: 12 }} />

        <View style={styles.breakdownRow}>
          <View style={styles.breakdownItem}>
            <View style={[styles.dot, { backgroundColor: theme.success }]} />
            <AccessibleText variant="caption">
              {language === 'hi' ? `सिद्ध: ${masteredCount}` : `Mastered: ${masteredCount}`}
            </AccessibleText>
          </View>
          <View style={styles.breakdownItem}>
            <View style={[styles.dot, { backgroundColor: theme.warning }]} />
            <AccessibleText variant="caption">
              {language === 'hi' ? `प्रगति में: ${inProgressCount}` : `Learning: ${inProgressCount}`}
            </AccessibleText>
          </View>
          <View style={styles.breakdownItem}>
            <View style={[styles.dot, { backgroundColor: '#CBD5E1' }]} />
            <AccessibleText variant="caption">
              {language === 'hi' ? `शेष: ${unstartedCount}` : `Unseen: ${unstartedCount}`}
            </AccessibleText>
          </View>
        </View>
      </Card>

      {/* Grid of Key Performance Indicators */}
      <View style={styles.kpiGrid}>
        <Card style={styles.kpiCard}>
          <AccessibleText variant="caption" color={theme.textSecondary}>
            {language === 'hi' ? 'कुल प्रश्न' : 'Questions'}
          </AccessibleText>
          <AccessibleText variant="subheading" weight="bold" style={styles.kpiValue}>
            {stats.totalQuestions}
          </AccessibleText>
          <AccessibleText variant="caption" color={theme.textMuted}>
            {stats.correctAnswers} correct
          </AccessibleText>
        </Card>

        <Card style={styles.kpiCard}>
          <AccessibleText variant="caption" color={theme.textSecondary}>
            {language === 'hi' ? 'औसत गति' : 'Recall Latency'}
          </AccessibleText>
          <AccessibleText variant="subheading" weight="bold" style={styles.kpiValue}>
            {(stats.averageLatencyMs / 1000).toFixed(1)}s
          </AccessibleText>
          <AccessibleText variant="caption" color={theme.textMuted}>
            {stats.averageLatencyMs < 3000 ? 'Fluent' : 'Calculated'}
          </AccessibleText>
        </Card>

        <Card style={styles.kpiCard}>
          <AccessibleText variant="caption" color={theme.textSecondary}>
            {language === 'hi' ? 'अभ्यास सत्र' : 'Sessions'}
          </AccessibleText>
          <AccessibleText variant="subheading" weight="bold" style={styles.kpiValue}>
            {stats.totalSessions}
          </AccessibleText>
          <AccessibleText variant="caption" color={theme.textMuted}>
            Completed
          </AccessibleText>
        </Card>

        <Card style={styles.kpiCard}>
          <AccessibleText variant="caption" color={theme.textSecondary}>
            {language === 'hi' ? 'स्ट्रीक' : 'Daily Streak'}
          </AccessibleText>
          <AccessibleText variant="subheading" weight="bold" style={styles.kpiValue}>
            {stats.streakDays} Days
          </AccessibleText>
          <AccessibleText variant="caption" color={theme.textMuted}>
            Consistent
          </AccessibleText>
        </Card>
      </View>

      {/* Actionable Sections: Weak Facts & Spaced Repetition */}
      <Card
        onPress={() => router.push('/progress/weak-facts')}
        style={styles.actionCard}
      >
        <View style={styles.actionCardHeader}>
          <View style={[styles.iconCircle, { backgroundColor: '#FEF3C7' }]}>
            <Ionicons name="alert-circle" size={24} color="#D97706" />
          </View>
          <View style={{ flex: 1, marginLeft: 16 }}>
            <AccessibleText variant="body" weight="bold">
              {language === 'hi' ? 'कमजोर तथ्य विश्लेषण' : 'Weak Facts Analysis'}
            </AccessibleText>
            <AccessibleText variant="caption" color={theme.textSecondary}>
              {weakFacts.length > 0
                ? `${weakFacts.length} facts flagged for targeted reinforcement`
                : 'No struggling facts right now!'}
            </AccessibleText>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
        </View>
      </Card>

      <Card
        onPress={() => router.push('/progress/spaced-repetition')}
        style={styles.actionCard}
      >
        <View style={styles.actionCardHeader}>
          <View style={[styles.iconCircle, { backgroundColor: '#EDE9FE' }]}>
            <Ionicons name="repeat" size={24} color="#7C3AED" />
          </View>
          <View style={{ flex: 1, marginLeft: 16 }}>
            <AccessibleText variant="body" weight="bold">
              {language === 'hi' ? 'स्मरण अंतराल समीक्षा' : 'Spaced Repetition Schedule'}
            </AccessibleText>
            <AccessibleText variant="caption" color={theme.textSecondary}>
              {dueReviewsCount > 0
                ? `${dueReviewsCount} facts due for review today`
                : 'All reviews up to date!'}
            </AccessibleText>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
        </View>
      </Card>

      <Card
        onPress={() => router.push('/progress/achievements')}
        style={styles.actionCard}
      >
        <View style={styles.actionCardHeader}>
          <View style={[styles.iconCircle, { backgroundColor: '#DBEAFE' }]}>
            <Ionicons name="trophy" size={24} color="#2563EB" />
          </View>
          <View style={{ flex: 1, marginLeft: 16 }}>
            <AccessibleText variant="body" weight="bold">
              {language === 'hi' ? 'पदक और उपलब्धियाँ' : 'Earned Badges'}
            </AccessibleText>
            <AccessibleText variant="caption" color={theme.textSecondary}>
              {unlockedBadgesCount} achievements unlocked
            </AccessibleText>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
        </View>
      </Card>
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
  mainCard: {
    padding: 20,
    marginBottom: 20,
  },
  mainCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  masteredPill: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#DCFCE7',
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  breakdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  kpiCard: {
    width: '48%',
    padding: 14,
  },
  kpiValue: {
    marginVertical: 4,
  },
  actionCard: {
    padding: 16,
    marginBottom: 12,
  },
  actionCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
