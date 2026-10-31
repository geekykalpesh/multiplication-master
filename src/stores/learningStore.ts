import { create } from 'zustand';
import { GeneratedQuestion, LearningSession } from '../types/database';
import { WeakFactAnalysis, detectWeakFacts } from '../engines/learning-engine/weakFactDetector';
import { getAllMasteryRecords, getSpacedRepetitionDue } from '../services/database/repositories/factsRepo';
import { getOverallStats } from '../services/database/repositories/sessionsRepo';
import { getUserAchievements } from '../services/database/repositories/achievementsRepo';

interface LearningState {
  stats: {
    totalQuestions: number;
    correctAnswers: number;
    accuracyPercentage: number;
    averageLatencyMs: number;
    totalSessions: number;
    streakDays: number;
  };
  weakFacts: WeakFactAnalysis[];
  dueReviewsCount: number;
  unlockedBadgesCount: number;
  activeSession: LearningSession | null;
  currentQuestion: GeneratedQuestion | null;
  refreshLearningData: () => Promise<void>;
  startSession: (session: LearningSession) => void;
  setCurrentQuestion: (q: GeneratedQuestion | null) => void;
  endSession: () => void;
}

export const useLearningStore = create<LearningState>((set) => ({
  stats: {
    totalQuestions: 0,
    correctAnswers: 0,
    accuracyPercentage: 0,
    averageLatencyMs: 0,
    totalSessions: 0,
    streakDays: 0,
  },
  weakFacts: [],
  dueReviewsCount: 0,
  unlockedBadgesCount: 0,
  activeSession: null,
  currentQuestion: null,

  refreshLearningData: async () => {
    try {
      const stats = await getOverallStats();
      const masteryRecords = await getAllMasteryRecords();
      const weakFacts = detectWeakFacts(masteryRecords);
      const dueItems = await getSpacedRepetitionDue(100);
      const achievements = await getUserAchievements();

      set({
        stats,
        weakFacts,
        dueReviewsCount: dueItems.length,
        unlockedBadgesCount: achievements.length,
      });
    } catch (e) {
      console.warn('Error refreshing learning data:', e);
    }
  },

  startSession: (session: LearningSession) => {
    set({ activeSession: session });
  },

  setCurrentQuestion: (currentQuestion: GeneratedQuestion | null) => {
    set({ currentQuestion });
  },

  endSession: () => {
    set({ activeSession: null, currentQuestion: null });
  },
}));
