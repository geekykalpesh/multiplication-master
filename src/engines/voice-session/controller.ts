import { VoiceState, RecognitionResultStatus } from '../../types/speech';
import { GeneratedQuestion, Language, TargetAudience, QuestionAttempt } from '../../types/database';
import { ttsService } from '../../services/speech/ttsService';
import { speechRecognizerService } from '../../services/speech/speechRecognizer';
import { validateAnswer, ValidationResult } from '../answer-validation/validator';
import { recordQuestionAttempt } from '../../services/database/repositories/sessionsRepo';
import { getMasteryRecord, saveMasteryRecord, getSpacedRepetitionItem, saveSpacedRepetitionItem } from '../../services/database/repositories/factsRepo';
import { updateMasteryRecord, createInitialMasteryRecord } from '../learning-engine/masteryCalculator';
import { calculateNextReview, createInitialSpacedRepetitionItem } from '../spaced-repetition/sm2';

export interface VoiceSessionControllerOptions {
  sessionId: string;
  language: Language;
  audience: TargetAudience;
  speechRate: number;
  speechPitch: number;
  onStateChanged: (state: VoiceState) => void;
  onQuestionReady: (question: GeneratedQuestion) => void;
  onPartialTranscript?: (transcript: string) => void;
  onAnswerEvaluated: (result: ValidationResult) => void;
  onRequestNextQuestion: () => GeneratedQuestion | null;
  onError?: (error: string) => void;
  onSessionEnded?: () => void;
}

export class VoiceSessionController {
  private options: VoiceSessionControllerOptions;
  private currentState: VoiceState = 'idle';
  private currentQuestion: GeneratedQuestion | null = null;
  private questionPromptStartTime: number = 0;
  private isSessionActive: boolean = false;
  private retryAttemptsForUnclear: number = 0;

  constructor(options: VoiceSessionControllerOptions) {
    this.options = options;
  }

  public getState(): VoiceState {
    return this.currentState;
  }

  private setState(state: VoiceState) {
    this.currentState = state;
    this.options.onStateChanged(state);
  }

  public async startSession() {
    this.isSessionActive = true;
    await ttsService.unlockAudio();
    await this.nextQuestionFlow();
  }

  public async stopSession() {
    this.isSessionActive = false;
    this.setState('idle');
    await ttsService.stop();
    speechRecognizerService.stopListening();
    this.options.onSessionEnded?.();
  }

  public async repeatCurrentQuestion() {
    if (!this.currentQuestion) return;
    await this.speakPromptAndListen();
  }

  private async nextQuestionFlow() {
    if (!this.isSessionActive) return;

    this.currentQuestion = this.options.onRequestNextQuestion();
    if (!this.currentQuestion) {
      await this.stopSession();
      return;
    }

    this.options.onQuestionReady(this.currentQuestion);
    this.retryAttemptsForUnclear = 0;
    await this.speakPromptAndListen();
  }

  private async speakPromptAndListen() {
    if (!this.isSessionActive || !this.currentQuestion) return;

    this.setState('speaking_prompt');
    const speechText =
      this.options.language === 'hi'
        ? this.currentQuestion.promptSpeech.hi
        : this.currentQuestion.promptSpeech.en;

    // Guaranteed order: Speak prompt completely FIRST, then activate mic
    await ttsService.speak(speechText, {
      language: this.options.language,
      rate: this.options.speechRate,
      pitch: this.options.speechPitch,
    });

    if (!this.isSessionActive) return;

    // TTS is completely stopped before opening microphone
    this.startListeningForAnswer();
  }

  public startListeningForAnswer() {
    if (!this.isSessionActive || !this.currentQuestion) return;

    this.setState('listening');
    this.questionPromptStartTime = Date.now();

    speechRecognizerService.startListening(
      this.options.language,
      {
        onPartialResult: (transcript) => {
          this.options.onPartialTranscript?.(transcript);
        },
        onFinalResult: async (parseResult) => {
          if (parseResult.rawInput) {
            this.options.onPartialTranscript?.(parseResult.rawInput);
          }
          await this.handleUserResponse(parseResult.number);
        },
        onError: async (error) => {
          console.warn('Voice recognizer callback error:', error);
          this.options.onError?.(error);
          await this.handleUserResponse(null);
        },
      },
      8000 // 8 second listening window
    );
  }

  public async handleUserResponse(userAnswer: number | null) {
    if (!this.isSessionActive || !this.currentQuestion) return;

    const latencyMs = Math.max(500, Date.now() - this.questionPromptStartTime);
    this.setState('evaluating_answer');

    const validation = validateAnswer({
      userAnswer,
      expectedAnswer: this.currentQuestion.correctAnswer,
      latencyMs,
      audience: this.options.audience,
      language: this.options.language,
    });

    this.options.onAnswerEvaluated(validation);

    if (validation.status === 'unclear') {
      // Handle unclear speech: retry without penalty up to 2 times
      this.retryAttemptsForUnclear++;
      if (this.retryAttemptsForUnclear <= 2) {
        this.setState('speaking_feedback');
        await ttsService.speak(validation.feedbackSpeech, {
          language: this.options.language,
          rate: this.options.speechRate,
          pitch: this.options.speechPitch,
        });

        if (!this.isSessionActive) return;
        this.startListeningForAnswer();
        return;
      }
    }

    // Persist attempt locally to SQLite
    const attempt: QuestionAttempt = {
      id: `attempt_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      sessionId: this.options.sessionId,
      factId: this.currentQuestion.factId,
      questionType: this.currentQuestion.type,
      prompt: this.currentQuestion.promptText[this.options.language],
      userAnswer,
      expectedAnswer: this.currentQuestion.correctAnswer,
      isCorrect: validation.isCorrect,
      latencyMs,
      hintUsed: false,
      inputMode: 'voice',
      timestamp: Date.now(),
    };

    await recordQuestionAttempt(attempt);

    // Update mastery only if answer was clear
    if (validation.status !== 'unclear') {
      let mastery = await getMasteryRecord(this.currentQuestion.factId);
      if (!mastery) mastery = createInitialMasteryRecord(this.currentQuestion.factId);
      const updatedMastery = updateMasteryRecord(mastery, {
        isCorrect: validation.isCorrect,
        latencyMs,
        hintUsed: false,
      });
      await saveMasteryRecord(updatedMastery);

      // Update Spaced Repetition schedule
      let srItem = await getSpacedRepetitionItem(this.currentQuestion.factId);
      if (!srItem) srItem = createInitialSpacedRepetitionItem(this.currentQuestion.factId);

      const quality = validation.isCorrect
        ? latencyMs < 2500
          ? 5
          : latencyMs < 4500
          ? 4
          : 3
        : 1;

      const updatedSr = calculateNextReview(srItem, { quality });
      await saveSpacedRepetitionItem(updatedSr);
    }

    // Speak answer feedback
    this.setState('speaking_feedback');
    await ttsService.speak(validation.feedbackSpeech, {
      language: this.options.language,
      rate: this.options.speechRate,
      pitch: this.options.speechPitch,
    });

    if (!this.isSessionActive) return;

    // Pause briefly then move to next question automatically (Hands-Free!)
    setTimeout(async () => {
      await this.nextQuestionFlow();
    }, 1200);
  }
}
