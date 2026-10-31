import { SpacedRepetitionItem } from '../../types/database';

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export interface PerformanceRating {
  // 5: Perfect instant recall (< 2s)
  // 4: Correct after hesitation (2-4s)
  // 3: Correct with effort or slight delay (> 4s)
  // 2: Incorrect, but knew after seeing explanation
  // 1: Complete blank or wrong
  // 0: Completely unfamiliar
  quality: 0 | 1 | 2 | 3 | 4 | 5;
}

/**
 * Calculates updated Spaced Repetition interval and ease factor (SuperMemo SM-2 adapted for numerical recall).
 * Returns new SpacedRepetitionItem with updated dueDate and intervalDays.
 */
export function calculateNextReview(
  current: SpacedRepetitionItem,
  performance: PerformanceRating,
  nowMs: number = Date.now()
): SpacedRepetitionItem {
  const q = performance.quality;
  let newRepetitionCount = current.repetitionCount;
  let newEaseFactor = current.easeFactor;
  let newIntervalDays = current.intervalDays;

  if (q >= 3) {
    // Correct response
    if (newRepetitionCount === 0) {
      newIntervalDays = 1; // 1 day
    } else if (newRepetitionCount === 1) {
      newIntervalDays = 3; // 3 days
    } else if (newRepetitionCount === 2) {
      newIntervalDays = 7; // 7 days
    } else if (newRepetitionCount === 3) {
      newIntervalDays = 14; // 14 days
    } else {
      newIntervalDays = Math.round(current.intervalDays * newEaseFactor);
      if (newIntervalDays > 30) {
        newIntervalDays = 30; // 30 days max interval as recommended
      }
    }
    newRepetitionCount += 1;
  } else {
    // Incorrect or failed recall -> Reset repetition cycle back to 1 day
    newRepetitionCount = 0;
    newIntervalDays = 1;
  }

  // Update Ease Factor: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  newEaseFactor = newEaseFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  if (newEaseFactor < 1.3) {
    newEaseFactor = 1.3; // minimum ease threshold
  }

  const dueDate = nowMs + newIntervalDays * ONE_DAY_MS;

  return {
    factId: current.factId,
    easeFactor: Math.round(newEaseFactor * 100) / 100,
    intervalDays: newIntervalDays,
    repetitionCount: newRepetitionCount,
    dueDate,
    lastReviewedAt: nowMs,
  };
}

/**
 * Creates an initial spaced repetition item for a newly encountered fact.
 */
export function createInitialSpacedRepetitionItem(factId: string, nowMs: number = Date.now()): SpacedRepetitionItem {
  return {
    factId,
    easeFactor: 2.5,
    intervalDays: 0,
    repetitionCount: 0,
    dueDate: nowMs, // Due immediately
    lastReviewedAt: 0,
  };
}
