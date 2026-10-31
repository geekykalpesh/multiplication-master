import { generateQuestion } from '../../src/engines/question-engine/generator';

describe('Deterministic Question Engine Suite', () => {
  it('generates direct multiplication with accurate product and non-empty prompts', () => {
    const q = generateQuestion({
      tables: [7],
      allowedTypes: ['direct'],
      maxFactor: 10,
    });

    expect(q.factorA).toBe(7);
    expect(q.correctAnswer).toBe(q.factorA * q.factorB);
    expect(q.promptText.en).toContain('×');
    expect(q.promptSpeech.en).toContain('times');
    expect(q.explanationText.en).toContain(`${q.factorA} × ${q.factorB} = ${q.correctAnswer}`);
  });

  it('generates reverse multiplication (division relationship) questions correctly', () => {
    const q = generateQuestion({
      tables: [8],
      allowedTypes: ['reverse'],
      maxFactor: 10,
    });

    expect(q.type).toBe('reverse');
    expect(q.factorA).toBe(8);
    // Correct answer for reverse (product ÷ 8) is factorB
    expect(q.correctAnswer).toBe(q.factorB);
    expect(q.promptText.en).toContain('÷');
  });

  it('generates missing number equations (e.g. 8 × ? = 72)', () => {
    const q = generateQuestion({
      tables: [8],
      allowedTypes: ['missing_second'],
    });

    expect(q.type).toBe('missing_second');
    expect(q.correctAnswer).toBe(q.factorB);
    expect(q.promptText.en).toContain('?');
  });

  it('generates repeated addition questions (e.g. 4 + 4 + 4 = 12)', () => {
    const q = generateQuestion({
      tables: [4],
      allowedTypes: ['repeated_addition'],
      maxFactor: 5,
    });

    expect(q.type).toBe('repeated_addition');
    expect(q.correctAnswer).toBe(q.factorA * q.factorB);
    expect(q.promptText.en).toContain('+');
  });

  it('generates real-world word problems with INR (₹) prices', () => {
    const q = generateQuestion({
      tables: [5],
      allowedTypes: ['word_problem'],
    });

    expect(q.type).toBe('word_problem');
    expect(q.promptText.en).toContain('₹');
    expect(q.promptText.hi).toContain('₹');
  });

  it('generates multiple choice questions with 4 distinct options including correct answer', () => {
    const q = generateQuestion({
      tables: [9],
      allowedTypes: ['multiple_choice'],
    });

    expect(q.options).toBeDefined();
    expect(q.options?.length).toBe(4);
    expect(q.options).toContain(q.correctAnswer);
    // Ensure all 4 options are unique
    const uniqueOptions = new Set(q.options);
    expect(uniqueOptions.size).toBe(4);
  });
});
