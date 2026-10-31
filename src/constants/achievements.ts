export interface AchievementDefinition {
  id: string;
  title: {
    en: string;
    hi: string;
  };
  description: {
    en: string;
    hi: string;
  };
  icon: string;
  category: 'milestone' | 'streak' | 'mastery' | 'voice' | 'mental_math';
  requirement: {
    type:
      | 'first_lesson'
      | 'first_table'
      | 'streak_days'
      | 'total_questions'
      | 'mastered_tables'
      | 'voice_sessions'
      | 'shortcuts_completed'
      | 'perfect_accuracy_session';
    targetValue: number;
  };
}

export const ACHIEVEMENTS: AchievementDefinition[] = [
  {
    id: 'first_step',
    title: {
      en: 'First Step',
      hi: 'पहला कदम',
    },
    description: {
      en: 'Completed your first mathematics lesson.',
      hi: 'अपना पहला गणित पाठ पूरा किया।',
    },
    icon: '🌱',
    category: 'milestone',
    requirement: { type: 'first_lesson', targetValue: 1 },
  },
  {
    id: 'first_table_master',
    title: {
      en: 'Table Pioneer',
      hi: 'तालिका पथप्रदर्शक',
    },
    description: {
      en: 'Learned your first full multiplication table.',
      hi: 'अपनी पहली पूरी पहाड़ा तालिका सीखी।',
    },
    icon: '🏆',
    category: 'mastery',
    requirement: { type: 'first_table', targetValue: 1 },
  },
  {
    id: 'streak_3_days',
    title: {
      en: 'Consistent Thinker',
      hi: 'नियमित विचारक',
    },
    description: {
      en: 'Practiced mathematics 3 days in a row.',
      hi: 'लगातार 3 दिन गणित का अभ्यास किया।',
    },
    icon: '🔥',
    category: 'streak',
    requirement: { type: 'streak_days', targetValue: 3 },
  },
  {
    id: 'streak_7_days',
    title: {
      en: 'Weekly Champion',
      hi: 'साप्ताहिक विजेता',
    },
    description: {
      en: 'Maintained a 7-day practice streak.',
      hi: '7 दिनों तक लगातार अभ्यास जारी रखा।',
    },
    icon: '⚡',
    category: 'streak',
    requirement: { type: 'streak_days', targetValue: 7 },
  },
  {
    id: 'centurion',
    title: {
      en: 'Century Club',
      hi: 'शतक क्लब',
    },
    description: {
      en: 'Answered 100 multiplication questions correctly.',
      hi: '100 गुणन प्रश्नों का सही उत्तर दिया।',
    },
    icon: '💯',
    category: 'milestone',
    requirement: { type: 'total_questions', targetValue: 100 },
  },
  {
    id: 'five_tables_master',
    title: {
      en: 'Pentagon of Tables',
      hi: 'पंचतालिका महारथी',
    },
    description: {
      en: 'Mastered 5 full multiplication tables.',
      hi: '5 संपूर्ण पहाड़े पूरी तरह याद किए।',
    },
    icon: '⭐',
    category: 'mastery',
    requirement: { type: 'mastered_tables', targetValue: 5 },
  },
  {
    id: 'ten_tables_master',
    title: {
      en: 'Decimal Dynamo',
      hi: 'दशक सम्राट',
    },
    description: {
      en: 'Mastered tables from 1 through 10.',
      hi: '1 से 10 तक के पहाड़े सिद्ध किए।',
    },
    icon: '🌟',
    category: 'mastery',
    requirement: { type: 'mastered_tables', targetValue: 10 },
  },
  {
    id: 'grand_master_20',
    title: {
      en: 'Multiplication Master',
      hi: 'गुणन शिरोमणि',
    },
    description: {
      en: 'Achieved full recall mastery up to Table 20.',
      hi: '20 तक के सभी पहाड़ों में त्वरित स्मरण हासिल किया।',
    },
    icon: '👑',
    category: 'mastery',
    requirement: { type: 'mastered_tables', targetValue: 20 },
  },
  {
    id: 'voice_pioneer',
    title: {
      en: 'Voice Virtuoso',
      hi: 'ध्वनि महारथी',
    },
    description: {
      en: 'Completed 5 hands-free voice practice sessions.',
      hi: '5 हैंड्स-फ्री वॉयस अभ्यास सत्र सफलतापूर्वक पूरे किए।',
    },
    icon: '🎙️',
    category: 'voice',
    requirement: { type: 'voice_sessions', targetValue: 5 },
  },
  {
    id: 'mental_math_starter',
    title: {
      en: 'Shortcut Explorer',
      hi: 'ट्रिक खोजकर्ता',
    },
    description: {
      en: 'Learned the mental math tricks for 9 and 11.',
      hi: '9 और 11 के मानसिक गणित के तरीके सीखे।',
    },
    icon: '🧠',
    category: 'mental_math',
    requirement: { type: 'shortcuts_completed', targetValue: 2 },
  },
  {
    id: 'sharpshooter',
    title: {
      en: 'Flawless Focus',
      hi: 'सटीक एकाग्रता',
    },
    description: {
      en: 'Completed a 15+ question session with 100% accuracy.',
      hi: '15+ प्रश्नों का सत्र 100% सटीकता के साथ पूरा किया।',
    },
    icon: '🎯',
    category: 'mastery',
    requirement: { type: 'perfect_accuracy_session', targetValue: 1 },
  },
];
