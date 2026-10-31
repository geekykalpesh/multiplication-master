import { MasteryRecord } from '../../types/database';

export interface WeakFactAnalysis {
  factId: string;
  factorA: number;
  factorB: number;
  product: number;
  severity: 'high' | 'medium' | 'low';
  reasons: string[];
  suggestedPracticeIds: string[];
}

/**
 * Analyzes all mastery records and identifies facts needing remedial practice.
 * Weak facts are defined by:
 * 1. Accuracy under 70% with at least 2 attempts
 * 2. High latency (> 6000ms) with multiple attempts (hesitation/mental struggle)
 * 3. Recent streak broken (consecutiveCorrect = 0 after previous attempts)
 */
export function detectWeakFacts(records: MasteryRecord[]): WeakFactAnalysis[] {
  const weakList: WeakFactAnalysis[] = [];

  for (const rec of records) {
    if (rec.totalAttempts < 2) continue; // Not enough data yet

    const reasons: string[] = [];
    const accuracy = rec.totalCorrect / rec.totalAttempts;

    if (accuracy < 0.6) {
      reasons.push('Low accuracy (< 60%)');
    }

    if (rec.averageLatencyMs > 5500) {
      reasons.push('High response latency (> 5.5s)');
    }

    if (rec.consecutiveCorrect === 0 && rec.totalAttempts >= 3) {
      reasons.push('Struggled in recent attempts');
    }

    if (reasons.length > 0) {
      const [aStr, bStr] = rec.factId.split('x');
      const factorA = parseInt(aStr, 10);
      const factorB = parseInt(bStr, 10);
      const product = factorA * factorB;

      let severity: 'high' | 'medium' | 'low' = 'low';
      if (reasons.length >= 2 || accuracy < 0.4) {
        severity = 'high';
      } else if (reasons.length === 1 && accuracy < 0.7) {
        severity = 'medium';
      }

      // Generate related practice fact IDs:
      // e.g. For 7x8: reverse operand 8x7, adjacent 7x7, 7x9
      const related = [
        `${factorA}x${factorB}`,
        `${factorB}x${factorA}`,
      ];
      if (factorB > 1) related.push(`${factorA}x${factorB - 1}`);
      if (factorB < 20) related.push(`${factorA}x${factorB + 1}`);

      weakList.push({
        factId: rec.factId,
        factorA,
        factorB,
        product,
        severity,
        reasons,
        suggestedPracticeIds: Array.from(new Set(related)),
      });
    }
  }

  // Sort by severity (high first) and lower accuracy
  return weakList.sort((a, b) => {
    const scoreMap = { high: 3, medium: 2, low: 1 };
    return scoreMap[b.severity] - scoreMap[a.severity];
  });
}
