export type Language = 'en' | 'hi';

export type TargetAudience = 'child' | 'adult' | 'visually_impaired';

export type LearningMode = 'visual' | 'audio_focus' | 'hands_free';

export type ThemePreference = 'light' | 'dark' | 'high_contrast';

export interface UserProfile {
  id: string;
  name: string;
  targetAudience: TargetAudience;
  createdAt: number;
}

export interface UserPreferences {
  language: Language;
  learningMode: LearningMode;
  theme: ThemePreference;
  dailyGoalMinutes: number;
  speechRate: number; // 0.5 to 1.5, default 1.0
  speechPitch: number; // 0.5 to 1.5, default 1.0
  mascotEnabled: boolean;
  soundEffectsEnabled: boolean;
  hapticFeedbackEnabled: boolean;
  fontScale: number; // 1.0 to 1.5
  highContrast: boolean;
  reducedMotion: boolean;
}

export interface MultiplicationFact {
  id: string; // e.g. "7x8"
  factorA: number;
  factorB: number;
  product: number;
  difficultyTier: 1 | 2 | 3 | 4 | 5; // 1: 1-5, 2: 6-10, 3: 11-12, 4: 13-15, 5: 16-20
}

export interface MasteryRecord {
  factId: string;
  consecutiveCorrect: number;
  totalAttempts: number;
  totalCorrect: number;
  averageLatencyMs: number;
  masteryScore: number; // 0.0 - 1.0 (1.0 = mastered with fast automatic recall)
  isMastered: boolean;
  lastPracticedAt: number | null;
}

export interface SpacedRepetitionItem {
  factId: string;
  easeFactor: number; // initial 2.5
  intervalDays: number;
  repetitionCount: number;
  dueDate: number; // Unix timestamp
  lastReviewedAt: number;
}

export interface QuestionAttempt {
  id: string;
  sessionId: string;
  factId: string;
  questionType: QuestionType;
  prompt: string;
  userAnswer: number | null;
  expectedAnswer: number;
  isCorrect: boolean;
  latencyMs: number;
  hintUsed: boolean;
  inputMode: 'touch' | 'voice' | 'keypad';
  timestamp: number;
}

export type QuestionType =
  | 'direct'
  | 'reverse'
  | 'missing_first'
  | 'missing_second'
  | 'multiple_choice'
  | 'true_false'
  | 'repeated_addition'
  | 'visual_grouping'
  | 'skip_counting'
  | 'mental_shortcut'
  | 'word_problem'
  | 'timed_recall'
  | 'weak_fact_revision';

export interface GeneratedQuestion {
  id: string;
  factId: string;
  type: QuestionType;
  factorA: number;
  factorB: number;
  correctAnswer: number;
  promptText: {
    en: string;
    hi: string;
  };
  promptSpeech: {
    en: string;
    hi: string;
  };
  hintText: {
    en: string;
    hi: string;
  };
  explanationText: {
    en: string;
    hi: string;
  };
  options?: number[]; // for multiple choice
  visualData?: {
    groups: number;
    itemsPerGroup: number;
    itemName: string;
    icon: string;
  };
}

export interface LearningSession {
  id: string;
  mode: LearningMode;
  startedAt: number;
  endedAt: number | null;
  totalQuestions: number;
  correctCount: number;
  averageLatencyMs: number;
  accuracyRate: number;
  hintsUsedCount: number;
}

export interface InstalledSpeechModel {
  modelId: string;
  language: Language;
  name: string;
  version: string;
  filePath: string;
  checksum: string;
  sizeBytes: number;
  installedAt: number;
  isVerified: boolean;
}
