import { getDatabase } from '../index';
import { LearningSession, QuestionAttempt } from '../../../types/database';

export async function createLearningSession(session: LearningSession, userId: string = 'local_user'): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO learning_sessions (
      id, user_id, mode, started_at, ended_at, total_questions,
      correct_count, average_latency_ms, accuracy_rate, hints_used_count
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    session.id,
    userId,
    session.mode,
    session.startedAt,
    session.endedAt,
    session.totalQuestions,
    session.correctCount,
    session.averageLatencyMs,
    session.accuracyRate,
    session.hintsUsedCount
  );
}

export async function updateLearningSession(session: LearningSession): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `UPDATE learning_sessions SET
      ended_at = ?,
      total_questions = ?,
      correct_count = ?,
      average_latency_ms = ?,
      accuracy_rate = ?,
      hints_used_count = ?
    WHERE id = ?`,
    session.endedAt,
    session.totalQuestions,
    session.correctCount,
    session.averageLatencyMs,
    session.accuracyRate,
    session.hintsUsedCount,
    session.id
  );
}

export async function recordQuestionAttempt(attempt: QuestionAttempt): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO question_attempts (
      id, session_id, fact_id, question_type, prompt, user_answer,
      expected_answer, is_correct, latency_ms, hint_used, input_mode, timestamp
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    attempt.id,
    attempt.sessionId,
    attempt.factId,
    attempt.questionType,
    attempt.prompt,
    attempt.userAnswer,
    attempt.expectedAnswer,
    attempt.isCorrect ? 1 : 0,
    attempt.latencyMs,
    attempt.hintUsed ? 1 : 0,
    attempt.inputMode,
    attempt.timestamp
  );
}

export async function recordDailyStreakActivity(userId: string = 'local_user'): Promise<void> {
  const db = await getDatabase();
  const dateStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  await db.runAsync(
    `INSERT INTO learning_streaks (user_id, activity_date, minutes_spent, questions_completed)
     VALUES (?, ?, 1, 1)
     ON CONFLICT(user_id, activity_date) DO UPDATE SET
       minutes_spent = minutes_spent + 1,
       questions_completed = questions_completed + 1`,
    userId,
    dateStr
  );
}

export async function calculateStreakDays(userId: string = 'local_user'): Promise<number> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<{ activity_date: string }>(
    'SELECT activity_date FROM learning_streaks WHERE user_id = ? ORDER BY activity_date DESC',
    userId
  );

  if (rows.length === 0) return 0;

  let streak = 0;
  const now = new Date();
  let checkDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Check if today has activity; if not, check yesterday
  const todayStr = checkDate.toISOString().split('T')[0];
  const dateSet = new Set(rows.map((r) => r.activity_date));

  if (!dateSet.has(todayStr)) {
    // Check yesterday
    checkDate.setDate(checkDate.getDate() - 1);
    const yesterdayStr = checkDate.toISOString().split('T')[0];
    if (!dateSet.has(yesterdayStr)) {
      return 0; // Streak broken
    }
  }

  while (dateSet.has(checkDate.toISOString().split('T')[0])) {
    streak++;
    checkDate.setDate(checkDate.getDate() - 1);
  }

  return streak;
}

export async function getOverallStats(userId: string = 'local_user') {
  const db = await getDatabase();
  const attempts = await db.getFirstAsync<{
    total: number;
    correct: number;
    avg_latency: number;
  }>(`
    SELECT 
      COUNT(*) as total,
      COALESCE(SUM(CASE WHEN is_correct = 1 THEN 1 ELSE 0 END), 0) as correct,
      COALESCE(AVG(latency_ms), 0) as avg_latency
    FROM question_attempts
  `);

  const sessions = await db.getFirstAsync<{ session_count: number }>(
    'SELECT COUNT(*) as session_count FROM learning_sessions WHERE user_id = ?',
    userId
  );

  const streak = await calculateStreakDays(userId);

  const total = attempts?.total || 0;
  const correct = attempts?.correct || 0;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

  return {
    totalQuestions: total,
    correctAnswers: correct,
    accuracyPercentage: accuracy,
    averageLatencyMs: Math.round(attempts?.avg_latency || 0),
    totalSessions: sessions?.session_count || 0,
    streakDays: streak,
  };
}
