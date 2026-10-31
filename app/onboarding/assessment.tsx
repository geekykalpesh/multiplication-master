import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/hooks/useTheme';
import { AccessibleText } from '../../src/components/common/AccessibleText';
import { AccessibleButton } from '../../src/components/common/AccessibleButton';
import { Card } from '../../src/components/common/Card';
import { ProgressBar } from '../../src/components/common/ProgressBar';

interface AssessmentQuestion {
  prompt: { en: string; hi: string };
  expected: number;
  options: number[];
  levelDetected: 1 | 2 | 3 | 4 | 5;
  explanation: { en: string; hi: string };
}

const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  {
    prompt: { en: 'What is 2 × 3? (2 groups of 3)', hi: '2 × 3 कितना होता है? (3 के 2 समूह)' },
    expected: 6,
    options: [5, 6, 8, 9],
    levelDetected: 1,
    explanation: { en: '2 × 3 = 6. Great start!', hi: '2 × 3 = 6. बहुत अच्छी शुरुआत!' },
  },
  {
    prompt: { en: 'What is 5 × 4?', hi: '5 × 4 कितना होता है?' },
    expected: 20,
    options: [15, 20, 24, 25],
    levelDetected: 2,
    explanation: { en: '5 × 4 = 20. Skip counting by 5: 5, 10, 15, 20!', hi: '5 × 4 = 20. 5 का पहाड़ा: 5, 10, 15, 20!' },
  },
  {
    prompt: { en: 'What is 7 × 8?', hi: '7 × 8 कितना होता है?' },
    expected: 56,
    options: [54, 56, 58, 64],
    levelDetected: 3,
    explanation: { en: '7 × 8 = 56. One of the most famous multiplication landmarks!', hi: '7 × 8 = 56. सात अठे छप्पन!' },
  },
  {
    prompt: { en: 'What is 14 × 6?', hi: '14 × 6 कितना होता है?' },
    expected: 84,
    options: [74, 82, 84, 94],
    levelDetected: 4,
    explanation: { en: '14 × 6 = (10 × 6) + (4 × 6) = 60 + 24 = 84.', hi: '14 × 6 = 60 + 24 = 84.' },
  },
];

export default function OnboardingAssessmentScreen() {
  const router = useRouter();
  const { theme, language } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hasEvaluated, setHasEvaluated] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  const currentQ = ASSESSMENT_QUESTIONS[currentIndex];
  const isFinished = currentIndex >= ASSESSMENT_QUESTIONS.length;

  const handleChoose = (ans: number) => {
    if (hasEvaluated) return;
    setSelectedAnswer(ans);
    setHasEvaluated(true);
    if (ans === currentQ.expected) {
      setCorrectCount((c) => c + 1);
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setHasEvaluated(false);
    if (currentIndex + 1 < ASSESSMENT_QUESTIONS.length) {
      setCurrentIndex((i) => i + 1);
    } else {
      // Completed assessment -> move to offline speech setup
      router.push('/onboarding/speech-setup');
    }
  };

  const progress = (currentIndex + 1) / ASSESSMENT_QUESTIONS.length;

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={styles.content}>
      <AccessibleText variant="caption" color={theme.textSecondary} style={{ marginBottom: 4 }}>
        {language === 'hi'
          ? `प्रश्न ${currentIndex + 1} / ${ASSESSMENT_QUESTIONS.length}`
          : `Question ${currentIndex + 1} of ${ASSESSMENT_QUESTIONS.length}`}
      </AccessibleText>
      <ProgressBar progress={progress} style={{ marginBottom: 24 }} />

      <Card style={styles.questionCard}>
        <AccessibleText variant="heading" weight="bold" isHeading style={styles.prompt}>
          {language === 'hi' ? currentQ.prompt.hi : currentQ.prompt.en}
        </AccessibleText>
      </Card>

      <View style={styles.optionsGrid}>
        {currentQ.options.map((opt) => {
          const isSelected = selectedAnswer === opt;
          const isCorrect = opt === currentQ.expected;
          let btnVariant: 'outline' | 'primary' | 'danger' = 'outline';

          if (hasEvaluated) {
            if (isCorrect) btnVariant = 'primary';
            else if (isSelected) btnVariant = 'danger';
          }

          return (
            <AccessibleButton
              key={`opt_${opt}`}
              title={`${opt}`}
              variant={btnVariant}
              size="lg"
              disabled={hasEvaluated}
              onPress={() => handleChoose(opt)}
              style={styles.optionButton}
            />
          );
        })}
      </View>

      {hasEvaluated && (
        <View style={styles.feedbackContainer}>
          <Card
            style={{
              backgroundColor:
                selectedAnswer === currentQ.expected
                  ? theme.successLight
                  : theme.surfaceSubtle,
            }}
          >
            <AccessibleText
              variant="subheading"
              weight="bold"
              color={
                selectedAnswer === currentQ.expected
                  ? theme.success
                  : theme.text
              }
            >
              {selectedAnswer === currentQ.expected
                ? language === 'hi'
                  ? '✓ सही उत्तर!'
                  : '✓ Correct!'
                : language === 'hi'
                ? 'स्पष्टीकरण:'
                : 'Helpful explanation:'}
            </AccessibleText>
            <AccessibleText variant="body" color={theme.textSecondary} style={{ marginTop: 4 }}>
              {language === 'hi' ? currentQ.explanation.hi : currentQ.explanation.en}
            </AccessibleText>
          </Card>

          <AccessibleButton
            title={
              currentIndex + 1 < ASSESSMENT_QUESTIONS.length
                ? language === 'hi'
                  ? 'अगला प्रश्न'
                  : 'Next Question'
                : language === 'hi'
                ? 'मूल्यांकन पूरा करें'
                : 'Complete Assessment'
            }
            size="lg"
            onPress={handleNext}
            style={{ marginTop: 20 }}
          />
        </View>
      )}

      {!hasEvaluated && (
        <AccessibleButton
          title={language === 'hi' ? 'मुझे नहीं पता (आगे बढ़ें)' : "I'm not sure (Skip)"}
          variant="ghost"
          onPress={() => {
            setSelectedAnswer(null);
            setHasEvaluated(true);
          }}
          style={{ marginTop: 16 }}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
  },
  questionCard: {
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
  },
  prompt: {
    textAlign: 'center',
  },
  optionsGrid: {
    gap: 12,
  },
  optionButton: {
    width: '100%',
  },
  feedbackContainer: {
    marginTop: 20,
  },
});
