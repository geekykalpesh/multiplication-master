import { getDatabase } from '../index';
import { ACHIEVEMENTS, AchievementDefinition } from '../../../constants/achievements';

export interface UnlockedAchievementInfo {
  achievement: AchievementDefinition;
  unlockedAt: number;
}

export async function getUserAchievements(userId: string = 'local_user'): Promise<UnlockedAchievementInfo[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<{ achievement_id: string; unlocked_at: number }>(
    'SELECT achievement_id, unlocked_at FROM user_achievements WHERE user_id = ? ORDER BY unlocked_at DESC',
    userId
  );

  const map = new Map(ACHIEVEMENTS.map((a) => [a.id, a]));
  const results: UnlockedAchievementInfo[] = [];

  for (const r of rows) {
    const ach = map.get(r.achievement_id);
    if (ach) {
      results.push({
        achievement: ach,
        unlockedAt: r.unlocked_at,
      });
    }
  }

  return results;
}

export async function unlockAchievement(
  achievementId: string,
  userId: string = 'local_user'
): Promise<boolean> {
  const db = await getDatabase();
  const existing = await db.getFirstAsync<{ achievement_id: string }>(
    'SELECT achievement_id FROM user_achievements WHERE user_id = ? AND achievement_id = ?',
    userId,
    achievementId
  );

  if (existing) return false; // Already unlocked

  await db.runAsync(
    'INSERT INTO user_achievements (user_id, achievement_id, unlocked_at) VALUES (?, ?, ?)',
    userId,
    achievementId,
    Date.now()
  );
  return true;
}

export async function checkAndUnlockMilestones(params: {
  userId?: string;
  totalCorrect: number;
  streakDays: number;
  masteredTablesCount: number;
  isFirstLesson?: boolean;
  voiceSessionCompleted?: boolean;
  isPerfectSession?: boolean;
}): Promise<AchievementDefinition[]> {
  const userId = params.userId || 'local_user';
  const newlyUnlocked: AchievementDefinition[] = [];

  for (const ach of ACHIEVEMENTS) {
    let qualifies = false;
    switch (ach.requirement.type) {
      case 'first_lesson':
        if (params.isFirstLesson) qualifies = true;
        break;
      case 'first_table':
        if (params.masteredTablesCount >= 1) qualifies = true;
        break;
      case 'streak_days':
        if (params.streakDays >= ach.requirement.targetValue) qualifies = true;
        break;
      case 'total_questions':
        if (params.totalCorrect >= ach.requirement.targetValue) qualifies = true;
        break;
      case 'mastered_tables':
        if (params.masteredTablesCount >= ach.requirement.targetValue) qualifies = true;
        break;
      case 'voice_sessions':
        if (params.voiceSessionCompleted) qualifies = true;
        break;
      case 'perfect_accuracy_session':
        if (params.isPerfectSession) qualifies = true;
        break;
    }

    if (qualifies) {
      const unlocked = await unlockAchievement(ach.id, userId);
      if (unlocked) {
        newlyUnlocked.push(ach);
      }
    }
  }

  return newlyUnlocked;
}
