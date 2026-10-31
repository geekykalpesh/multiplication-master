// Hindi numbers dictionary (Devanagari and Romanized Transliteration)
const HINDI_NUMBER_MAP: Record<string, number> = {
  // 0 - 10
  शून्य: 0,
  shunya: 0,
  zero: 0,
  एक: 1,
  ek: 1,
  ik: 1,
  दो: 2,
  do: 2,
  तीन: 3,
  teen: 3,
  tin: 3,
  चार: 4,
  chaar: 4,
  char: 4,
  पाँच: 5,
  पांच: 5,
  paanch: 5,
  panch: 5,
  छह: 6,
  छः: 6,
  cheh: 6,
  chhe: 6,
  सात: 7,
  saat: 7,
  sat: 7,
  आठ: 8,
  aath: 8,
  ath: 8,
  नौ: 9,
  nau: 9,
  दस: 10,
  das: 10,

  // 11 - 20
  ग्यारह: 11,
  gyarah: 11,
  gyara: 11,
  बारह: 12,
  baarah: 12,
  barah: 12,
  तेरह: 13,
  terah: 13,
  tera: 13,
  चौदह: 14,
  chaudah: 14,
  chauda: 14,
  पंद्रह: 15,
  pandrah: 15,
  pandra: 15,
  सोलह: 16,
  solah: 16,
  sola: 16,
  सत्रह: 17,
  satrah: 17,
  satra: 17,
  अठारह: 18,
  athaarah: 18,
  athara: 18,
  उन्नीस: 19,
  unnees: 19,
  unnis: 19,
  बीस: 20,
  bees: 20,
  bis: 20,

  // 21 - 30
  इक्कीस: 21,
  ikkees: 21,
  बाईस: 22,
  baees: 22,
  तेईस: 23,
  tees: 23,
  taees: 23,
  चौबीस: 24,
  chaubees: 24,
  पच्चीस: 25,
  pachchees: 25,
  pachis: 25,
  छब्बीस: 26,
  chhabbees: 26,
  सत्ताईस: 27,
  sattaees: 27,
  अट्ठाईस: 28,
  atthaees: 28,
  उनतीस: 29,
  unthees: 29,
  तीस: 30,
  tees_: 30,

  // 31 - 40
  इकत्तीस: 31,
  ikattis: 31,
  बत्तीस: 32,
  battis: 32,
  तैंतीस: 33,
  taintis: 33,
  चौंतीस: 34,
  chauntis: 34,
  पैंतीस: 35,
  paintis: 35,
  छत्तीस: 36,
  chhattis: 36,
  chattis: 36,
  सैंतीस: 37,
  saintis: 37,
  अड़तीस: 38,
  adtis: 38,
  उनतालीस: 39,
  untalis: 39,
  चालीस: 40,
  chalis: 40,

  // 41 - 50
  इकतालीस: 41,
  iktalis: 41,
  बयालीस: 42,
  bayalis: 42,
  तैंतालीस: 43,
  taintalis: 43,
  चवालीस: 44,
  chawalis: 44,
  पैंतालीस: 45,
  paintalis: 45,
  छियालीस: 46,
  chhiyalis: 46,
  सैंतालीस: 47,
  saintalis: 47,
  अड़तालीस: 48,
  adtalis: 48,
  उनचास: 49,
  unchas: 49,
  पचास: 50,
  pachaas: 50,
  pachas: 50,

  // 51 - 60
  इक्यावन: 51,
  ikyawan: 51,
  बावन: 52,
  baawan: 52,
  तिरेपन: 53,
  tirepan: 53,
  चौवन: 54,
  chauwan: 54,
  पचपन: 55,
  pachpan: 55,
  छप्पन: 56,
  chhappan: 56,
  सत्तावन: 57,
  sattawan: 57,
  अट्ठावन: 58,
  atthaawan: 58,
  उनसठ: 59,
  unsath: 59,
  साठ: 60,
  saath: 60,
  sath: 60,

  // 61 - 70
  इकसठ: 61,
  iksath: 61,
  बासठ: 62,
  baasath: 62,
  तिरसठ: 63,
  tirsath: 63,
  चौंसठ: 64,
  chaunsath: 64,
  पैंसठ: 65,
  painsath: 65,
  छियासठ: 66,
  chhiyasath: 66,
  सरसठ: 67,
  sarsath: 67,
  अड़सठ: 68,
  adsath: 68,
  उनहत्तर: 69,
  unhattar: 69,
  सत्तर: 70,
  sattar: 70,

  // 71 - 80
  इकहत्तर: 71,
  ikhattar: 71,
  बहत्तर: 72,
  bahattar: 72,
  तिहत्तर: 73,
  tihattar: 73,
  चौहत्तर: 74,
  chauhattar: 74,
  पचहत्तर: 75,
  pachhattar: 75,
  छिहत्तर: 76,
  chhihattar: 76,
  सतहत्तर: 77,
  sathattar: 77,
  अठहत्तर: 78,
  athhattar: 78,
  उन्नासी: 79,
  unnasi: 79,
  अस्सी: 80,
  assee: 80,
  assi: 80,

  // 81 - 90
  इक्यासी: 81,
  ikyasi: 81,
  बयासी: 82,
  bayasi: 82,
  तिरासी: 83,
  tirasi: 83,
  चौरासी: 84,
  chaurasi: 84,
  chauraasi: 84,
  पचासी: 85,
  pachasi: 85,
  छियासी: 86,
  chhiyasi: 86,
  सत्तासी: 87,
  sattasi: 87,
  अट्ठासी: 88,
  atthasi: 88,
  नवासी: 89,
  nawasi: 89,
  नब्बे: 90,
  nabbe: 90,

  // 91 - 100
  इक्यानवे: 91,
  ikyanwe: 91,
  बानवे: 92,
  baanwe: 92,
  तिरानवे: 93,
  tiranwe: 93,
  चौरानवे: 94,
  chauranwe: 94,
  पचानवे: 95,
  pachanwe: 95,
  छियानवे: 96,
  chhiyanwe: 96,
  सत्तानवे: 97,
  sattanwe: 97,
  अट्ठानवे: 98,
  atthanwe: 98,
  निन्यानवे: 99,
  ninyanwe: 99,
  सौ: 100,
  sau: 100,
  so: 100,
  हज़ार: 1000,
  हजार: 1000,
  hazar: 1000,
  hazaar: 1000,
};

/**
 * Parses spoken Hindi text (in Devanagari or Romanized transliteration).
 * Supports numbers up to 1000 (e.g. "एक सौ छत्तीस" -> 136, "चौरासी" -> 84).
 */
export function parseHindiNumber(input: string): number | null {
  if (!input || typeof input !== 'string') return null;

  const cleaned = input
    .toLowerCase()
    .replace(/[,\-_।]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // If already directly contains digits
  const directDigits = cleaned.match(/\b\d+\b/);
  if (directDigits) {
    const parsed = parseInt(directDigits[0], 10);
    if (!isNaN(parsed)) return parsed;
  }

  // Check direct single word lookup (e.g. "चौरासी", "chaurasi", "पचपन")
  if (HINDI_NUMBER_MAP[cleaned] !== undefined) {
    return HINDI_NUMBER_MAP[cleaned];
  }

  const tokens = cleaned.split(' ').filter((t) => t.length > 0 && t !== 'aur');
  if (tokens.length === 0) return null;

  let total = 0;
  let currentGroup = 0;
  let recognizedAny = false;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const val = HINDI_NUMBER_MAP[token];

    if (val !== undefined) {
      recognizedAny = true;
      if (val === 100) {
        // "sau"
        const mult = currentGroup === 0 ? 1 : currentGroup;
        total += mult * 100;
        currentGroup = 0;
      } else if (val === 1000) {
        // "hazar"
        const mult = currentGroup === 0 ? 1 : currentGroup;
        total += mult * 1000;
        currentGroup = 0;
      } else {
        currentGroup += val;
      }
    } else {
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
