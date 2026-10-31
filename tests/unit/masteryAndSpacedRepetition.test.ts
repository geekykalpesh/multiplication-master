import { calculateNextReview, createInitialSpacedRepetitionItem } from '../../src/engines/spaced-repetition/sm2';
import { updateMasteryRecord, createInitialMasteryRecord } from '../../src/engines/learning-engine/masteryCalculator';
import { detectWeakFacts } from '../../src/engines/learning-engine/weakFactDetector';
import { evaluateAdaptiveDifficulty } from '../../src/engines/learning-engine/adaptiveDifficulty';

describe('Mastery & Spaced Repetition Suite', () => {
  describe('Spaced Repetition (SM-2 adaptation)', () => {
    it('schedules review intervals 1d -> 3d -> 7d -> 14d -> 30d on successive successes', () => {
      let item = createInitialSpacedRepetitionItem('7x8', 100000);
      expect(item.repetitionCount).toBe(0);

      // 1st success (quality 5)
      item = calculateNextReview(item, { quality: 5 }, 100000);
      expect(item.repetitionCount).toBe(1);
      expect(item.intervalDays).toBe(1);

      // 2nd success
      item = calculateNextReview(item, { quality: 5 }, 100000);
      expect(item.repetitionCount).toBe(2);
      expect(item.intervalDays).toBe(3);

      // 3rd success
      item = calculateNextReview(item, { quality: 5 }, 100000);
      expect(item.repetitionCount).toBe(3);
      expect(item.intervalDays).toBe(7);

      // 4th success
      item = calculateNextReview(item, { quality: 5 }, 100000);
      expect(item.repetitionCount).toBe(4);
      expect(item.intervalDays).toBe(14);
    });

    it('resets interval back to 1 day on recall failure (quality < 3)', () => {
      let item = createInitialSpacedRepetitionItem('7x8', 100000);
      item = calculateNextReview(item, { quality: 5 }, 100000); // 1d
      item = calculateNextReview(item, { quality: 5 }, 100000); // 3d
      expect(item.repetitionCount).toBe(2);

      // Failure
      item = calculateNextReview(item, { quality: 1 }, 100000);
      expect(item.repetitionCount).toBe(0);
      expect(item.intervalDays).toBe(1);
    });
  });

  describe('Mastery Score Calculation', () => {
    it('requires multiple consecutive correct answers before declaring mastery', () => {
      let record = createInitialMasteryRecord('12x6');
      expect(record.isMastered).toBe(false);

      // Single correct answer should NOT declare mastery
      record = updateMasteryRecord(record, { isCorrect: true, latencyMs: 1200, hintUsed: false });
      expect(record.isMastered).toBe(false);

      // 4 consecutive correct answers with fluid latency achieves mastery
      record = updateMasteryRecord(record, { isCorrect: true, latencyMs: 1200, hintUsed: false });
      record = updateMasteryRecord(record, { isCorrect: true, latencyMs: 1400, hintUsed: false });
      record = updateMasteryRecord(record, { isCorrect: true, latencyMs: 1100, hintUsed: false });
      expect(record.isMastered).toBe(true);
      expect(record.masteryScore).toBeGreaterThanOrEqual(0.85);
    });

    it('resets consecutive streak when an error occurs', () => {
      let record = createInitialMasteryRecord('7x8');
      record = updateMasteryRecord(record, { isCorrect: true, latencyMs: 2000, hintUsed: false });
      record = updateMasteryRecord(record, { isCorrect: true, latencyMs: 2000, hintUsed: false });
      expect(record.consecutiveCorrect).toBe(2);

      record = updateMasteryRecord(record, { isCorrect: false, latencyMs: 4000, hintUsed: false });
      expect(record.consecutiveCorrect).toBe(0);
      expect(record.isMastered).toBe(false);
    });
  });

  describe('Weak Fact Detection', () => {
    it('detects facts with low accuracy as weak facts and generates related drill pairs', () => {
      const records = [
        {
          factId: '7x8',
          consecutiveCorrect: 0,
          totalAttempts: 5,
          totalCorrect: 1, // 20% accuracy
          averageLatencyMs: 6500,
          masteryScore: 0.2,
          isMastered: false,
          lastPracticedAt: Date.now(),
        },
        {
          factId: '2x3',
          consecutiveCorrect: 5,
          totalAttempts: 5,
          totalCorrect: 5, // 100% accuracy
          averageLatencyMs: 1200,
          masteryScore: 1.0,
          isMastered: true,
          lastPracticedAt: Date.now(),
        },
      ];

      const weak = detectWeakFacts(records);
      expect(weak.length).toBe(1);
      expect(weak[0].factId).toBe('7x8');
      expect(weak[0].severity).toBe('high');
      expect(weak[0].suggestedPracticeIds).toContain('8x7'); // reverse operand
    });
  });

  describe('Adaptive Difficulty Engine', () => {
    it('increases difficulty tier after consistent success and decreases after errors', () => {
      const recUp = evaluateAdaptiveDifficulty({
        consecutiveSuccesses: 5,
        consecutiveFailures: 0,
        averageSessionLatencyMs: 1500,
        currentDifficultyLevel: 2,
      });
      expect(recUp.recommendedLevel).toBe(3);

      const recDown = evaluateAdaptiveDifficulty({
        consecutiveSuccesses: 0,
        consecutiveFailures: 3,
        averageSessionLatencyMs: 6000,
        currentDifficultyLevel: 3,
      });
      expect(recDown.recommendedLevel).toBe(2);
      expect(recDown.autoShowHints).toBe(false);
    });
  });
});
