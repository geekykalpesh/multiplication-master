import { MasteryRecord } from '../../types/database';

export interface AttemptEvaluationInput {
  isCorrect: boolean;
  latencyMs: number;
  hintUsed: boolean;
}

/**
 * Calculates updated mastery for a multiplication fact.
 * Combines:
 * - Consistency (consecutive correct answers, minimum 3-5 required for full mastery)
 * - Accuracy ratio
 * - Latency signal (under 3000ms demonstrates fluid retrieval)
 * - Hint penalty (using hints does not count as unprompted mastery)
 */
export function updateMasteryRecord(
  current: MasteryRecord,
  attempt: AttemptEvaluationInput
): MasteryRecord {
  const { isCorrect, latencyMs, hintUsed } = attempt;

  const totalAttempts = current.totalAttempts + 1;
  const totalCorrect = current.totalCorrect + (isCorrect ? 1 : 0);

  // Update rolling average latency
  const currentAvg = current.averageLatencyMs || latencyMs;
  const newAverageLatency = Math.round((currentAvg * (totalAttempts - 1) + latencyMs) / totalAttempts);

  let consecutiveCorrect = current.consecutiveCorrect;

  if (isCorrect && !hintUsed) {
    consecutiveCorrect += 1;
  } else if (!isCorrect) {
    consecutiveCorrect = 0; // reset streak on error
  }

  // Calculate mastery score (0.0 to 1.0)
  // Components:
  // 1. Accuracy weight: 40%
  const accuracyRatio = totalCorrect / totalAttempts;
  const accuracyScore = Math.min(1.0, accuracyRatio) * 0.4;

  // 2. Consecutive success weight: 40% (5 in a row gives max 0.4)
  const streakScore = Math.min(1.0, consecutiveCorrect / 5) * 0.4;

  // 3. Fluency/Latency weight: 20% (<2500ms = 0.2, 2500-5000ms = 0.1, >5000ms = 0.05)
  let speedScore = 0.05;
  if (newAverageLatency < 2500) {
    speedScore = 0.2;
  } else if (newAverageLatency < 4500) {
    speedScore = 0.12;
  }

  let finalScore = accuracyScore + streakScore + speedScore;
  finalScore = Math.min(1.0, Math.max(0.0, Math.round(finalScore * 100) / 100));

  // A fact is considered mastered if masteryScore >= 0.85 and at least 4 consecutive correct attempts without hints
  const isMastered = finalScore >= 0.85 && consecutiveCorrect >= 4;

  return {
    factId: current.factId,
    consecutiveCorrect,
    totalAttempts,
    totalCorrect,
    averageLatencyMs: newAverageLatency,
    masteryScore: finalScore,
    isMastered,
    lastPracticedAt: Date.now(),
  };
}

export function createInitialMasteryRecord(factId: string): MasteryRecord {
  return {
    factId,
    consecutiveCorrect: 0,
    totalAttempts: 0,
    totalCorrect: 0,
    averageLatencyMs: 0,
    masteryScore: 0,
    isMastered: false,
    lastPracticedAt: null,
  };
}
