export const DB_NAME = 'multiplication_master.db';
export const CURRENT_DB_VERSION = 1;

export const CREATE_TABLES_SQL = `
PRAGMA foreign_keys = ON;

-- Users table (Local profile, no remote accounts)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL DEFAULT 'Learner',
  target_audience TEXT NOT NULL DEFAULT 'child',
  created_at INTEGER NOT NULL
);

-- User Preferences
CREATE TABLE IF NOT EXISTS user_preferences (
  user_id TEXT PRIMARY KEY,
  language TEXT NOT NULL DEFAULT 'en',
  learning_mode TEXT NOT NULL DEFAULT 'visual',
  theme TEXT NOT NULL DEFAULT 'light',
  daily_goal_minutes INTEGER NOT NULL DEFAULT 15,
  speech_rate REAL NOT NULL DEFAULT 1.0,
  speech_pitch REAL NOT NULL DEFAULT 1.0,
  mascot_enabled INTEGER NOT NULL DEFAULT 1,
  sound_effects_enabled INTEGER NOT NULL DEFAULT 1,
  haptic_feedback_enabled INTEGER NOT NULL DEFAULT 1,
  font_scale REAL NOT NULL DEFAULT 1.0,
  high_contrast INTEGER NOT NULL DEFAULT 0,
  reduced_motion INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Multiplication Facts (All pairs from 1x1 to 20x20)
CREATE TABLE IF NOT EXISTS multiplication_facts (
  id TEXT PRIMARY KEY,
  factor_a INTEGER NOT NULL,
  factor_b INTEGER NOT NULL,
  product INTEGER NOT NULL,
  difficulty_tier INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_facts_factors ON multiplication_facts(factor_a, factor_b);
CREATE INDEX IF NOT EXISTS idx_facts_tier ON multiplication_facts(difficulty_tier);

-- Mastery Records
CREATE TABLE IF NOT EXISTS mastery_records (
  fact_id TEXT PRIMARY KEY,
  consecutive_correct INTEGER NOT NULL DEFAULT 0,
  total_attempts INTEGER NOT NULL DEFAULT 0,
  total_correct INTEGER NOT NULL DEFAULT 0,
  average_latency_ms INTEGER NOT NULL DEFAULT 0,
  mastery_score REAL NOT NULL DEFAULT 0.0,
  is_mastered INTEGER NOT NULL DEFAULT 0,
  last_practiced_at INTEGER,
  FOREIGN KEY (fact_id) REFERENCES multiplication_facts(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_mastery_is_mastered ON mastery_records(is_mastered);

-- Spaced Repetition Schedule (SM-2 local schedule)
CREATE TABLE IF NOT EXISTS spaced_repetition_schedule (
  fact_id TEXT PRIMARY KEY,
  ease_factor REAL NOT NULL DEFAULT 2.5,
  interval_days INTEGER NOT NULL DEFAULT 0,
  repetition_count INTEGER NOT NULL DEFAULT 0,
  due_date INTEGER NOT NULL,
  last_reviewed_at INTEGER NOT NULL,
  FOREIGN KEY (fact_id) REFERENCES multiplication_facts(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_sr_due_date ON spaced_repetition_schedule(due_date);

-- Learning Sessions
CREATE TABLE IF NOT EXISTS learning_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  mode TEXT NOT NULL,
  started_at INTEGER NOT NULL,
  ended_at INTEGER,
  total_questions INTEGER NOT NULL DEFAULT 0,
  correct_count INTEGER NOT NULL DEFAULT 0,
  average_latency_ms INTEGER NOT NULL DEFAULT 0,
  accuracy_rate REAL NOT NULL DEFAULT 0.0,
  hints_used_count INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_sessions_user_time ON learning_sessions(user_id, started_at);

-- Question Attempts (Detailed log of every attempted question)
CREATE TABLE IF NOT EXISTS question_attempts (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  fact_id TEXT NOT NULL,
  question_type TEXT NOT NULL,
  prompt TEXT NOT NULL,
  user_answer INTEGER,
  expected_answer INTEGER NOT NULL,
  is_correct INTEGER NOT NULL,
  latency_ms INTEGER NOT NULL,
  hint_used INTEGER NOT NULL DEFAULT 0,
  input_mode TEXT NOT NULL DEFAULT 'touch',
  timestamp INTEGER NOT NULL,
  FOREIGN KEY (session_id) REFERENCES learning_sessions(id) ON DELETE CASCADE,
  FOREIGN KEY (fact_id) REFERENCES multiplication_facts(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_attempts_session ON question_attempts(session_id);
CREATE INDEX IF NOT EXISTS idx_attempts_fact ON question_attempts(fact_id);

-- User Lesson Progress
CREATE TABLE IF NOT EXISTS user_lesson_progress (
  lesson_id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'not_started',
  stars INTEGER NOT NULL DEFAULT 0,
  best_score INTEGER NOT NULL DEFAULT 0,
  last_attempt_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Achievements Definitions
CREATE TABLE IF NOT EXISTS achievements (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  icon TEXT NOT NULL,
  target_value INTEGER NOT NULL
);

-- User Achievements (Unlocked badges)
CREATE TABLE IF NOT EXISTS user_achievements (
  user_id TEXT NOT NULL,
  achievement_id TEXT NOT NULL,
  unlocked_at INTEGER NOT NULL,
  PRIMARY KEY (user_id, achievement_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (achievement_id) REFERENCES achievements(id) ON DELETE CASCADE
);

-- Learning Streaks (Daily activity log)
CREATE TABLE IF NOT EXISTS learning_streaks (
  user_id TEXT NOT NULL,
  activity_date TEXT NOT NULL, -- YYYY-MM-DD
  minutes_spent INTEGER NOT NULL DEFAULT 0,
  questions_completed INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, activity_date),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Installed Offline Speech Models
CREATE TABLE IF NOT EXISTS installed_speech_models (
  model_id TEXT PRIMARY KEY,
  language TEXT NOT NULL,
  name TEXT NOT NULL,
  version TEXT NOT NULL,
  file_path TEXT NOT NULL,
  checksum TEXT NOT NULL,
  size_bytes INTEGER NOT NULL,
  installed_at INTEGER NOT NULL,
  is_verified INTEGER NOT NULL DEFAULT 0
);
`;
