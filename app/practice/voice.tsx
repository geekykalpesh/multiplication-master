import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/hooks/useTheme';
import { useUserStore } from '../../src/stores/userStore';
import { useVoiceStore } from '../../src/stores/voiceStore';
import { VoiceSessionController } from '../../src/engines/voice-session/controller';
import { generateQuestion } from '../../src/engines/question-engine/generator';
import { GeneratedQuestion } from '../../src/types/database';
import { ValidationResult } from '../../src/engines/answer-validation/validator';
import { VoiceState } from '../../src/types/speech';
import { parseSpokenNumber } from '../../src/engines/number-parser';
import { ttsService } from '../../src/services/speech/ttsService';
import { speechRecognizerService } from '../../src/services/speech/speechRecognizer';
import { AccessibleText } from '../../src/components/common/AccessibleText';
import { AccessibleButton } from '../../src/components/common/AccessibleButton';
import { Card } from '../../src/components/common/Card';
import { MicrophoneIndicator } from '../../src/components/audio/MicrophoneIndicator';
import { Mascot } from '../../src/components/common/Mascot';

export default function HandsFreeVoicePracticeScreen() {
  const router = useRouter();
  const { theme, language } = useTheme();
  const profile = useUserStore((s) => s.profile);
  const preferences = useUserStore((s) => s.preferences);

  const voiceState = useVoiceStore((s) => s.voiceState);
  const setVoiceState = useVoiceStore((s) => s.setVoiceState);

  const [sessionActive, setSessionActive] = useState<boolean>(false);
  const [currentQuestion, setCurrentQuestion] = useState<GeneratedQuestion | null>(null);
  const [liveTranscript, setLiveTranscript] = useState<string>('');
  const [lastValidation, setLastValidation] = useState<ValidationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [simulatedVoiceInput, setSimulatedVoiceInput] = useState<string>('');

  const controllerRef = useRef<VoiceSessionController | null>(null);

  const startVoiceSession = async () => {
    setErrorMessage(null);
    await ttsService.unlockAudio();
    ttsService.playTone(520, 100);

    const sessionId = `voice_sess_${Date.now()}`;
    const controller = new VoiceSessionController({
      sessionId,
      language: preferences.language,
      audience: profile?.targetAudience || 'child',
      speechRate: preferences.speechRate || 1.0,
      speechPitch: preferences.speechPitch || 1.0,
      onStateChanged: (state: VoiceState) => {
        setVoiceState(state);
      },
      onQuestionReady: (q: GeneratedQuestion) => {
        setCurrentQuestion(q);
        setLiveTranscript('');
      },
      onPartialTranscript: (transcript: string) => {
        setLiveTranscript(transcript);
      },
      onAnswerEvaluated: (res: ValidationResult) => {
        setLastValidation(res);
      },
      onRequestNextQuestion: () => {
        return generateQuestion({
          tables: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
          allowedTypes: ['direct', 'reverse', 'missing_second'],
        });
      },
      onError: (err: string) => {
        setErrorMessage(err);
      },
    });

    controllerRef.current = controller;
    setSessionActive(true);
    await controller.startSession();
  };

  useEffect(() => {
    return () => {
      if (controllerRef.current) {
        controllerRef.current.stopSession();
      }
    };
  }, []);

  const handleManualMicPress = async () => {
    await ttsService.unlockAudio();
    if (!sessionActive) {
      startVoiceSession();
      return;
    }
    if (controllerRef.current) {
      controllerRef.current.startListeningForAnswer();
    }
  };

  const handleRepeatQuestion = async () => {
    if (controllerRef.current) {
      await controllerRef.current.repeatCurrentQuestion();
    }
  };

  const handleManualSpokenAnswerSubmit = () => {
    if (!simulatedVoiceInput.trim() || !controllerRef.current) return;
    const parsed = parseSpokenNumber(simulatedVoiceInput, language);
    setLiveTranscript(simulatedVoiceInput);
    controllerRef.current.handleUserResponse(parsed.number);
    setSimulatedVoiceInput('');
  };

  const handleStopSession = async () => {
    if (controllerRef.current) {
      await controllerRef.current.stopSession();
    }
    setSessionActive(false);
    router.back();
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={styles.content}>
      {/* Top Header */}
      <View style={styles.topBar}>
        <AccessibleText variant="subheading" weight="bold">
          {language === 'hi' ? 'हैंड्स-फ्री वॉयस अभ्यास' : 'Hands-Free Voice Session'}
        </AccessibleText>
        <AccessibleButton
          title={language === 'hi' ? 'समाप्त करें' : 'Exit'}
          size="sm"
          variant="outline"
          onPress={handleStopSession}
        />
      </View>

      {/* Start Button if session not yet active */}
      {!sessionActive && (
        <Card style={styles.startCard}>
          <Mascot mood="happy" size={90} style={{ marginBottom: 16 }} />
          <AccessibleText variant="heading" weight="bold" style={{ textAlign: 'center', marginBottom: 8 }}>
            {language === 'hi' ? 'आवाज से अभ्यास शुरू करें' : 'Ready to Practice with Voice?'}
          </AccessibleText>
          <AccessibleText variant="body" color={theme.textSecondary} style={{ textAlign: 'center', marginBottom: 20 }}>
            {language === 'hi'
              ? 'प्रारंभ बटन दबाएं। ऐप प्रश्न बोलेगा, और आपको सीधे बोलकर उत्तर देना है।'
              : 'Tap start below. The tutor will speak multiplication questions, and your microphone will capture your answer automatically.'}
          </AccessibleText>
          <AccessibleButton
            title={language === 'hi' ? '🎙️ अभ्यास शुरू करें' : '🎙️ Start Voice Practice'}
            size="lg"
            variant="primary"
            onPress={startVoiceSession}
            style={{ width: '100%' }}
          />
        </Card>
      )}

      {/* Active Session Content */}
      {sessionActive && (
        <>
          {/* Prominent Microphone Visualizer */}
          <TouchableOpacity onPress={handleManualMicPress} activeOpacity={0.8}>
            <MicrophoneIndicator state={voiceState} size={96} />
          </TouchableOpacity>

          {/* Error Message if Mic permission was blocked */}
          {errorMessage && (
            <Card style={[styles.errorCard, { backgroundColor: theme.errorLight, borderColor: theme.error }]}>
              <Ionicons name="warning" size={24} color={theme.error} />
              <AccessibleText variant="caption" color={theme.error} style={{ flex: 1, marginLeft: 8 }}>
                {errorMessage}
              </AccessibleText>
            </Card>
          )}

          {/* Current Question Display Card */}
          {currentQuestion && (
            <Card style={styles.questionCard}>
              <View style={styles.questionCardHeader}>
                <AccessibleText variant="caption" color={theme.textSecondary}>
                  {language === 'hi' ? 'वर्तमान प्रश्न:' : 'CURRENT QUESTION:'}
                </AccessibleText>
                <AccessibleButton
                  title={language === 'hi' ? '🔊 दोबारा सुनें' : '🔊 Hear Again'}
                  size="sm"
                  variant="ghost"
                  onPress={handleRepeatQuestion}
                />
              </View>
              <AccessibleText variant="display" weight="black" style={styles.questionPrompt}>
                {currentQuestion.promptText[language]}
              </AccessibleText>
            </Card>
          )}

          {/* Live Speech Recognition Transcript */}
          <Card style={[styles.transcriptCard, { backgroundColor: theme.surfaceSubtle }]}>
            <AccessibleText variant="caption" color={theme.textSecondary} weight="bold">
              {voiceState === 'listening'
                ? language === 'hi'
                  ? '🎤 सुन रहा हूँ... बोलिए!'
                  : '🎤 Listening... Speak now!'
                : language === 'hi'
                ? 'बोली गई आवाज:'
                : 'Spoken transcript:'}
            </AccessibleText>
            <AccessibleText
              variant="subheading"
              weight="bold"
              color={liveTranscript ? theme.primary : theme.textMuted}
              style={{ marginTop: 4, textAlign: 'center' }}
            >
              {liveTranscript ? `"${liveTranscript}"` : language === 'hi' ? '(संख्या बोलें...)' : '(say a number...)'}
            </AccessibleText>
          </Card>

          {/* Validation Feedback Card */}
          {lastValidation && (
            <Card
              style={[
                styles.feedbackCard,
                {
                  backgroundColor:
                    lastValidation.status === 'correct'
                      ? theme.successLight
                      : lastValidation.status === 'unclear'
                      ? theme.warningLight
                      : theme.surfaceSubtle,
                },
              ]}
            >
              <AccessibleText
                variant="body"
                weight="bold"
                color={
                  lastValidation.status === 'correct'
                    ? theme.success
                    : lastValidation.status === 'unclear'
                    ? theme.warning
                    : theme.error
                }
              >
                {lastValidation.feedbackText}
              </AccessibleText>
            </Card>
          )}

          {/* Spoken Word Simulation Tester */}
          <Card style={styles.simulatorCard}>
            <AccessibleText variant="caption" color={theme.textSecondary} weight="bold">
              {language === 'hi'
                ? 'वॉयस परीक्षक (कीबोर्ड से भी टेस्ट कर सकते हैं):'
                : 'VOICE TESTER (OR TYPE NUMBER WORDS):'}
            </AccessibleText>
            <AccessibleText variant="caption" color={theme.textMuted} style={{ marginBottom: 8 }}>
              {language === 'hi'
                ? 'उदा: "एक सौ छत्तीस", "चौरासी", "136", "84"'
                : 'e.g., "one hundred thirty-six", "eighty-four", "136"'}
            </AccessibleText>

            <View style={styles.inputRow}>
              <TextInput
                value={simulatedVoiceInput}
                onChangeText={setSimulatedVoiceInput}
                placeholder={language === 'hi' ? 'बोले गए शब्द यहाँ लिखें...' : 'Type spoken answer...'}
                placeholderTextColor={theme.textMuted}
                style={[
                  styles.textInput,
                  {
                    color: theme.text,
                    borderColor: theme.border,
                    backgroundColor: theme.surface,
                  },
                ]}
              />
              <AccessibleButton
                title={language === 'hi' ? 'भेजें' : 'Send'}
                size="md"
                onPress={handleManualSpokenAnswerSubmit}
                style={{ marginLeft: 8 }}
              />
            </View>
          </Card>
        </>
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
    alignItems: 'center',
  },
  topBar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  startCard: {
    width: '100%',
    padding: 24,
    alignItems: 'center',
    marginTop: 20,
  },
  errorCard: {
    width: '100%',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  questionCard: {
    width: '100%',
    padding: 20,
    alignItems: 'center',
    marginBottom: 14,
  },
  questionCardHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  questionPrompt: {
    textAlign: 'center',
    marginVertical: 12,
  },
  transcriptCard: {
    width: '100%',
    padding: 14,
    marginBottom: 14,
    alignItems: 'center',
  },
  feedbackCard: {
    width: '100%',
    padding: 14,
    marginBottom: 14,
    alignItems: 'center',
  },
  simulatorCard: {
    width: '100%',
    padding: 16,
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 16,
  },
});
