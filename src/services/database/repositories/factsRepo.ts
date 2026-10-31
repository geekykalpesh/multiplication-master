import { getDatabase } from '../index';
import { MasteryRecord, SpacedRepetitionItem, MultiplicationFact } from '../../../types/database';

export async function getAllMasteryRecords(): Promise<MasteryRecord[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<{
    fact_id: string;
    consecutive_correct: number;
    total_attempts: number;
    total_correct: number;
    average_latency_ms: number;
    mastery_score: number;
    is_mastered: number;
    last_practiced_at: number | null;
  }>('SELECT * FROM mastery_records');

  return rows.map((r) => ({
    factId: r.fact_id,
    consecutiveCorrect: r.consecutive_correct,
    totalAttempts: r.total_attempts,
    totalCorrect: r.total_correct,
    averageLatencyMs: r.average_latency_ms,
    masteryScore: r.mastery_score,
    isMastered: Boolean(r.is_mastered),
    lastPracticedAt: r.last_practiced_at,
  }));
}

export async function getMasteryRecord(factId: string): Promise<MasteryRecord | null> {
  const db = await getDatabase();
  const r = await db.getFirstAsync<{
    fact_id: string;
    consecutive_correct: number;
    total_attempts: number;
    total_correct: number;
    average_latency_ms: number;
    mastery_score: number;
    is_mastered: number;
    last_practiced_at: number | null;
  }>('SELECT * FROM mastery_records WHERE fact_id = ?', factId);

  if (!r) return null;
  return {
    factId: r.fact_id,
    consecutiveCorrect: r.consecutive_correct,
    totalAttempts: r.total_attempts,
    totalCorrect: r.total_correct,
    averageLatencyMs: r.average_latency_ms,
    masteryScore: r.mastery_score,
    isMastered: Boolean(r.is_mastered),
    lastPracticedAt: r.last_practiced_at,
  };
}

export async function saveMasteryRecord(record: MasteryRecord): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT OR REPLACE INTO mastery_records (
      fact_id, consecutive_correct, total_attempts, total_correct,
      average_latency_ms, mastery_score, is_mastered, last_practiced_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    record.factId,
    record.consecutiveCorrect,
    record.totalAttempts,
    record.totalCorrect,
    record.averageLatencyMs,
    record.masteryScore,
    record.isMastered ? 1 : 0,
    record.lastPracticedAt
  );
}

export async function getSpacedRepetitionDue(limit: number = 20): Promise<SpacedRepetitionItem[]> {
  const db = await getDatabase();
  const now = Date.now();
  const rows = await db.getAllAsync<{
    fact_id: string;
    ease_factor: number;
    interval_days: number;
    repetition_count: number;
    due_date: number;
    last_reviewed_at: number;
  }>(
    'SELECT * FROM spaced_repetition_schedule WHERE due_date <= ? ORDER BY due_date ASC LIMIT ?',
    now,
    limit
  );

  return rows.map((r) => ({
    factId: r.fact_id,
    easeFactor: r.ease_factor,
    intervalDays: r.interval_days,
    repetitionCount: r.repetition_count,
    dueDate: r.due_date,
    lastReviewedAt: r.last_reviewed_at,
  }));
}

export async function getSpacedRepetitionItem(factId: string): Promise<SpacedRepetitionItem | null> {
  const db = await getDatabase();
  const r = await db.getFirstAsync<{
    fact_id: string;
    ease_factor: number;
    interval_days: number;
    repetition_count: number;
    due_date: number;
    last_reviewed_at: number;
  }>('SELECT * FROM spaced_repetition_schedule WHERE fact_id = ?', factId);

  if (!r) return null;
  return {
    factId: r.fact_id,
    easeFactor: r.ease_factor,
    intervalDays: r.interval_days,
    repetitionCount: r.repetition_count,
    dueDate: r.due_date,
    lastReviewedAt: r.last_reviewed_at,
  };
}

export async function saveSpacedRepetitionItem(item: SpacedRepetitionItem): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT OR REPLACE INTO spaced_repetition_schedule (
      fact_id, ease_factor, interval_days, repetition_count, due_date, last_reviewed_at
    ) VALUES (?, ?, ?, ?, ?, ?)`,
    item.factId,
    item.easeFactor,
    item.intervalDays,
    item.repetitionCount,
    item.dueDate,
    item.lastReviewedAt
  );
}

export async function getTableMasteryPercentage(tableNumber: number): Promise<number> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<{ is_mastered: number }>(
    `SELECT is_mastered FROM mastery_records 
     WHERE fact_id LIKE ? OR fact_id LIKE ?`,
    `${tableNumber}x%`,
    `%x${tableNumber}`
  );

  if (rows.length === 0) return 0;
  const masteredCount = rows.filter((r) => r.is_mastered === 1).length;
  return Math.round((masteredCount / rows.length) * 100);
}
