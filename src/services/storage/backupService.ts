import { z } from 'zod';
import * as FileSystem from 'expo-file-system/legacy';
import { getDatabase } from '../database/index';
import { getUserPreferences, updateUserPreferences, getUserProfile } from '../database/repositories/userRepo';
import { getAllMasteryRecords, saveMasteryRecord } from '../database/repositories/factsRepo';
import { getUserAchievements } from '../database/repositories/achievementsRepo';

const BackupDataSchema = z.object({
  version: z.number().int().min(1),
  exportedAt: z.number(),
  appName: z.literal('Multiplication Master'),
  profile: z.object({
    id: z.string(),
    name: z.string(),
    targetAudience: z.enum(['child', 'adult', 'visually_impaired']),
    createdAt: z.number(),
  }),
  preferences: z.object({
    language: z.enum(['en', 'hi']),
    learningMode: z.enum(['visual', 'audio_focus', 'hands_free']),
    theme: z.enum(['light', 'dark', 'high_contrast']),
    dailyGoalMinutes: z.number(),
    speechRate: z.number(),
    speechPitch: z.number(),
    mascotEnabled: z.boolean(),
    soundEffectsEnabled: z.boolean(),
    hapticFeedbackEnabled: z.boolean(),
    fontScale: z.number(),
    highContrast: z.boolean(),
    reducedMotion: z.boolean(),
  }),
  masteryRecords: z.array(
    z.object({
      factId: z.string(),
      consecutiveCorrect: z.number(),
      totalAttempts: z.number(),
      totalCorrect: z.number(),
      averageLatencyMs: z.number(),
      masteryScore: z.number(),
      isMastered: z.boolean(),
      lastPracticedAt: z.number().nullable(),
    })
  ),
  unlockedAchievementIds: z.array(z.string()),
});

export type BackupData = z.infer<typeof BackupDataSchema>;

export class LocalBackupService {
  /**
   * Generates a complete JSON backup of the user's local learning progress.
   */
  public async exportBackup(): Promise<string> {
    const profile = await getUserProfile();
    const preferences = await getUserPreferences();
    const masteryRecords = await getAllMasteryRecords();
    const achievements = await getUserAchievements();

    if (!profile || !preferences) {
      throw new Error('User profile or preferences not initialized.');
    }

    const backupPayload: BackupData = {
      version: 1,
      exportedAt: Date.now(),
      appName: 'Multiplication Master',
      profile,
      preferences,
      masteryRecords,
      unlockedAchievementIds: achievements.map((a) => a.achievement.id),
    };

    const jsonString = JSON.stringify(backupPayload, null, 2);
    const backupDir = `${FileSystem.documentDirectory || ''}backups/`;

    const info = await FileSystem.getInfoAsync(backupDir);
    if (!info.exists) {
      await FileSystem.makeDirectoryAsync(backupDir, { intermediates: true });
    }

    const filePath = `${backupDir}multiplication_master_backup_${Date.now()}.json`;
    await FileSystem.writeAsStringAsync(filePath, jsonString);

    return filePath;
  }

  /**
   * Validates and restores learning data from a local JSON string.
   */
  public async importBackup(jsonString: string): Promise<{ success: boolean; factsRestored: number }> {
    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(jsonString);
    } catch (e) {
      throw new Error('Invalid JSON format.');
    }

    const validationResult = BackupDataSchema.safeParse(parsedJson);
    if (!validationResult.success) {
      throw new Error(`Backup schema mismatch: ${validationResult.error.message}`);
    }

    const data = validationResult.data;
    const db = await getDatabase();

    await db.withTransactionAsync(async () => {
      // Restore user preferences
      await updateUserPreferences('local_user', data.preferences);

      // Restore mastery records
      for (const rec of data.masteryRecords) {
        await saveMasteryRecord(rec);
      }

      // Restore unlocked achievements
      for (const achId of data.unlockedAchievementIds) {
        await db.runAsync(
          'INSERT OR IGNORE INTO user_achievements (user_id, achievement_id, unlocked_at) VALUES (?, ?, ?)',
          'local_user',
          achId,
          Date.now()
        );
      }
    });

    return {
      success: true,
      factsRestored: data.masteryRecords.length,
    };
  }
}

export const localBackupService = new LocalBackupService();
