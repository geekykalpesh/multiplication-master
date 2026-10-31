import { GeneratedQuestion, QuestionType } from '../../types/database';

export interface QuestionGeneratorOptions {
  tables: number[]; // e.g. [7] or [1,2,3,4,5,6,7,8,9,10]
  allowedTypes?: QuestionType[];
  maxFactor?: number; // default 20
  targetWeakFact?: { factorA: number; factorB: number };
}

const REAL_WORLD_SCENARIOS = [
  { itemEn: 'apples', itemHi: 'सेब', containerEn: 'baskets', containerHi: 'टोकरियाँ', unitCost: 15 },
  { itemEn: 'chocolates', itemHi: 'चॉकलेट', containerEn: 'boxes', containerHi: 'डिब्बे', unitCost: 20 },
  { itemEn: 'pencils', itemHi: 'पेंसिलें', containerEn: 'packets', containerHi: 'पैकेट', unitCost: 5 },
  { itemEn: 'books', itemHi: 'किताबें', containerEn: 'shelves', containerHi: 'अलमारियाँ', unitCost: 25 },
  { itemEn: 'sweets', itemHi: 'लड्डू', containerEn: 'plates', containerHi: 'थालियाँ', unitCost: 10 },
  { itemEn: 'notebooks', itemHi: 'कॉपियाँ', containerEn: 'bundles', containerHi: 'बंडल', unitCost: 30 },
];

/**
 * Deterministically generates balanced distractor options for multiple choice questions.
 */
function generateDistractors(correctAnswer: number, factorA: number, factorB: number): number[] {
  const set = new Set<number>([correctAnswer]);
  
  // Plausible errors:
  // 1. Off by factorA (e.g. 7 x 7 instead of 7 x 8)
  if (correctAnswer - factorA > 0) set.add(correctAnswer - factorA);
  set.add(correctAnswer + factorA);
  
  // 2. Off by factorB
  if (correctAnswer - factorB > 0) set.add(correctAnswer - factorB);
  set.add(correctAnswer + factorB);

  // 3. Addition confusion (factorA + factorB)
  if (factorA + factorB !== correctAnswer && factorA + factorB > 0) {
    set.add(factorA + factorB);
  }

  // 4. Inversion or close numbers (+2, -2, +10, -10)
  const variants = [correctAnswer + 2, correctAnswer - 2, correctAnswer + 10, correctAnswer - 4];
  for (const v of variants) {
    if (v > 0 && set.size < 4) {
      set.add(v);
    }
  }

  // Ensure exactly 4 options
  let fallback = correctAnswer + 1;
  while (set.size < 4) {
    set.add(fallback);
    fallback += 3;
  }

  const list = Array.from(set).slice(0, 4);
  // Deterministic shuffle using factors
  return list.sort(() => ((factorA * 31 + factorB * 17) % 3) - 1);
}

export function generateQuestion(options: QuestionGeneratorOptions): GeneratedQuestion {
  const { tables, allowedTypes, maxFactor = 20, targetWeakFact } = options;

  let factorA: number;
  let factorB: number;

  if (targetWeakFact) {
    factorA = targetWeakFact.factorA;
    factorB = targetWeakFact.factorB;
  } else {
    // Pick table from allowed tables
    const tableList = tables.length > 0 ? tables : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    factorA = tableList[Math.floor(Math.random() * tableList.length)];
    factorB = Math.floor(Math.random() * maxFactor) + 1; // 1 to maxFactor
  }

  const product = factorA * factorB;
  const factId = `${factorA}x${factorB}`;

  const typesPool: QuestionType[] = allowedTypes && allowedTypes.length > 0
    ? allowedTypes
    : ['direct', 'reverse', 'missing_second', 'multiple_choice', 'repeated_addition'];

  const type = typesPool[Math.floor(Math.random() * typesPool.length)];
  const qId = `q_${factId}_${type}_${Date.now()}`;

  switch (type) {
    case 'reverse': {
      // 56 / 7 = ?
      return {
        id: qId,
        factId,
        type: 'reverse',
        factorA,
        factorB,
        correctAnswer: factorB,
        promptText: {
          en: `Which number multiplied by ${factorA} equals ${product}? (${product} ÷ ${factorA} = ?)`,
          hi: `किस संख्या को ${factorA} से गुणा करने पर ${product} आता है? (${product} ÷ ${factorA} = ?)`,
        },
        promptSpeech: {
          en: `Which number multiplied by ${factorA} equals ${product}?`,
          hi:`किस संख्या को ${factorA} से गुणा करने पर ${product} मिलता है?`,
        },
        hintText: {
          en: `Think: how many times does ${factorA} go into ${product}? Count by ${factorA}s.`,
          hi: `सोचें: ${factorA} के पहाड़े में ${product} किस स्थान पर आता है?`,
        },
        explanationText: {
          en: `${factorA} × ${factorB} = ${product}, so ${product} ÷ ${factorA} = ${factorB}.`,
          hi: `${factorA} × ${factorB} = ${product}, इसलिए ${product} ÷ ${factorA} = ${factorB}।`,
        },
        options: generateDistractors(factorB, factorA, 1),
      };
    }

    case 'missing_second': {
      // 7 x ? = 56
      return {
        id: qId,
        factId,
        type: 'missing_second',
        factorA,
        factorB,
        correctAnswer: factorB,
        promptText: {
          en: `${factorA} × ? = ${product}`,
          hi: `${factorA} × ? = ${product}`,
        },
        promptSpeech: {
          en: `${factorA} times what number equals ${product}?`,
          hi: `${factorA} को किस संख्या से गुणा करने पर ${product} मिलता है?`,
        },
        hintText: {
          en: `Skip count by ${factorA} until you reach ${product}.`,
          hi: `${factorA} का पहाड़ा तब तक पढ़ें जब तक ${product} न आ जाए।`,
        },
        explanationText: {
          en: `${factorA} multiplied by ${factorB} gives ${product}.`,
          hi: `${factorA} को ${factorB} से गुणा करने पर ${product} बनता है।`,
        },
        options: generateDistractors(factorB, factorA, 1),
      };
    }

    case 'multiple_choice': {
      const optionsList = generateDistractors(product, factorA, factorB);
      return {
        id: qId,
        factId,
        type: 'multiple_choice',
        factorA,
        factorB,
        correctAnswer: product,
        promptText: {
          en: `What is ${factorA} × ${factorB}?`,
          hi: `${factorA} × ${factorB} कितना होगा?`,
        },
        promptSpeech: {
          en: `What is ${factorA} times ${factorB}?`,
          hi: `${factorA} गुणा ${factorB} कितना होता है?`,
        },
        hintText: {
          en: `Think of ${factorB} groups of ${factorA}.`,
          hi: `${factorA} को ${factorB} बार जोड़ें।`,
        },
        explanationText: {
          en: `${factorA} × ${factorB} = ${product}`,
          hi: `${factorA} × ${factorB} = ${product}`,
        },
        options: optionsList,
      };
    }

    case 'repeated_addition': {
      const actualFactorB = Math.max(2, factorB);
      const actualProduct = factorA * actualFactorB;
      const repeatedTerms = Array(actualFactorB).fill(factorA).join(' + ');
      return {
        id: qId,
        factId: `${factorA}x${actualFactorB}`,
        type: 'repeated_addition',
        factorA,
        factorB: actualFactorB,
        correctAnswer: actualProduct,
        promptText: {
          en: `${repeatedTerms} = ?`,
          hi: `${repeatedTerms} = ?`,
        },
        promptSpeech: {
          en: `What is ${factorA} added ${actualFactorB} times? That is ${factorA} times ${actualFactorB}.`,
          hi: `${factorA} को ${actualFactorB} बार जोड़ने पर क्या आएगा? यानी ${factorA} गुणा ${actualFactorB}।`,
        },
        hintText: {
          en: `Multiplication is repeated addition! ${actualFactorB} times ${factorA} is ${factorA} × ${actualFactorB}.`,
          hi: `गुणन बार-बार जोड़ना ही है! ${factorA} × ${actualFactorB}।`,
        },
        explanationText: {
          en: `Adding ${factorA}, ${actualFactorB} times equals ${actualProduct}. ${factorA} × ${actualFactorB} = ${actualProduct}.`,
          hi: `${factorA} को ${actualFactorB} बार जोड़ने से ${actualProduct} बनता है।`,
        },
        options: generateDistractors(actualProduct, factorA, actualFactorB),
      };
    }

    case 'skip_counting': {
      const step1 = factorA * 1;
      const step2 = factorA * 2;
      const step3 = factorA * 3;
      const step4 = factorA * 4;
      return {
        id: qId,
        factId: `${factorA}x4`,
        type: 'skip_counting',
        factorA,
        factorB: 4,
        correctAnswer: step4,
        promptText: {
          en: `Continue the skip count: ${step1}, ${step2}, ${step3}, [ ? ]`,
          hi: `क्रम आगे बढ़ाएँ: ${step1}, ${step2}, ${step3}, [ ? ]`,
        },
        promptSpeech: {
          en: `Counting by ${factorA}s: ${step1}, ${step2}, ${step3}, what comes next?`,
          hi: `${factorA} के अंतराल पर गिनती: ${step1}, ${step2}, ${step3}, अगला पद क्या होगा?`,
        },
        hintText: {
          en: `Add ${factorA} to ${step3}.`,
          hi: `${step3} में ${factorA} जोड़ें।`,
        },
        explanationText: {
          en: `${step3} + ${factorA} = ${step4} (${factorA} × 4).`,
          hi: `${step3} + ${factorA} = ${step4} (${factorA} × 4) होता है।`,
        },
        options: generateDistractors(step4, factorA, 1),
      };
    }

    case 'word_problem': {
      const scenario = REAL_WORLD_SCENARIOS[factorA % REAL_WORLD_SCENARIOS.length];
      const count = Math.min(factorB, 12);
      const totalCost = scenario.unitCost * count;
      return {
        id: qId,
        factId: `${scenario.unitCost}x${count}`,
        type: 'word_problem',
        factorA: scenario.unitCost,
        factorB: count,
        correctAnswer: totalCost,
        promptText: {
          en: `If 1 ${scenario.itemEn} costs ₹${scenario.unitCost}, what is the total price for ${count} ${scenario.itemEn}?`,
          hi: `यदि 1 ${scenario.itemHi} की कीमत ₹${scenario.unitCost} है, तो ऐसे ${count} ${scenario.itemHi} का कुल मूल्य क्या होगा?`,
        },
        promptSpeech: {
          en: `If one item costs ₹${scenario.unitCost}, how much do ${count} items cost?`,
          hi: `यदि एक वस्तु ₹${scenario.unitCost} की है, तो ऐसी ${count} वस्तुओं का कुल मूल्य कितना होगा?`,
        },
        hintText: {
          en: `Multiply the price ₹${scenario.unitCost} by the quantity ${count}.`,
          hi: `कीमत ₹${scenario.unitCost} को मात्रा ${count} से गुणा करें।`,
        },
        explanationText: {
          en: `₹${scenario.unitCost} × ${count} = ₹${totalCost}.`,
          hi: `₹${scenario.unitCost} × ${count} = ₹${totalCost}।`,
        },
        options: generateDistractors(totalCost, scenario.unitCost, count),
      };
    }

    case 'mental_shortcut': {
      // Teach distributive property e.g. 17 x 8 = (10 x 8) + (7 x 8) = 80 + 56 = 136
      const tensPart = Math.floor(factorA / 10) * 10;
      const unitsPart = factorA % 10;
      return {
        id: qId,
        factId,
        type: 'mental_shortcut',
        factorA,
        factorB,
        correctAnswer: product,
        promptText: {
          en: `Shortcut: Break ${factorA} into (${tensPart} + ${unitsPart}). What is ${factorA} × ${factorB}?`,
          hi: `शॉर्टकट: ${factorA} को (${tensPart} + ${unitsPart}) में तोड़ें। ${factorA} × ${factorB} क्या है?`,
        },
        promptSpeech: {
          en: `Calculate ${factorA} times ${factorB} by breaking down ${factorA}.`,
          hi: `${factorA} गुणा ${factorB} को तोड़कर हल करें।`,
        },
        hintText: {
          en: `(${tensPart} × ${factorB} = ${tensPart * factorB}) + (${unitsPart} × ${factorB} = ${unitsPart * factorB}). Add them together.`,
          hi: `(${tensPart} × ${factorB} = ${tensPart * factorB}) + (${unitsPart} × ${factorB} = ${unitsPart * factorB}) को जोड़ें।`,
        },
        explanationText: {
          en: `(${tensPart} × ${factorB}) + (${unitsPart} × ${factorB}) = ${tensPart * factorB} + ${unitsPart * factorB} = ${product}.`,
          hi: `(${tensPart} × ${factorB}) + (${unitsPart} × ${factorB}) = ${tensPart * factorB} + ${unitsPart * factorB} = ${product}।`,
        },
        options: generateDistractors(product, factorA, factorB),
      };
    }

    case 'direct':
    default: {
      return {
        id: qId,
        factId,
        type: 'direct',
        factorA,
        factorB,
        correctAnswer: product,
        promptText: {
          en: `${factorA} × ${factorB} = ?`,
          hi: `${factorA} × ${factorB} = ?`,
        },
        promptSpeech: {
          en: `What is ${factorA} times ${factorB}?`,
          hi: `${factorA} गुणा ${factorB} कितना होता है?`,
        },
        hintText: {
          en: `Remember: ${factorA} groups of ${factorB}, or ${factorB} groups of ${factorA}.`,
          hi: `याद रखें: ${factorA} को ${factorB} बार गिनें।`,
        },
        explanationText: {
          en: `${factorA} × ${factorB} = ${product}`,
          hi: `${factorA} × ${factorB} = ${product}`,
        },
        options: generateDistractors(product, factorA, factorB),
        visualData: {
          groups: factorA <= 10 ? factorA : 5,
          itemsPerGroup: factorB <= 10 ? factorB : 4,
          itemName: 'items',
          icon: 'circle',
        },
      };
    }
  }
}
