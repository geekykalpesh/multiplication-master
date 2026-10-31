import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/hooks/useTheme';
import { useUserStore } from '../../src/stores/userStore';
import { useLearningStore } from '../../src/stores/learningStore';
import { generateQuestion } from '../../src/engines/question-engine/generator';
import { validateAnswer, ValidationResult } from '../../src/engines/answer-validation/validator';
import { GeneratedQuestion, LearningSession, QuestionAttempt } from '../../src/types/database';
import { AccessibleText } from '../../src/components/common/AccessibleText';
import { AccessibleButton } from '../../src/components/common/AccessibleButton';
import { Card } from '../../src/components/common/Card';
import { ProgressBar } from '../../src/components/common/ProgressBar';
import { Mascot } from '../../src/components/common/Mascot';
import { recordQuestionAttempt, createLearningSession, updateLearningSession, recordDailyStreakActivity } from '../../src/services/database/repositories/sessionsRepo';
import { getMasteryRecord, saveMasteryRecord, getSpacedRepetitionItem, saveSpacedRepetitionItem } from '../../src/services/database/repositories/factsRepo';
import { updateMasteryRecord, createInitialMasteryRecord } from '../../src/engines/learning-engine/masteryCalculator';
import { calculateNextReview, createInitialSpacedRepetitionItem } from '../../src/engines/spaced-repetition/sm2';
import { checkAndUnlockMilestones } from '../../src/services/database/repositories/achievementsRepo';

const SESSION_TOTAL_QUESTIONS = 10;

export default function InteractiveSessionScreen() {
  const router = useRouter();
  const { theme, language } = useTheme();
  const profile = useUserStore((s) => s.profile);
  const targetAudience = profile?.targetAudience || 'child';

  const [questionIndex, setQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<GeneratedQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [keypadInput, setKeypadInput] = useState<string>('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [evaluation, setEvaluation] = useState<ValidationResult | null>(null);
  const [hintShown, setHintShown] = useState(false);

  // Session aggregate metrics
  const [correctCount, setCorrectCount] = useState(0);
  const [hintsUsedCount, setHintsUsedCount] = useState(0);
  const [totalLatency, setTotalLatency] = useState(0);

  const sessionIdRef = useRef<string>(`sess_${Date.now()}`);
  const questionStartTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    // Initialize session record in SQLite
    const initialSession: LearningSession = {
      id: sessionIdRef.current,
      mode: 'visual',
      startedAt: Date.now(),
      endedAt: null,
      totalQuestions: SESSION_TOTAL_QUESTIONS,
      correctCount: 0,
      averageLatencyMs: 0,
      accuracyRate: 0,
      hintsUsedCount: 0,
    };
    createLearningSession(initialSession);
    loadNextQuestion();
  }, []);

  const loadNextQuestion = () => {
    setSelectedAnswer(null);
    setKeypadInput('');
    setHasSubmitted(false);
    setEvaluation(null);
    setHintShown(false);

    const q = generateQuestion({
      tables: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      allowedTypes: ['direct', 'multiple_choice', 'reverse', 'missing_second', 'repeated_addition'],
    });

    setCurrentQuestion(q);
    questionStartTimeRef.current = Date.now();
  };

  const handleKeypadPress = (val: string) => {
    if (hasSubmitted) return;
    if (val === 'DEL') {
      setKeypadInput((prev) => prev.slice(0, -1));
    } else if (val === 'CLEAR') {
      setKeypadInput('');
    } else {
      if (keypadInput.length < 5) {
        setKeypadInput((prev) => prev + val);
      }
    }
  };

  const submitAnswer = async (ansNumber: number | null) => {
    if (hasSubmitted || !currentQuestion) return;

    const latencyMs = Math.max(300, Date.now() - questionStartTimeRef.current);
    const result = validateAnswer({
      userAnswer: ansNumber,
      expectedAnswer: currentQuestion.correctAnswer,
      latencyMs,
      audience: targetAudience,
      language,
    });

    setSelectedAnswer(ansNumber);
    setEvaluation(result);
    setHasSubmitted(true);
    setTotalLatency((prev) => prev + latencyMs);

    if (result.isCorrect) {
      setCorrectCount((c) => c + 1);
    }
    if (hintShown) {
      setHintsUsedCount((h) => h + 1);
    }

    // Persist Question Attempt into SQLite
    const attempt: QuestionAttempt = {
      id: `att_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      sessionId: sessionIdRef.current,
      factId: currentQuestion.factId,
      questionType: currentQuestion.type,
      prompt: currentQuestion.promptText[language],
      userAnswer: ansNumber,
      expectedAnswer: currentQuestion.correctAnswer,
      isCorrect: result.isCorrect,
      latencyMs,
      hintUsed: hintShown,
      inputMode: 'touch',
      timestamp: Date.now(),
    };
    await recordQuestionAttempt(attempt);

    // Update Mastery Record in SQLite
    let mastery = await getMasteryRecord(currentQuestion.factId);
    if (!mastery) mastery = createInitialMasteryRecord(currentQuestion.factId);
    const updatedMastery = updateMasteryRecord(mastery, {
      isCorrect: result.isCorrect,
      latencyMs,
      hintUsed: hintShown,
    });
    await saveMasteryRecord(updatedMastery);

    // Update Spaced Repetition in SQLite
    let sr = await getSpacedRepetitionItem(currentQuestion.factId);
    if (!sr) sr = createInitialSpacedRepetitionItem(currentQuestion.factId);
    const quality = result.isCorrect ? (latencyMs < 2500 ? 5 : latencyMs < 5000 ? 4 : 3) : 1;
    const updatedSr = calculateNextReview(sr, { quality });
    await saveSpacedRepetitionItem(updatedSr);
  };

  const handleNextStep = async () => {
    if (questionIndex + 1 < SESSION_TOTAL_QUESTIONS) {
      setQuestionIndex((i) => i + 1);
      loadNextQuestion();
    } else {
      // Session finished! Finalize session in SQLite
      const finalAccuracy = Math.round((correctCount / SESSION_TOTAL_QUESTIONS) * 100);
      const avgLatency = Math.round(totalLatency / SESSION_TOTAL_QUESTIONS);

      await updateLearningSession({
        id: sessionIdRef.current,
        mode: 'visual',
        startedAt: questionStartTimeRef.current,
        endedAt: Date.now(),
        totalQuestions: SESSION_TOTAL_QUESTIONS,
        correctCount,
        averageLatencyMs: avgLatency,
        accuracyRate: finalAccuracy,
        hintsUsedCount,
      });

      // Update daily streak
      await recordDailyStreakActivity();

      // Check achievement milestones
      await checkAndUnlockMilestones({
        totalCorrect: correctCount,
        streakDays: 1,
        masteredTablesCount: 1,
        isPerfectSession: correctCount === SESSION_TOTAL_QUESTIONS,
      });

      // Navigate to results screen with summary params
      router.replace({
        pathname: '/practice/results',
        params: {
          total: SESSION_TOTAL_QUESTIONS,
          correct: correctCount,
          accuracy: finalAccuracy,
          latency: avgLatency,
          mode: 'visual',
        },
      });
    }
  };

  if (!currentQuestion) return null;

  const progress = (questionIndex + 1) / SESSION_TOTAL_QUESTIONS;

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={styles.content}>
      {/* Session Progress Header */}
      <View style={styles.topProgressRow}>
        <AccessibleText variant="caption" weight="semibold" color={theme.textSecondary}>
          {language === 'hi'
            ? `प्रश्न ${questionIndex + 1} / ${SESSION_TOTAL_QUESTIONS}`
            : `Question ${questionIndex + 1} of ${SESSION_TOTAL_QUESTIONS}`}
        </AccessibleText>
        <AccessibleText variant="caption" weight="bold" color={theme.primary}>
          {correctCount} {language === 'hi' ? 'सही' : 'Correct'}
        </AccessibleText>
      </View>
      <ProgressBar progress={progress} style={{ marginBottom: 20 }} />

      {/* Question Prompt Card */}
      <Card style={styles.promptCard}>
        <AccessibleText variant="display" weight="black" style={styles.promptText}>
          {currentQuestion.promptText[language]}
        </AccessibleText>
      </Card>

      {/* Multiple Choice Options if available */}
      {currentQuestion.options && currentQuestion.options.length > 0 && (
        <View style={styles.optionsGrid}>
          {currentQuestion.options.map((opt) => {
            let variant: 'outline' | 'primary' | 'danger' = 'outline';
            if (hasSubmitted) {
              if (opt === currentQuestion.correctAnswer) variant = 'primary';
              else if (selectedAnswer === opt) variant = 'danger';
            }

            return (
              <AccessibleButton
                key={`opt_${opt}`}
                title={`${opt}`}
                variant={variant}
                size="lg"
                disabled={hasSubmitted}
                onPress={() => submitAnswer(opt)}
                style={styles.optionBtn}
              />
            );
          })}
        </View>
      )}

      {/* Number Keypad Input (when user types custom answer) */}
      {(!currentQuestion.options || currentQuestion.options.length === 0) && (
        <View style={styles.keypadWrapper}>
          <Card style={styles.inputDisplayCard}>
            <AccessibleText variant="heading" weight="bold" style={{ textAlign: 'center' }}>
              {keypadInput || '—'}
            </AccessibleText>
          </Card>

          <View style={styles.keypadGrid}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'DEL', 0, 'SUBMIT'].map((key) => {
              if (key === 'SUBMIT') {
                return (
                  <AccessibleButton
                    key="btn_submit"
                    title={language === 'hi' ? 'जमा करें' : 'Enter'}
                    disabled={hasSubmitted || !keypadInput}
                    variant="primary"
                    onPress={() => submitAnswer(parseInt(keypadInput, 10))}
                    style={styles.keypadBtn}
                  />
                );
              }
              return (
                <AccessibleButton
                  key={`btn_${key}`}
                  title={`${key}`}
                  disabled={hasSubmitted}
                  variant="outline"
                  onPress={() => handleKeypadPress(`${key}`)}
                  style={styles.keypadBtn}
                />
              );
            })}
          </View>
        </View>
      )}

      {/* Hint Button & Hint Card */}
      {!hasSubmitted && !hintShown && (
        <AccessibleButton
          title={language === 'hi' ? '💡 संकेत चाहिए? (Hint)' : '💡 Need a hint?'}
          variant="ghost"
          onPress={() => setHintShown(true)}
          style={{ marginTop: 12 }}
        />
      )}

      {hintShown && !hasSubmitted && (
        <Card style={[styles.hintCard, { backgroundColor: theme.surfaceSubtle }]}>
          <AccessibleText variant="caption" weight="bold" color={theme.warning}>
            {language === 'hi' ? 'संकेत:' : 'Helpful Hint:'}
          </AccessibleText>
          <AccessibleText variant="body" color={theme.textSecondary} style={{ marginTop: 2 }}>
            {currentQuestion.hintText[language]}
          </AccessibleText>
        </Card>
      )}

      {/* Evaluated Feedback and Next Question Action */}
      {hasSubmitted && evaluation && (
        <View style={styles.feedbackSection}>
          <Card
            style={{
              backgroundColor: evaluation.isCorrect
                ? theme.successLight
                : theme.surfaceSubtle,
            }}
          >
            <View style={styles.feedbackHeader}>
              <AccessibleText
                variant="subheading"
                weight="bold"
                color={evaluation.isCorrect ? theme.success : theme.error}
              >
                {evaluation.isCorrect
                  ? language === 'hi'
                    ? '✓ सही उत्तर!'
                    : '✓ Correct!'
                  : language === 'hi'
                  ? 'समीक्षा:'
                  : 'Review:'}
              </AccessibleText>
            </View>
            <AccessibleText variant="body" style={{ marginTop: 4 }}>
              {evaluation.feedbackText}
            </AccessibleText>
            <AccessibleText variant="caption" color={theme.textSecondary} style={{ marginTop: 6 }}>
              {currentQuestion.explanationText[language]}
            </AccessibleText>
          </Card>

          <AccessibleButton
            title={
              questionIndex + 1 < SESSION_TOTAL_QUESTIONS
                ? language === 'hi'
                  ? 'अगला प्रश्न ➔'
                  : 'Next Question ➔'
                : language === 'hi'
                ? 'सत्र परिणाम देखें'
                : 'View Session Results'
            }
            size="lg"
            variant="primary"
            onPress={handleNextStep}
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
  topProgressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  promptCard: {
    padding: 24,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  promptText: {
    textAlign: 'center',
  },
  optionsGrid: {
    gap: 12,
  },
  optionBtn: {
    width: '100%',
  },
  keypadWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  inputDisplayCard: {
    width: '100%',
    padding: 16,
    marginBottom: 12,
  },
  keypadGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  keypadBtn: {
    width: '30%',
    minHeight: 48,
  },
  hintCard: {
    padding: 14,
    marginTop: 12,
  },
  feedbackSection: {
    marginTop: 20,
  },
  feedbackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
