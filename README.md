# Multiplication Master

**Multiplication Master** is a complete, offline-first mobile application engineered to teach multiplication tables, mental mathematics shortcuts, and automatic numerical recall from absolute zero.

Built with **React Native (Expo SDK 58)**, **TypeScript**, **Expo SQLite**, and **Zustand**, the application operates entirely on-device without cloud servers, logins, telemetry, or remote dependencies.

---

## 🌟 Key Highlights

- **🔒 100% Offline & Private**: Zero mandatory accounts, no cloud database, no tracking, and no external AI API calls. All 400 multiplication facts ($1 \times 1$ to $20 \times 20$), session attempts, and mastery records live exclusively in local SQLite on the user's phone.
- **🧠 Cognitive Learning Science**:
  - **Spaced Repetition (SM-2 variant)**: Scheduled review intervals (1 day, 3 days, 7 days, 14 days, 30 days) to prevent memory decay.
  - **Recall Latency Benchmark**: Response time is treated as a learning signal to separate conscious calculation (>4s) from automatic recall (<2.5s).
  - **Weak-Fact Remediation**: Automatically identifies struggling multiplication pairs and generates targeted drills and reverse operand practice ($7 \times 8 \rightarrow 8 \times 7$, $56 \div 7$).
  - **Adaptive Difficulty**: Dynamically adapts from visual arrays and repeated additions up to two-digit mental shortcuts and real-world INR word problems.
- **🎙️ Hands-Free Voice Practice**:
  - Practice without touching or looking at the phone.
  - Microphone strictly activates **after** the tutor finishes speaking (preventing audio echo loops).
  - Handles three answer states: `CORRECT`, `INCORRECT`, and `UNCLEAR` (unclear speech prompts a repeat without punishing the learner).
  - Offline bilingual number parser handles both English (*"one hundred thirty-six"*, *"eighty-four"*) and Hindi (*"एक सौ छत्तीस"*, *"चौरासी"*, *"पचपन"*, plus transliterated Hinglish).
- **♿ Inclusive & Fully Accessible**:
  - **Children Mode**: Animated arrays, friendly mascot (*Numi*), celebration feedback, and bite-sized rewards.
  - **Adult Mode**: Professional, distraction-free interface, practical real-world INR currency problems, and zero childish language.
  - **Audio-First / Blind Learners**: Dedicated Audio Focus Mode with screen-reader (TalkBack & VoiceOver) live region announcements, large touch targets (WCAG AAA), high-contrast theme, dynamic font scaling (1.0x to 1.5x), and reduced motion.
- **💾 Local Backup & Restore**: Export and import complete learning history and preferences as validated JSON files using runtime Zod schema verification.

---

## 🏗️ Architecture & Project Structure

```
multiplication-master/
├── app/                              # Expo Router file-based screens
│   ├── _layout.tsx                   # Root layout, SQLite initialization & Theme provider
│   ├── index.tsx                     # Welcome & gateway entry screen
│   ├── onboarding/                   # 6-step personalized onboarding flow
│   │   ├── index.tsx                 # Step 1: Welcome & privacy guarantee
│   │   ├── language.tsx              # Step 2: Language selection (English / Hindi)
│   │   ├── audience.tsx              # Step 3: Audience profile (Child, Adult, Visually Impaired)
│   │   ├── mode.tsx                  # Step 4: Learning mode (Visual, Audio Focus, Hands-Free)
│   │   ├── assessment.tsx            # Step 5: Gentle diagnostic assessment
│   │   └── speech-setup.tsx          # Step 6: Optional offline speech model download
│   ├── (tabs)/                       # Main application tab navigation
│   │   ├── _layout.tsx               # Tab bar layout
│   │   ├── index.tsx                 # Home Dashboard (Stats, streak, reviews due, quick practice)
│   │   ├── journey.tsx               # Curriculum Roadmap (Levels 1 to 8)
│   │   ├── practice.tsx              # Practice Hub & Table Selector
│   │   ├── progress.tsx              # Analytics, Recall Mastery %, & Performance KPIs
│   │   └── settings.tsx              # Settings & Preferences Hub
│   ├── lessons/
│   │   └── [id].tsx                  # Interactive visual & audio lesson player
│   ├── tables/
│   │   └── [num].tsx                 # Individual Table 1 to 20 explorer with audio pronunciation
│   ├── practice/
│   │   ├── session.tsx               # Interactive visual session (Multiple choice & keypad)
│   │   ├── voice.tsx                 # Hands-free voice practice session
│   │   ├── audio-focus.tsx           # Dedicated audio-first companion for blind learners
│   │   └── results.tsx               # Session results & recall speed breakdown
│   ├── progress/
│   │   ├── weak-facts.tsx            # Targeted drill for struggling multiplication facts
│   │   ├── spaced-repetition.tsx     # Spaced Repetition due queue (SM-2 intervals)
│   │   └── achievements.tsx          # 11+ local milestone achievements & badges
│   └── settings/
│       ├── accessibility.tsx         # High contrast, font scale, reduced motion
│       ├── voice.tsx                 # Speech rate, pitch, audio test
│       ├── speech-models.tsx         # Offline Vosk Speech Model Manager
│       ├── backup.tsx                # Local JSON backup & restore
│       └── about.tsx                 # Privacy guarantee & offline declaration
│
├── src/
│   ├── components/
│   │   ├── common/                   # AccessibleText, AccessibleButton, Card, Badge, Mascot, ProgressBar
│   │   ├── visual-math/              # ArrayVisualizer, GroupingVisualizer
│   │   └── audio/                    # MicrophoneIndicator
│   ├── constants/                    # Curriculum data (Levels 1-8), Achievements, Theme tokens, Vosk models
│   ├── engines/
│   │   ├── number-parser/            # English & Hindi spoken number word parsers
│   │   ├── answer-validation/        # Deterministic equality & latency validator
│   │   ├── question-engine/          # Deterministic question generator (13 question types)
│   │   ├── learning-engine/          # Mastery calculator, weak fact detector, adaptive difficulty
│   │   ├── spaced-repetition/        # SuperMemo SM-2 local algorithm
│   │   └── voice-session/            # Hands-free voice interaction state machine
│   ├── services/
│   │   ├── database/                 # SQLite schema, migrations, and repositories
│   │   ├── speech/                   # TTS service, Speech recognizer, SpeechModelManager
│   │   └── storage/                  # LocalBackupService with Zod validation
│   ├── stores/                       # Zustand stores (userStore, learningStore, voiceStore)
│   ├── types/                        # TypeScript type definitions
│   └── hooks/                        # useTheme hook
└── tests/
    └── unit/                         # Comprehensive Jest test suite (26 passing tests)
```

---

## 📚 Structured Curriculum (Levels 1 to 8)

1. **Level 1: Number Foundations**: Counting, number recognition, addition, repeated addition ($2 + 2 + 2 = 6 \rightarrow 3 \times 2 = 6$), and skip counting by 2s and 5s.
2. **Level 2: Understanding Multiplication**: Visual groupings (baskets and apples), rows and columns, array grid layout, and the commutative property ($3 \times 4 = 4 \times 3 = 12$).
3. **Level 3: Multiplication Tables 1 to 20**: Full tables from 1 to 20 with spoken pronunciations, skip-counting tracks, and missing-factor drills.
4. **Level 4: Mixed Multiplication Practice**: Randomized facts breaking linear rote recitation.
5. **Level 5: Reverse Multiplication**: Division relationships (*Which number multiplied by 7 gives 56?* $56 \div 7 = ?$).
6. **Level 6: Missing-Number Equations**: Algebraic equations ($8 \times ? = 72$, $? \times 6 = 48$).
7. **Level 7: Mental Mathematics Shortcuts**:
   - Distributive breakdown: $17 \times 8 = (10 \times 8) + (7 \times 8) = 80 + 56 = 136$
   - Multiplying by 9: $(n \times 10) - n$
   - Multiplying by 11: Sandwich addition ($14 \times 11 = 154$)
   - Multiplying by 25 and 50, doubling & halving.
8. **Level 8: Real-World Mathematics**: Everyday market purchases in INR (₹) (e.g. *7 notebooks costing ₹25 each*), shipping crates, packaging, and time/distance calculations.

---

## 🧪 Testing & Verification

The application includes an extensive automated test suite covering deterministic arithmetic, number parsing, spaced repetition, and answer validation.

```bash
# Run the complete test suite
npm test

# Run strict TypeScript type verification (zero errors)
npm run typecheck
```

### Test Coverage Results
- `numberParser.test.ts`: English single digits, teens, compound numbers, hundreds, digits fallback, Devanagari Hindi, Romanized Hindi (*"ek sau chhattis"* $\rightarrow$ 136, *"chauraasi"* $\rightarrow$ 84).
- `answerValidator.test.ts`: Accurate comparison, latency classification (instant <2s, fluent <4s, calculated <8s, slow), unclear speech handling without punishment, Hindi response generator.
- `questionEngine.test.ts`: Direct multiplication, reverse multiplication, missing-factor equations, repeated addition, real-world INR word problems, balanced multiple-choice distractors.
- `masteryAndSpacedRepetition.test.ts`: SM-2 intervals (1d $\rightarrow$ 3d $\rightarrow$ 7d $\rightarrow$ 14d $\rightarrow$ 30d), error interval reset, multi-attempt mastery score threshold (requiring $\ge 4$ consecutive unprompted successes), weak fact detection with reverse operand drill pairs, and adaptive difficulty.

---

## 🚀 Running the Application

```bash
# Start the Expo development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run in Web browser
npm run web
```

---

## 📄 License

MIT License. Engineered for offline educational empowerment and accessible mathematical fluency.
