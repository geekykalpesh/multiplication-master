export type CurriculumLevelId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface CurriculumLevel {
  levelNumber: CurriculumLevelId;
  titleKey: string;
  descriptionKey: string;
  title: {
    en: string;
    hi: string;
  };
  description: {
    en: string;
    hi: string;
  };
  icon: string;
  estimatedMinutes: number;
  lessons: CurriculumLesson[];
}

export interface CurriculumLesson {
  id: string;
  levelNumber: CurriculumLevelId;
  lessonIndex: number;
  title: {
    en: string;
    hi: string;
  };
  subtitle: {
    en: string;
    hi: string;
  };
  type: 'concept' | 'table' | 'practice' | 'shortcut' | 'real_world';
  targetTable?: number; // e.g. 7 for table 7
  factors?: [number, number];
  content: {
    storyText?: { en: string; hi: string };
    repeatedAdditionFormula?: string;
    multiplicationFormula?: string;
    explanation: { en: string; hi: string };
    audioScript: { en: string; hi: string };
    visualGroups?: { groups: number; items: number; emoji: string };
  };
}

export interface UserLessonProgress {
  lessonId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  stars: number; // 0 to 3
  bestScore: number;
  lastAttemptAt: number;
}
