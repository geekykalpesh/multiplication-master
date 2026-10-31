import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { ACHIEVEMENTS, AchievementDefinition } from '../../src/constants/achievements';
import { getUserAchievements, UnlockedAchievementInfo } from '../../src/services/database/repositories/achievementsRepo';
import { AccessibleText } from '../../src/components/common/AccessibleText';
import { Card } from '../../src/components/common/Card';
import { Badge } from '../../src/components/common/Badge';

export default function AchievementsScreen() {
  const { theme, language } = useTheme();
  const [unlockedList, setUnlockedList] = useState<UnlockedAchievementInfo[]>([]);

  useEffect(() => {
    async function loadAchievements() {
      const list = await getUserAchievements();
      setUnlockedList(list);
    }
    loadAchievements();
  }, []);

  const unlockedMap = new Map(unlockedList.map((u) => [u.achievement.id, u.unlockedAt]));

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={styles.content}>
      <AccessibleText variant="heading" weight="bold" isHeading style={styles.title}>
        {language === 'hi' ? 'उपलब्धियां और पदक' : 'Achievements & Milestones'}
      </AccessibleText>
      <AccessibleText variant="caption" color={theme.textSecondary} style={styles.subtitle}>
        {language === 'hi'
          ? 'नियमित अभ्यास, सटीकता और पहाड़ों में निपुणता के लिए स्थानीय पदक।'
          : 'Meaningful milestones celebrating persistence, recall accuracy, and mathematical mastery.'}
      </AccessibleText>

      <Card style={[styles.summaryCard, { backgroundColor: theme.surfaceSubtle }]}>
        <AccessibleText variant="subheading" weight="bold">
          {unlockedList.length} / {ACHIEVEMENTS.length} {language === 'hi' ? 'पदक अनलॉक' : 'Badges Earned'}
        </AccessibleText>
      </Card>

      <View style={styles.list}>
        {ACHIEVEMENTS.map((ach) => {
          const unlockedAt = unlockedMap.get(ach.id);
          const isUnlocked = Boolean(unlockedAt);

          return (
            <Card
              key={ach.id}
              style={[
                styles.achieveCard,
                !isUnlocked && { opacity: 0.6 },
              ]}
            >
              <AccessibleText variant="huge" style={styles.icon}>
                {ach.icon}
              </AccessibleText>

              <View style={{ flex: 1, marginLeft: 16 }}>
                <View style={styles.headerRow}>
                  <AccessibleText variant="subheading" weight="bold">
                    {ach.title[language]}
                  </AccessibleText>
                  <Badge
                    label={isUnlocked ? 'EARNED' : 'LOCKED'}
                    variant={isUnlocked ? 'gold' : 'info'}
                  />
                </View>

                <AccessibleText variant="caption" color={theme.textSecondary} style={{ marginTop: 2 }}>
                  {ach.description[language]}
                </AccessibleText>

                {isUnlocked && unlockedAt && (
                  <AccessibleText variant="caption" color={theme.textMuted} style={{ marginTop: 4 }}>
                    Unlocked on: {new Date(unlockedAt).toLocaleDateString()}
                  </AccessibleText>
                )}
              </View>
            </Card>
          );
        })}
      </View>
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
    marginBottom: 16,
  },
  summaryCard: {
    padding: 14,
    marginBottom: 16,
    alignItems: 'center',
  },
  list: {
    gap: 12,
  },
  achieveCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  icon: {
    fontSize: 36,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
