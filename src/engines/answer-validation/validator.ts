import { TargetAudience, Language } from '../../types/database';
import { RecognitionResultStatus } from '../../types/speech';

export interface ValidationResult {
  status: RecognitionResultStatus;
  isCorrect: boolean;
  userAnswer: number | null;
  expectedAnswer: number;
  feedbackText: string;
  feedbackSpeech: string;
  recallSpeedCategory: 'instant' | 'fluent' | 'calculated' | 'slow';
}

export function validateAnswer(params: {
  userAnswer: number | null;
  expectedAnswer: number;
  latencyMs: number;
  audience: TargetAudience;
  language: Language;
}): ValidationResult {
  const { userAnswer, expectedAnswer, latencyMs, audience, language } = params;

  let speedCategory: 'instant' | 'fluent' | 'calculated' | 'slow' = 'calculated';
  if (latencyMs < 2000) {
    speedCategory = 'instant';
  } else if (latencyMs < 4000) {
    speedCategory = 'fluent';
  } else if (latencyMs < 8000) {
    speedCategory = 'calculated';
  } else {
    speedCategory = 'slow';
  }

  // If answer was not parsed / null
  if (userAnswer === null || isNaN(userAnswer)) {
    const feedbackEn =
      language === 'hi'
        ? 'मैं समझ नहीं पाया। क्या आप दोबारा कह सकते हैं?'
        : "I couldn't quite catch that. Could you please say it again?";

    return {
      status: 'unclear',
      isCorrect: false,
      userAnswer: null,
      expectedAnswer,
      feedbackText: feedbackEn,
      feedbackSpeech: feedbackEn,
      recallSpeedCategory: speedCategory,
    };
  }

  const isCorrect = userAnswer === expectedAnswer;

  if (isCorrect) {
    let text = '';
    let speech = '';

    if (language === 'hi') {
      if (audience === 'child') {
        text = `शानदार! सही उत्तर है: ${expectedAnswer}`;
        speech = `बहुत बढ़िया! सही उत्तर है ${expectedAnswer}।`;
      } else {
        text = `बिल्कुल सही: ${expectedAnswer}`;
        speech = `सही उत्तर, ${expectedAnswer}।`;
      }
    } else {
      // English
      if (audience === 'child') {
        text = `Awesome job! That's correct: ${expectedAnswer}`;
        speech = `Awesome job! That's correct, ${expectedAnswer}.`;
      } else {
        text = `Correct: ${expectedAnswer}`;
        speech = `Correct, ${expectedAnswer}.`;
      }
    }

    return {
      status: 'correct',
      isCorrect: true,
      userAnswer,
      expectedAnswer,
      feedbackText: text,
      feedbackSpeech: speech,
      recallSpeedCategory: speedCategory,
    };
  } else {
    // Incorrect answer
    let text = '';
    let speech = '';

    if (language === 'hi') {
      if (audience === 'child') {
        text = `कोई बात नहीं! सही उत्तर ${expectedAnswer} है।`;
        speech = `कोई बात नहीं! सही उत्तर ${expectedAnswer} है। आइए फिर से कोशिश करें।`;
      } else {
        text = `समीक्षा: सही उत्तर ${expectedAnswer} है।`;
        speech = `समीक्षा करें, सही उत्तर ${expectedAnswer} है।`;
      }
    } else {
      // English
      if (audience === 'child') {
        text = `Not quite, but good try! The correct answer is ${expectedAnswer}.`;
        speech = `Not quite, but good try! The answer is ${expectedAnswer}. Let's keep going.`;
      } else {
        text = `Review: the correct answer is ${expectedAnswer}.`;
        speech = `The correct answer is ${expectedAnswer}.`;
      }
    }

    return {
      status: 'incorrect',
      isCorrect: false,
      userAnswer,
      expectedAnswer,
      feedbackText: text,
      feedbackSpeech: speech,
      recallSpeedCategory: speedCategory,
    };
  }
}
