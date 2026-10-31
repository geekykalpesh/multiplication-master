import { validateAnswer } from '../../src/engines/answer-validation/validator';

describe('Deterministic Answer Validator Suite', () => {
  it('correctly validates accurate numerical answer', () => {
    const res = validateAnswer({
      userAnswer: 136,
      expectedAnswer: 136,
      latencyMs: 1400,
      audience: 'child',
      language: 'en',
    });

    expect(res.isCorrect).toBe(true);
    expect(res.status).toBe('correct');
    expect(res.recallSpeedCategory).toBe('instant');
  });

  it('correctly identifies fluent vs calculated speed categories', () => {
    const fluentRes = validateAnswer({
      userAnswer: 56,
      expectedAnswer: 56,
      latencyMs: 2800,
      audience: 'adult',
      language: 'en',
    });
    expect(fluentRes.recallSpeedCategory).toBe('fluent');

    const calcRes = validateAnswer({
      userAnswer: 56,
      expectedAnswer: 56,
      latencyMs: 5200,
      audience: 'adult',
      language: 'en',
    });
    expect(calcRes.recallSpeedCategory).toBe('calculated');
  });

  it('correctly handles incorrect answer without shaming user', () => {
    const res = validateAnswer({
      userAnswer: 48,
      expectedAnswer: 56,
      latencyMs: 3100,
      audience: 'child',
      language: 'en',
    });

    expect(res.isCorrect).toBe(false);
    expect(res.status).toBe('incorrect');
    expect(res.feedbackText).toContain('56');
    expect(res.feedbackText).not.toContain('bad');
  });

  it('handles unclear speech input without counting as incorrect error', () => {
    const res = validateAnswer({
      userAnswer: null,
      expectedAnswer: 72,
      latencyMs: 4000,
      audience: 'child',
      language: 'en',
    });

    expect(res.isCorrect).toBe(false);
    expect(res.status).toBe('unclear');
    expect(res.feedbackText).toContain('say it again');
  });

  it('provides Hindi language responses when requested', () => {
    const res = validateAnswer({
      userAnswer: 84,
      expectedAnswer: 84,
      latencyMs: 1200,
      audience: 'child',
      language: 'hi',
    });

    expect(res.isCorrect).toBe(true);
    expect(res.feedbackText).toContain('सही उत्तर');
  });
});
