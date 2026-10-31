import { create } from 'zustand';
import { TargetAudience, Language, LearningMode, ThemePreference, UserPreferences, UserProfile } from '../types/database';
import { getUserProfile, getUserPreferences, updateUserPreferences, updateUserAudience } from '../services/database/repositories/userRepo';

interface UserState {
  profile: UserProfile | null;
  preferences: UserPreferences;
  isInitialized: boolean;
  loadUserData: () => Promise<void>;
  setLanguage: (lang: Language) => Promise<void>;
  setTargetAudience: (audience: TargetAudience) => Promise<void>;
  setLearningMode: (mode: LearningMode) => Promise<void>;
  setTheme: (theme: ThemePreference) => Promise<void>;
  updatePreferences: (prefs: Partial<UserPreferences>) => Promise<void>;
}

const defaultPreferences: UserPreferences = {
  language: 'en',
  learningMode: 'visual',
  theme: 'light',
  dailyGoalMinutes: 15,
  speechRate: 1.0,
  speechPitch: 1.0,
  mascotEnabled: true,
  soundEffectsEnabled: true,
  hapticFeedbackEnabled: true,
  fontScale: 1.0,
  highContrast: false,
  reducedMotion: false,
};

export const useUserStore = create<UserState>((set, get) => ({
  profile: null,
  preferences: defaultPreferences,
  isInitialized: false,

  loadUserData: async () => {
    try {
      const profile = await getUserProfile();
      const prefs = await getUserPreferences();
      set({
        profile,
        preferences: prefs || defaultPreferences,
        isInitialized: true,
      });
    } catch (e) {
      console.warn('Error loading user data:', e);
      set({ isInitialized: true });
    }
  },

  setLanguage: async (language: Language) => {
    await updateUserPreferences('local_user', { language });
    set((state) => ({
      preferences: { ...state.preferences, language },
    }));
  },

  setTargetAudience: async (targetAudience: TargetAudience) => {
    await updateUserAudience('local_user', targetAudience);
    set((state) => ({
      profile: state.profile ? { ...state.profile, targetAudience } : null,
    }));
  },

  setLearningMode: async (learningMode: LearningMode) => {
    await updateUserPreferences('local_user', { learningMode });
    set((state) => ({
      preferences: { ...state.preferences, learningMode },
    }));
  },

  setTheme: async (theme: ThemePreference) => {
    await updateUserPreferences('local_user', {
      theme,
      highContrast: theme === 'high_contrast',
    });
    set((state) => ({
      preferences: {
        ...state.preferences,
        theme,
        highContrast: theme === 'high_contrast',
      },
    }));
  },

  updatePreferences: async (partial: Partial<UserPreferences>) => {
    await updateUserPreferences('local_user', partial);
    set((state) => ({
      preferences: { ...state.preferences, ...partial },
    }));
  },
}));
