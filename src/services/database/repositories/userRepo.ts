import { getDatabase } from '../index';
import { UserProfile, UserPreferences } from '../../../types/database';

export async function getUserProfile(userId: string = 'local_user'): Promise<UserProfile | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<{
    id: string;
    name: string;
    target_audience: any;
    created_at: number;
  }>('SELECT * FROM users WHERE id = ?', userId);

  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    targetAudience: row.target_audience,
    createdAt: row.created_at,
  };
}

export async function getUserPreferences(userId: string = 'local_user'): Promise<UserPreferences | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<{
    user_id: string;
    language: any;
    learning_mode: any;
    theme: any;
    daily_goal_minutes: number;
    speech_rate: number;
    speech_pitch: number;
    mascot_enabled: number;
    sound_effects_enabled: number;
    haptic_feedback_enabled: number;
    font_scale: number;
    high_contrast: number;
    reduced_motion: number;
  }>('SELECT * FROM user_preferences WHERE user_id = ?', userId);

  if (!row) return null;
  return {
    language: row.language,
    learningMode: row.learning_mode,
    theme: row.theme,
    dailyGoalMinutes: row.daily_goal_minutes,
    speechRate: row.speech_rate,
    speechPitch: row.speech_pitch,
    mascotEnabled: Boolean(row.mascot_enabled),
    soundEffectsEnabled: Boolean(row.sound_effects_enabled),
    hapticFeedbackEnabled: Boolean(row.haptic_feedback_enabled),
    fontScale: row.font_scale,
    highContrast: Boolean(row.high_contrast),
    reducedMotion: Boolean(row.reduced_motion),
  };
}

export async function updateUserPreferences(
  userId: string = 'local_user',
  prefs: Partial<UserPreferences>
): Promise<void> {
  const db = await getDatabase();
  const current = await getUserPreferences(userId);
  if (!current) return;

  const merged = { ...current, ...prefs };

  await db.runAsync(
    `UPDATE user_preferences SET
      language = ?,
      learning_mode = ?,
      theme = ?,
      daily_goal_minutes = ?,
      speech_rate = ?,
      speech_pitch = ?,
      mascot_enabled = ?,
      sound_effects_enabled = ?,
      haptic_feedback_enabled = ?,
      font_scale = ?,
      high_contrast = ?,
      reduced_motion = ?
    WHERE user_id = ?`,
    merged.language,
    merged.learningMode,
    merged.theme,
    merged.dailyGoalMinutes,
    merged.speechRate,
    merged.speechPitch,
    merged.mascotEnabled ? 1 : 0,
    merged.soundEffectsEnabled ? 1 : 0,
    merged.hapticFeedbackEnabled ? 1 : 0,
    merged.fontScale,
    merged.highContrast ? 1 : 0,
    merged.reducedMotion ? 1 : 0,
    userId
  );
}

export async function updateUserAudience(
  userId: string = 'local_user',
  targetAudience: 'child' | 'adult' | 'visually_impaired'
): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('UPDATE users SET target_audience = ? WHERE id = ?', targetAudience, userId);
}
