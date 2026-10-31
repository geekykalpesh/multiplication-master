import { QuestionType } from '../../types/database';

export interface AdaptiveProfile {
  consecutiveSuccesses: number;
  consecutiveFailures: number;
  averageSessionLatencyMs: number;
  currentDifficultyLevel: 1 | 2 | 3 | 4 | 5; // 1: beginner, 5: expert
}

export interface AdaptiveRecommendation {
  recommendedLevel: 1 | 2 | 3 | 4 | 5;
  allowedQuestionTypes: QuestionType[];
  autoShowHints: boolean;
  visualAidSuggested: boolean;
  explanationLevel: 'detailed' | 'concise';
}

export function evaluateAdaptiveDifficulty(profile: AdaptiveProfile): AdaptiveRecommendation {
  let level = profile.currentDifficultyLevel;

  // Adapt up or down based on recent streak
  if (profile.consecutiveSuccesses >= 4 && level < 5) {
    level = (level + 1) as 1 | 2 | 3 | 4 | 5;
  } else if (profile.consecutiveFailures >= 2 && level > 1) {
    level = (level - 1) as 1 | 2 | 3 | 4 | 5;
  }

  switch (level) {
    case 1:
      // Foundations: direct, repeated addition, visual grouping
      return {
        recommendedLevel: 1,
        allowedQuestionTypes: ['direct', 'repeated_addition', 'visual_grouping'],
        autoShowHints: true,
        visualAidSuggested: true,
        explanationLevel: 'detailed',
      };

    case 2:
      // Basic recall: direct, multiple choice, skip counting
      return {
        recommendedLevel: 2,
        allowedQuestionTypes: ['direct', 'multiple_choice', 'skip_counting', 'repeated_addition'],
        autoShowHints: false,
        visualAidSuggested: true,
        explanationLevel: 'detailed',
      };

    case 3:
      // Intermediate: direct, missing numbers, reverse
      return {
        recommendedLevel: 3,
        allowedQuestionTypes: ['direct', 'missing_second', 'reverse', 'multiple_choice'],
        autoShowHints: false,
        visualAidSuggested: false,
        explanationLevel: 'concise',
      };

    case 4:
      // Advanced: reverse, mental shortcuts, word problems
      return {
        recommendedLevel: 4,
        allowedQuestionTypes: ['direct', 'reverse', 'missing_second', 'mental_shortcut', 'word_problem'],
        autoShowHints: false,
        visualAidSuggested: false,
        explanationLevel: 'concise',
      };

    case 5:
    default:
      // Expert: rapid recall, mental shortcuts, word problems, reverse
      return {
        recommendedLevel: 5,
        allowedQuestionTypes: ['direct', 'reverse', 'missing_second', 'mental_shortcut', 'word_problem'],
        autoShowHints: false,
        visualAidSuggested: false,
        explanationLevel: 'concise',
      };
  }
}
