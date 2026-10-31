import { Language } from '../../types/database';
import { parseEnglishNumber } from './englishParser';
import { parseHindiNumber } from './hindiParser';

export interface ParseResult {
  number: number | null;
  detectedLanguage: Language | null;
  confidence: number; // 0.0 to 1.0
  rawInput: string;
}

/**
 * Unified spoken number parser that parses spoken transcripts in either English or Hindi,
 * or tries preferred language first and falls back to the other language.
 */
export function parseSpokenNumber(
  input: string,
  preferredLanguage: Language = 'en'
): ParseResult {
  if (!input || typeof input !== 'string') {
    return {
      number: null,
      detectedLanguage: null,
      confidence: 0,
      rawInput: input || '',
    };
  }

  const trimmed = input.trim();

  // Try preferred language first
  if (preferredLanguage === 'hi') {
    const hindiResult = parseHindiNumber(trimmed);
    if (hindiResult !== null) {
      return {
        number: hindiResult,
        detectedLanguage: 'hi',
        confidence: 0.95,
        rawInput: trimmed,
      };
    }
    const englishResult = parseEnglishNumber(trimmed);
    if (englishResult !== null) {
      return {
        number: englishResult,
        detectedLanguage: 'en',
        confidence: 0.85,
        rawInput: trimmed,
      };
    }
  } else {
    // Preferred is English
    const englishResult = parseEnglishNumber(trimmed);
    if (englishResult !== null) {
      return {
        number: englishResult,
        detectedLanguage: 'en',
        confidence: 0.95,
        rawInput: trimmed,
      };
    }
    const hindiResult = parseHindiNumber(trimmed);
    if (hindiResult !== null) {
      return {
        number: hindiResult,
        detectedLanguage: 'hi',
        confidence: 0.85,
        rawInput: trimmed,
      };
    }
  }

  return {
    number: null,
    detectedLanguage: null,
    confidence: 0,
    rawInput: trimmed,
  };
}

export { parseEnglishNumber, parseHindiNumber };
