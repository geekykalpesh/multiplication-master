import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/hooks/useTheme';
import { useUserStore } from '../../src/stores/userStore';
import { useLearningStore } from '../../src/stores/learningStore';
import { AccessibleText } from '../../src/components/common/AccessibleText';
import { AccessibleButton } from '../../src/components/common/AccessibleButton';
import { Card } from '../../src/components/common/Card';
import { Mascot } from '../../src/components/common/Mascot';
import { ProgressBar } from '../../src/components/common/ProgressBar';
import { Badge } from '../../src/components/common/Badge';

export default function HomeDashboardScreen() {
  const router = useRouter();
  const { theme, language } = useTheme();

  const profile = useUserStore((s) => s.profile);
  const preferences = useUserStore((s) => s.preferences);
  const stats = useLearningStore((s) => s.stats);
  const weakFacts = useLearningStore((s) => s.weakFacts);
  const dueReviewsCount = useLearningStore((s) => s.dueReviewsCount);
  const unlockedBadgesCount = useLearningStore((s) => s.unlockedBadgesCount);
  const refreshLearningData = useLearningStore((s) => s.refreshLearningData);

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshLearningData();
    setRefreshing(false);
  };

  useEffect(() => {
    refreshLearningData();
  }, []);

  const isAdult = profile?.targetAudience === 'adult';
  const greeting =
    language === 'hi'
      ? `नमस्ते, ${profile?.name || 'शिक्षार्थी'}!`
      : `Welcome back, ${profile?.name || 'Learner'}!`;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Header with Mascot & Greeting */}
      <View style={styles.topHeader}>
        <View style={{ flex: 1 }}>
          <AccessibleText variant="caption" color={theme.textSecondary} weight="semibold">
            {language === 'hi' ? 'दैनिक गणित अभ्यास' : 'Daily Mental Math'}
          </AccessibleText>
          <AccessibleText variant="heading" weight="bold">
            {greeting}
          </AccessibleText>
        </View>
        {!isAdult && preferences.mascotEnabled && (
          <Mascot mood="happy" size={68} />
        )}
      </View>

      {/* Streak & Daily Goal Summary Banner */}
      <Card style={styles.statsBanner}>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <View style={styles.iconValRow}>
              <AccessibleText variant="subheading">🔥</AccessibleText>
              <AccessibleText variant="subheading" weight="bold" style={{ marginLeft: 4 }}>
                {stats.streakDays}
              </AccessibleText>
            </View>
            <AccessibleText variant="caption" color={theme.textSecondary}>
              {language === 'hi' ? 'दिनों का स्ट्रीक' : 'Day Streak'}
            </AccessibleText>
          </View>

          <View style={styles.divider} />

          <View style={styles.statItem}>
            <View style={styles.iconValRow}>
              <AccessibleText variant="subheading">🎯</AccessibleText>
              <AccessibleText variant="subheading" weight="bold" style={{ marginLeft: 4 }}>
                {stats.accuracyPercentage}%
              </AccessibleText>
            </View>
            <AccessibleText variant="caption" color={theme.textSecondary}>
              {language === 'hi' ? 'सटीकता' : 'Accuracy'}
            </AccessibleText>
          </View>

          <View style={styles.divider} />

          <View style={styles.statItem}>
            <View style={styles.iconValRow}>
              <AccessibleText variant="subheading">⚡</AccessibleText>
              <AccessibleText variant="subheading" weight="bold" style={{ marginLeft: 4 }}>
                {(stats.averageLatencyMs / 1000).toFixed(1)}s
              </AccessibleText>
            </View>
            <AccessibleText variant="caption" color={theme.textSecondary}>
              {language === 'hi' ? 'औसत गति' : 'Avg Recall'}
            </AccessibleText>
          </View>
        </View>
      </Card>

      {/* Spaced Repetition Due Alert */}
      {dueReviewsCount > 0 && (
        <Card
          highlighted
          onPress={() => router.push('/progress/spaced-repetition')}
          style={styles.alertCard}
        >
          <View style={styles.alertRow}>
            <Ionicons name="time" size={28} color={theme.primary} />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <AccessibleText variant="body" weight="bold">
                {language === 'hi'
                  ? `${dueReviewsCount} संख्या तथ्य आज समीक्षा हेतु देय हैं`
                  : `${dueReviewsCount} facts due for review today`}
              </AccessibleText>
              <AccessibleText variant="caption" color={theme.textSecondary}>
                {language === 'hi'
                  ? 'दीर्घकालिक स्मरण शक्ति को मजबूत करने के लिए दोहराएं।'
                  : 'Spaced repetition schedule recommends practicing these now.'}
              </AccessibleText>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
          </View>
        </Card>
      )}

      {/* Quick Action Buttons */}
      <AccessibleText variant="subheading" weight="bold" style={styles.sectionTitle}>
        {language === 'hi' ? 'त्वरित अभ्यास' : 'Quick Practice Modes'}
      </AccessibleText>

      <View style={styles.gridCards}>
        {/* Hands-Free Voice Practice */}
        <Card
          onPress={() => router.push('/practice/voice')}
          accessibilityLabel="Hands-free voice practice. Practice multiplication entirely through speech without touching screen."
          style={styles.modeCard}
        >
          <View style={styles.modeIconCircle}>
            <Ionicons name="mic" size={24} color="#EF4444" />
          </View>
          <AccessibleText variant="body" weight="bold" style={{ marginTop: 10 }}>
            {language === 'hi' ? 'हैंड्स-फ्री वॉयस' : 'Hands-Free Voice'}
          </AccessibleText>
          <AccessibleText variant="caption" color={theme.textSecondary} style={{ marginTop: 4 }}>
            {language === 'hi' ? 'बोलकर उत्तर दें' : 'Speak numbers aloud'}
          </AccessibleText>
        </Card>

        {/* Audio Focus Mode */}
        <Card
          onPress={() => router.push('/practice/audio-focus')}
          accessibilityLabel="Audio Focus mode. Screen-reader and listening practice."
          style={styles.modeCard}
        >
          <View style={styles.modeIconCircle}>
            <Ionicons name="volume-high" size={24} color="#7C3AED" />
          </View>
          <AccessibleText variant="body" weight="bold" style={{ marginTop: 10 }}>
            {language === 'hi' ? 'ऑडियो केंद्रित' : 'Audio Focus'}
          </AccessibleText>
          <AccessibleText variant="caption" color={theme.textSecondary} style={{ marginTop: 4 }}>
            {language === 'hi' ? 'बिना स्क्रीन देखे सीखें' : 'Screen-reader friendly'}
          </AccessibleText>
        </Card>

        {/* Visual Practice Session */}
        <Card
          onPress={() => router.push('/practice/session')}
          accessibilityLabel="Interactive Visual Practice. Multiple choice, missing numbers, and keypad input."
          style={styles.modeCard}
        >
          <View style={styles.modeIconCircle}>
            <Ionicons name="play" size={24} color="#2563EB" />
          </View>
          <AccessibleText variant="body" weight="bold" style={{ marginTop: 10 }}>
            {language === 'hi' ? 'सक्रिय अभ्यास' : 'Visual Practice'}
          </AccessibleText>
          <AccessibleText variant="caption" color={theme.textSecondary} style={{ marginTop: 4 }}>
            {language === 'hi' ? 'कीपैड व विकल्प' : 'Keypad & flashcards'}
          </AccessibleText>
        </Card>

        {/* Tables Explorer */}
        <Card
          onPress={() => router.push('/(tabs)/journey')}
          accessibilityLabel="Curriculum and tables 1 to 20 roadmap."
          style={styles.modeCard}
        >
          <View style={styles.modeIconCircle}>
            <Ionicons name="grid" size={24} color="#059669" />
          </View>
          <AccessibleText variant="body" weight="bold" style={{ marginTop: 10 }}>
            {language === 'hi' ? 'पहाड़े 1–20' : 'Tables 1–20'}
          </AccessibleText>
          <AccessibleText variant="caption" color={theme.textSecondary} style={{ marginTop: 4 }}>
            {language === 'hi' ? 'पाठ्यक्रम और तालिका' : 'Curriculum roadmap'}
          </AccessibleText>
        </Card>
      </View>

      {/* Weak Facts Section if any */}
      {weakFacts.length > 0 && (
        <View style={styles.weakSection}>
          <View style={styles.sectionHeaderRow}>
            <AccessibleText variant="subheading" weight="bold">
              {language === 'hi' ? 'सुधार हेतु चिह्नित तथ्य' : 'Weak Facts Detected'}
            </AccessibleText>
            <AccessibleButton
              title={language === 'hi' ? 'सभी देखें' : 'View All'}
              variant="ghost"
              size="sm"
              onPress={() => router.push('/progress/weak-facts')}
            />
          </View>

          <Card style={{ padding: 16 }}>
            <AccessibleText variant="caption" color={theme.textSecondary} style={{ marginBottom: 8 }}>
              {language === 'hi'
                ? 'इन तथ्यों में अधिक समय या त्रुटियां देखी गईं:'
                : 'Targeted practice recommended for these multiplication pairs:'}
            </AccessibleText>
            <View style={styles.weakTagsRow}>
              {weakFacts.slice(0, 4).map((wf) => (
                <Badge
                  key={wf.factId}
                  label={`${wf.factorA} × ${wf.factorB} = ${wf.product}`}
                  variant={wf.severity === 'high' ? 'warning' : 'primary'}
                />
              ))}
            </View>
          </Card>
        </View>
      )}

      {/* Achievements teaser */}
      <Card
        onPress={() => router.push('/progress/achievements')}
        style={styles.achieveCard}
      >
        <View style={styles.alertRow}>
          <AccessibleText variant="display">🏆</AccessibleText>
          <View style={{ marginLeft: 16, flex: 1 }}>
            <AccessibleText variant="body" weight="bold">
              {language === 'hi' ? 'उपलब्धियां और पदक' : 'Achievements & Milestones'}
            </AccessibleText>
            <AccessibleText variant="caption" color={theme.textSecondary}>
              {language === 'hi'
                ? `${unlockedBadgesCount} पदक अनलॉक किए गए हैं`
                : `${unlockedBadgesCount} badges earned locally`}
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
    paddingBottom: 36,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statsBanner: {
    padding: 16,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  iconValRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: 36,
    backgroundColor: '#CBD5E1',
  },
  alertCard: {
    marginBottom: 20,
    padding: 14,
  },
  alertRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    marginBottom: 12,
  },
  gridCards: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  modeCard: {
    width: '48%',
    padding: 16,
  },
  modeIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  weakSection: {
    marginBottom: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  weakTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  achieveCard: {
    padding: 16,
  },
});
