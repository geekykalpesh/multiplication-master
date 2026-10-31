import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/hooks/useTheme';
import { CURRICULUM_LEVELS } from '../../src/constants/curriculum';
import { AccessibleText } from '../../src/components/common/AccessibleText';
import { Card } from '../../src/components/common/Card';
import { Badge } from '../../src/components/common/Badge';

export default function JourneyScreen() {
  const router = useRouter();
  const { theme, language } = useTheme();
  const [expandedLevel, setExpandedLevel] = useState<number | null>(1);

  const toggleLevel = (lvlNum: number) => {
    setExpandedLevel(expandedLevel === lvlNum ? null : lvlNum);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={styles.content}>
      <AccessibleText variant="heading" weight="bold" isHeading style={styles.headerTitle}>
        {language === 'hi' ? 'गणित शिक्षण यात्रा' : 'Learning Curriculum'}
      </AccessibleText>
      <AccessibleText variant="caption" color={theme.textSecondary} style={styles.headerSubtitle}>
        {language === 'hi'
          ? 'शून्य से लेकर त्वरित मानसिक गणना तक का सुव्यवस्थित पाठ्यक्रम।'
          : 'A progressive curriculum from foundations to automatic numerical recall.'}
      </AccessibleText>

      <View style={styles.levelsList}>
        {CURRICULUM_LEVELS.map((lvl) => {
          const isExpanded = expandedLevel === lvl.levelNumber;

          return (
            <Card key={`lvl_${lvl.levelNumber}`} style={styles.levelCard}>
              <TouchableOpacity
                onPress={() => toggleLevel(lvl.levelNumber)}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={`${lvl.title[language]}, ${lvl.lessons.length} lessons. Tap to ${isExpanded ? 'collapse' : 'expand'}.`}
                style={styles.levelHeader}
              >
                <AccessibleText variant="display" style={{ marginRight: 12 }}>
                  {lvl.icon}
                </AccessibleText>
                <View style={{ flex: 1 }}>
                  <AccessibleText variant="subheading" weight="bold">
                    {lvl.title[language]}
                  </AccessibleText>
                  <AccessibleText variant="caption" color={theme.textSecondary} style={{ marginTop: 2 }}>
                    {lvl.description[language]}
                  </AccessibleText>
                  <View style={styles.metaRow}>
                    <Badge label={`${lvl.lessons.length} lessons`} variant="info" style={{ marginTop: 6 }} />
                    <AccessibleText variant="caption" color={theme.textMuted} style={{ marginLeft: 8, marginTop: 6 }}>
                      ~{lvl.estimatedMinutes} min
                    </AccessibleText>
                  </View>
                </View>
                <Ionicons
                  name={isExpanded ? 'chevron-up' : 'chevron-down'}
                  size={22}
                  color={theme.textSecondary}
                />
              </TouchableOpacity>

              {isExpanded && (
                <View style={styles.lessonsContainer}>
                  {lvl.lessons.map((lesson) => (
                    <TouchableOpacity
                      key={lesson.id}
                      onPress={() => {
                        if (lesson.targetTable) {
                          router.push(`/tables/${lesson.targetTable}`);
                        } else {
                          router.push(`/lessons/${lesson.id}`);
                        }
                      }}
                      accessible={true}
                      accessibilityRole="button"
                      accessibilityLabel={`${lesson.title[language]}: ${lesson.subtitle[language]}`}
                      style={[
                        styles.lessonItem,
                        {
                          backgroundColor: theme.surfaceSubtle,
                          borderColor: theme.border,
                        },
                      ]}
                    >
                      <View style={styles.lessonNumberCircle}>
                        <AccessibleText variant="caption" weight="bold" color={theme.primary}>
                          {lesson.lessonIndex}
                        </AccessibleText>
                      </View>
                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <AccessibleText variant="body" weight="semibold">
                          {lesson.title[language]}
                        </AccessibleText>
                        <AccessibleText variant="caption" color={theme.textSecondary}>
                          {lesson.subtitle[language]}
                        </AccessibleText>
                      </View>
                      <Ionicons name="play-circle" size={26} color={theme.primary} />
                    </TouchableOpacity>
                  ))}
                </View>
              )}
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
  headerTitle: {
    marginBottom: 4,
  },
  headerSubtitle: {
    marginBottom: 20,
  },
  levelsList: {
    gap: 16,
  },
  levelCard: {
    padding: 16,
  },
  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lessonsContainer: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    gap: 8,
  },
  lessonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  lessonNumberCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
