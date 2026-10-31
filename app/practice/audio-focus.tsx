import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/hooks/useTheme';
import { useUserStore } from '../../src/stores/userStore';
import { ttsService } from '../../src/services/speech/ttsService';
import { generateQuestion } from '../../src/engines/question-engine/generator';
import { GeneratedQuestion } from '../../src/types/database';
import { AccessibleText } from '../../src/components/common/AccessibleText';
import { AccessibleButton } from '../../src/components/common/AccessibleButton';
import { Card } from '../../src/components/common/Card';

export default function AudioFocusScreen() {
  const router = useRouter();
  const { theme, language } = useTheme();
  const preferences = useUserStore((s) => s.preferences);
  const updatePreferences = useUserStore((s) => s.updatePreferences);

  const [currentQuestion, setCurrentQuestion] = useState<GeneratedQuestion | null>(null);
  const [speechRate, setSpeechRate] = useState<number>(preferences.speechRate || 1.0);
  const [answerRevealed, setAnswerRevealed] = useState(false);

  useEffect(() => {
    loadNextAudioQuestion();
  }, []);

  const loadNextAudioQuestion = () => {
    setAnswerRevealed(false);
    const q = generateQuestion({
      tables: [2, 3, 4, 5, 6, 7, 8, 9, 10],
      allowedTypes: ['direct', 'reverse', 'missing_second'],
    });
    setCurrentQuestion(q);
    speakQuestionPrompt(q);
  };

  const speakQuestionPrompt = async (q: GeneratedQuestion) => {
    await ttsService.unlockAudio();
    const speechText = language === 'hi' ? q.promptSpeech.hi : q.promptSpeech.en;
    await ttsService.speak(speechText, {
      language,
      rate: speechRate,
    });
  };

  const repeatPrompt = async () => {
    if (currentQuestion) {
      await speakQuestionPrompt(currentQuestion);
    }
  };

  const speakHint = async () => {
    if (!currentQuestion) return;
    const hint = language === 'hi' ? currentQuestion.hintText.hi : currentQuestion.hintText.en;
    await ttsService.speak(hint, {
      language,
      rate: speechRate,
    });
  };

  const revealAndSpeakAnswer = async () => {
    if (!currentQuestion) return;
    setAnswerRevealed(true);
    const explanation =
      language === 'hi'
        ? currentQuestion.explanationText.hi
        : currentQuestion.explanationText.en;

    await ttsService.speak(explanation, {
      language,
      rate: speechRate,
    });
  };

  const adjustSpeechRate = async (delta: number) => {
    const newRate = Math.max(0.5, Math.min(1.5, Math.round((speechRate + delta) * 10) / 10));
    setSpeechRate(newRate);
    await updatePreferences({ speechRate: newRate });
    const announcement = language === 'hi' ? `आवाज की गति ${newRate}x` : `Speech rate set to ${newRate}x`;
    await ttsService.speak(announcement, { language, rate: newRate });
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={styles.content}>
      {/* Title */}
      <AccessibleText variant="heading" weight="bold" isHeading style={styles.title}>
        {language === 'hi' ? 'ऑडियो केंद्रित अभ्यास' : 'Audio Focus Companion'}
      </AccessibleText>
      <AccessibleText variant="body" color={theme.textSecondary} style={styles.subtitle}>
        {language === 'hi'
          ? 'पूरी तरह टॉकबैक व ध्वनि अनुकूलित। स्क्रीन देखे बिना भी आसानी से सीखें।'
          : 'High-contrast, screen-reader optimized, and designed for pure auditory recall.'}
      </AccessibleText>

      {/* Prominent Question Display Card */}
      {currentQuestion && (
        <Card style={styles.questionCard}>
          <AccessibleText variant="huge" weight="black" style={styles.prompt}>
            {currentQuestion.promptText[language]}
          </AccessibleText>
        </Card>
      )}

      {/* Primary Audio Interaction Large Touch Targets */}
      <View style={styles.audioControlsGrid}>
        {/* Repeat Question */}
        <AccessibleButton
          title={language === 'hi' ? '🔁 प्रश्न दोबारा सुनें' : '🔁 Repeat Question'}
          size="lg"
          variant="primary"
          onPress={repeatPrompt}
          accessibilityLabel="Repeat Question. Tap to hear the question read aloud again."
          style={styles.largeBtn}
        />

        {/* Request Hint */}
        <AccessibleButton
          title={language === 'hi' ? '💡 संकेत सुनें (Hint)' : '💡 Hear a Hint'}
          size="lg"
          variant="secondary"
          onPress={speakHint}
          accessibilityLabel="Hear a Hint. Verbal clue to help calculate the product."
          style={styles.largeBtn}
        />

        {/* Reveal Answer */}
        <AccessibleButton
          title={
            answerRevealed
              ? `${language === 'hi' ? 'उत्तर' : 'Answer'}: ${currentQuestion?.correctAnswer}`
              : language === 'hi'
              ? '👁️ उत्तर और व्याख्या सुनें'
              : '👁️ Hear Answer & Explanation'
          }
          size="lg"
          variant={answerRevealed ? 'outline' : 'outline'}
          onPress={revealAndSpeakAnswer}
          accessibilityLabel="Reveal Answer. Speaks the answer and full step-by-step mathematical explanation."
          style={styles.largeBtn}
        />

        {/* Next Question */}
        <AccessibleButton
          title={language === 'hi' ? 'अगला प्रश्न ➔' : 'Next Question ➔'}
          size="lg"
          variant="primary"
          onPress={loadNextAudioQuestion}
          accessibilityLabel="Next Question. Move forward to the next multiplication problem."
          style={styles.largeBtn}
        />
      </View>

      {/* Speech Speed Adjustment Bar */}
      <Card style={styles.speedCard}>
        <AccessibleText variant="caption" weight="bold" color={theme.textSecondary}>
          {language === 'hi' ? `आवाज की गति: ${speechRate}x` : `TUTOR SPEECH RATE: ${speechRate}x`}
        </AccessibleText>
        <View style={styles.speedBtnsRow}>
          <AccessibleButton
            title="🐢 Slower (0.8x)"
            size="sm"
            variant="outline"
            onPress={() => adjustSpeechRate(-0.1)}
            accessibilityLabel="Slow down speech rate"
          />
          <AccessibleButton
            title="⚡ Faster (1.2x)"
            size="sm"
            variant="outline"
            onPress={() => adjustSpeechRate(0.1)}
            accessibilityLabel="Speed up speech rate"
          />
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
  questionCard: {
    padding: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  prompt: {
    textAlign: 'center',
  },
  audioControlsGrid: {
    gap: 14,
    marginBottom: 24,
  },
  largeBtn: {
    width: '100%',
    minHeight: 56, // Extra spacious accessible button
  },
  speedCard: {
    padding: 16,
    alignItems: 'center',
  },
  speedBtnsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
});
