const UNITS: Record<string, number> = {
  zero: 0,
  nil: 0,
  nought: 0,
  one: 1,
  won: 1,
  two: 2,
  to: 2,
  too: 2,
  three: 3,
  tree: 3,
  four: 4,
  for: 4,
  fore: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  ate: 8,
  nine: 9,
  ten: 10,
  tin: 10,
  eleven: 11,
  twelve: 12,
  thirteen: 13,
  fourteen: 14,
  fifteen: 15,
  sixteen: 16,
  seventeen: 17,
  eighteen: 18,
  nineteen: 19,
};

const TENS: Record<string, number> = {
  twenty: 20,
  thirty: 30,
  dirty: 30, // acoustic near-miss
  forty: 40,
  fourty: 40,
  fifty: 50,
  sixty: 60,
  seventy: 70,
  eighty: 80,
  ninety: 90,
};

const MULTIPLIERS: Record<string, number> = {
  hundred: 100,
  hundreds: 100,
  thousand: 1000,
  thousands: 1000,
};

/**
 * Parses spoken English text containing number words or digits into a single number.
 * Returns null if no valid number can be derived.
 */
export function parseEnglishNumber(input: string): number | null {
  if (!input || typeof input !== 'string') return null;

  const cleaned = input
    .toLowerCase()
    .replace(/[,\-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // If already directly contains digits like "136"
  const directDigits = cleaned.match(/\b\d+\b/);
  if (directDigits) {
    const parsed = parseInt(directDigits[0], 10);
    if (!isNaN(parsed)) return parsed;
  }

  const tokens = cleaned.split(' ').filter((t) => t.length > 0 && t !== 'and');
  if (tokens.length === 0) return null;

  let total = 0;
  let currentGroup = 0;
  let recognizedAny = false;

  for (const token of tokens) {
    if (UNITS[token] !== undefined) {
      currentGroup += UNITS[token];
      recognizedAny = true;
    } else if (TENS[token] !== undefined) {
      currentGroup += TENS[token];
      recognizedAny = true;
    } else if (MULTIPLIERS[token] !== undefined) {
      const mult = MULTIPLIERS[token];
      if (currentGroup === 0) currentGroup = 1;
      if (mult === 1000) {
        total += currentGroup * 1000;
        currentGroup = 0;
      } else if (mult === 100) {
        currentGroup = currentGroup * 100;
      }
      recognizedAny = true;
    } else {
      // Check if this token is a numeric string (e.g. "84")
      const num = parseInt(token, 10);
      if (!isNaN(num)) {
        currentGroup += num;
        recognizedAny = true;
      }
    }
  }

  if (!recognizedAny) return null;

  return total + currentGroup;
}
