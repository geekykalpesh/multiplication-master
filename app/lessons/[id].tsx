import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/hooks/useTheme';
import { CURRICULUM_LEVELS } from '../../src/constants/curriculum';
import { CurriculumLesson } from '../../src/types/curriculum';
import { ttsService } from '../../src/services/speech/ttsService';
import { AccessibleText } from '../../src/components/common/AccessibleText';
import { AccessibleButton } from '../../src/components/common/AccessibleButton';
import { Card } from '../../src/components/common/Card';
import { GroupingVisualizer } from '../../src/components/visual-math/GroupingVisualizer';
import { ArrayVisualizer } from '../../src/components/visual-math/ArrayVisualizer';
import { Mascot } from '../../src/components/common/Mascot';

export default function LessonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { theme, language } = useTheme();

  // Find lesson across all levels
  let foundLesson: CurriculumLesson | undefined;
  for (const lvl of CURRICULUM_LEVELS) {
    const l = lvl.lessons.find((item) => item.id === id);
    if (l) {
      foundLesson = l;
      break;
    }
  }

  const [isNarrating, setIsNarrating] = useState(false);

  if (!foundLesson) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <AccessibleText variant="subheading">Lesson not found.</AccessibleText>
        <AccessibleButton
          title="Return to Journey"
          onPress={() => router.back()}
          style={{ marginTop: 16 }}
        />
      </View>
    );
  }

  const lesson = foundLesson;
  const content = lesson.content;

  const handlePlayAudio = async () => {
    if (isNarrating) {
      await ttsService.stop();
      setIsNarrating(false);
      return;
    }

    setIsNarrating(true);
    await ttsService.unlockAudio();
    const script = content.audioScript[language] || content.explanation[language];
    await ttsService.speak(script, {
      language,
      onDone: () => setIsNarrating(false),
      onStopped: () => setIsNarrating(false),
    });
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={styles.content}>
      {/* Lesson Header */}
      <View style={styles.header}>
        <AccessibleText variant="heading" weight="bold" isHeading style={{ flex: 1 }}>
          {lesson.title[language]}
        </AccessibleText>
        <AccessibleButton
          title={isNarrating ? 'Stop' : 'Listen'}
          variant={isNarrating ? 'danger' : 'primary'}
          size="sm"
          icon={<Ionicons name={isNarrating ? 'stop' : 'volume-high'} size={18} color="#FFFFFF" />}
          onPress={handlePlayAudio}
          accessibilityLabel="Read lesson aloud"
        />
      </View>

      <AccessibleText variant="body" color={theme.textSecondary} style={styles.subtitle}>
        {lesson.subtitle[language]}
      </AccessibleText>

      {/* Story / Context Card */}
      {content.storyText && (
        <Card style={styles.card}>
          <AccessibleText variant="caption" color={theme.primary} weight="bold" style={{ marginBottom: 4 }}>
            {language === 'hi' ? 'दैनिक जीवन उदाहरण' : 'REAL-WORLD SITUATION'}
          </AccessibleText>
          <AccessibleText variant="body" style={{ lineHeight: 24 }}>
            {content.storyText[language]}
          </AccessibleText>
        </Card>
      )}

      {/* Visual Components */}
      {content.visualGroups && (
        <GroupingVisualizer
          groups={content.visualGroups.groups}
          itemsPerGroup={content.visualGroups.items}
          itemEmoji={content.visualGroups.emoji}
        />
      )}

      {lesson.id === 'l2_2_arrays_grid' && (
        <ArrayVisualizer rows={3} cols={4} />
      )}

      {/* Mathematical Formulas Card */}
      {(content.repeatedAdditionFormula || content.multiplicationFormula) && (
        <Card style={[styles.card, { backgroundColor: theme.surfaceSubtle }]}>
          {content.repeatedAdditionFormula && (
            <View style={styles.formulaRow}>
              <AccessibleText variant="caption" color={theme.textSecondary}>
                {language === 'hi' ? 'बार-बार जोड़ना:' : 'Repeated Addition:'}
              </AccessibleText>
              <AccessibleText variant="subheading" weight="bold" color={theme.secondary}>
                {content.repeatedAdditionFormula}
              </AccessibleText>
            </View>
          )}

          {content.multiplicationFormula && (
            <View style={[styles.formulaRow, { marginTop: 8 }]}>
              <AccessibleText variant="caption" color={theme.textSecondary}>
                {language === 'hi' ? 'गुणन सम्बन्ध:' : 'Multiplication Formula:'}
              </AccessibleText>
              <AccessibleText variant="heading" weight="black" color={theme.primary}>
                {content.multiplicationFormula}
              </AccessibleText>
            </View>
          )}
        </Card>
      )}

      {/* Concept Explanation Card */}
      <Card style={styles.card}>
        <View style={styles.explanationHeader}>
          <Mascot mood="thinking" size={48} style={{ marginRight: 12 }} />
          <View style={{ flex: 1 }}>
            <AccessibleText variant="subheading" weight="bold">
              {language === 'hi' ? 'अवधारणा की समझ' : 'Core Concept'}
            </AccessibleText>
            <AccessibleText variant="body" color={theme.textSecondary} style={{ marginTop: 4 }}>
              {content.explanation[language]}
            </AccessibleText>
          </View>
        </View>
      </Card>

      {/* Practice Button */}
      <AccessibleButton
        title={language === 'hi' ? 'इस पाठ का अभ्यास करें' : 'Practice Questions on this Topic'}
        size="lg"
        variant="primary"
        onPress={() => router.push('/practice/session')}
        style={{ marginTop: 16 }}
      />
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
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  subtitle: {
    marginBottom: 16,
  },
  card: {
    padding: 16,
    marginBottom: 16,
  },
  formulaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  explanationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
