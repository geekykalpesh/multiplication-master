import * as SQLite from 'expo-sqlite';
import { DB_NAME, CREATE_TABLES_SQL } from './schema';
import { ACHIEVEMENTS } from '../../constants/achievements';
import { TargetAudience, Language, LearningMode, ThemePreference } from '../../types/database';

let dbInstance: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!dbInstance) {
    dbInstance = await SQLite.openDatabaseAsync(DB_NAME);
    await initializeDatabase(dbInstance);
  }
  return dbInstance;
}

export async function initializeDatabase(db: SQLite.SQLiteDatabase): Promise<void> {
  // Execute table definitions
  await db.execAsync(CREATE_TABLES_SQL);

  // Check if default user exists
  const existingUser = await db.getFirstAsync<{ id: string }>(
    'SELECT id FROM users LIMIT 1'
  );

  if (!existingUser) {
    const now = Date.now();
    const defaultUserId = 'local_user';

    // Transaction to insert default profile & preferences
    await db.withTransactionAsync(async () => {
      await db.runAsync(
        'INSERT INTO users (id, name, target_audience, created_at) VALUES (?, ?, ?, ?)',
        defaultUserId,
        'Learner',
        'child',
        now
      );

      await db.runAsync(
        `INSERT INTO user_preferences (
          user_id, language, learning_mode, theme, daily_goal_minutes,
          speech_rate, speech_pitch, mascot_enabled, sound_effects_enabled,
          haptic_feedback_enabled, font_scale, high_contrast, reduced_motion
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        defaultUserId,
        'en',
        'visual',
        'light',
        15,
        1.0,
        1.0,
        1,
        1,
        1,
        1.0,
        0,
        0
      );

      // Seed Achievements
      for (const ach of ACHIEVEMENTS) {
        await db.runAsync(
          'INSERT OR IGNORE INTO achievements (id, category, icon, target_value) VALUES (?, ?, ?, ?)',
          ach.id,
          ach.category,
          ach.icon,
          ach.requirement.targetValue
        );
      }

      // Seed all 400 multiplication facts (1x1 to 20x20)
      for (let a = 1; a <= 20; a++) {
        for (let b = 1; b <= 20; b++) {
          const factId = `${a}x${b}`;
          const product = a * b;
          let tier = 1;
          if (a <= 5 && b <= 5) tier = 1;
          else if (a <= 10 && b <= 10) tier = 2;
          else if (a <= 12 && b <= 12) tier = 3;
          else if (a <= 15 && b <= 15) tier = 4;
          else tier = 5;

          await db.runAsync(
            'INSERT OR IGNORE INTO multiplication_facts (id, factor_a, factor_b, product, difficulty_tier) VALUES (?, ?, ?, ?, ?)',
            factId,
            a,
            b,
            product,
            tier
          );

          await db.runAsync(
            'INSERT OR IGNORE INTO mastery_records (fact_id, consecutive_correct, total_attempts, total_correct, average_latency_ms, mastery_score, is_mastered, last_practiced_at) VALUES (?, 0, 0, 0, 0, 0.0, 0, NULL)',
            factId
          );

          await db.runAsync(
            'INSERT OR IGNORE INTO spaced_repetition_schedule (fact_id, ease_factor, interval_days, repetition_count, due_date, last_reviewed_at) VALUES (?, 2.5, 0, 0, ?, 0)',
            factId,
            now
          );
        }
      }
    });
  }
}
