import { parseSpokenNumber, parseEnglishNumber, parseHindiNumber } from '../../src/engines/number-parser';

describe('Spoken Number Parser Suite', () => {
  describe('English Spoken Number Parser', () => {
    it('parses single digit numbers and near-homophones', () => {
      expect(parseEnglishNumber('zero')).toBe(0);
      expect(parseEnglishNumber('one')).toBe(1);
      expect(parseEnglishNumber('won')).toBe(1);
      expect(parseEnglishNumber('two')).toBe(2);
      expect(parseEnglishNumber('to')).toBe(2);
      expect(parseEnglishNumber('too')).toBe(2);
      expect(parseEnglishNumber('three')).toBe(3);
      expect(parseEnglishNumber('four')).toBe(4);
      expect(parseEnglishNumber('for')).toBe(4);
      expect(parseEnglishNumber('five')).toBe(5);
      expect(parseEnglishNumber('six')).toBe(6);
      expect(parseEnglishNumber('seven')).toBe(7);
      expect(parseEnglishNumber('eight')).toBe(8);
      expect(parseEnglishNumber('ate')).toBe(8);
      expect(parseEnglishNumber('nine')).toBe(9);
      expect(parseEnglishNumber('ten')).toBe(10);
    });

    it('parses teen numbers and compound numbers correctly', () => {
      expect(parseEnglishNumber('eleven')).toBe(11);
      expect(parseEnglishNumber('twelve')).toBe(12);
      expect(parseEnglishNumber('seventeen')).toBe(17);
      expect(parseEnglishNumber('twenty five')).toBe(25);
      expect(parseEnglishNumber('thirty six')).toBe(36);
      expect(parseEnglishNumber('fifty six')).toBe(56);
      expect(parseEnglishNumber('seventy two')).toBe(72);
      expect(parseEnglishNumber('eighty-four')).toBe(84);
      expect(parseEnglishNumber('ninety nine')).toBe(99);
    });

    it('parses hundreds accurately (e.g. 17 x 8 = 136)', () => {
      expect(parseEnglishNumber('one hundred thirty six')).toBe(136);
      expect(parseEnglishNumber('one hundred thirty-six')).toBe(136);
      expect(parseEnglishNumber('two hundred forty')).toBe(240);
      expect(parseEnglishNumber('four hundred')).toBe(400);
    });

    it('handles numeric digits directly in audio transcript', () => {
      expect(parseEnglishNumber('136')).toBe(136);
      expect(parseEnglishNumber('it is 56')).toBe(56);
      expect(parseEnglishNumber('I think 84')).toBe(84);
    });

    it('returns null on unintelligible or empty input', () => {
      expect(parseEnglishNumber('')).toBeNull();
      expect(parseEnglishNumber('hello world')).toBeNull();
      expect(parseEnglishNumber('umm uhh')).toBeNull();
    });
  });

  describe('Hindi Spoken Number Parser', () => {
    it('parses Devanagari numbers', () => {
      expect(parseHindiNumber('एक')).toBe(1);
      expect(parseHindiNumber('दो')).toBe(2);
      expect(parseHindiNumber('सात')).toBe(7);
      expect(parseHindiNumber('आठ')).toBe(8);
      expect(parseHindiNumber('बारह')).toBe(12);
      expect(parseHindiNumber('सत्रह')).toBe(17);
      expect(parseHindiNumber('छब्बीस')).toBe(26);
      expect(parseHindiNumber('पचपन')).toBe(55);
      expect(parseHindiNumber('छप्पन')).toBe(56);
      expect(parseHindiNumber('बहत्तर')).toBe(72);
      expect(parseHindiNumber('चौरासी')).toBe(84);
      expect(parseHindiNumber('सौ')).toBe(100);
    });

    it('parses Devanagari hundreds e.g. "एक सौ छत्तीस" -> 136', () => {
      expect(parseHindiNumber('एक सौ छत्तीस')).toBe(136);
      expect(parseHindiNumber('दो सौ चालीस')).toBe(240);
      expect(parseHindiNumber('चार सौ')).toBe(400);
    });

    it('parses Romanized / Transliterated Hindi words', () => {
      expect(parseHindiNumber('ek')).toBe(1);
      expect(parseHindiNumber('do')).toBe(2);
      expect(parseHindiNumber('chaat')).toBeNull();
      expect(parseHindiNumber('chaurasi')).toBe(84);
      expect(parseHindiNumber('chauraasi')).toBe(84);
      expect(parseHindiNumber('chhappan')).toBe(56);
      expect(parseHindiNumber('bahattar')).toBe(72);
      expect(parseHindiNumber('ek sau chhattis')).toBe(136);
    });
  });

  describe('Unified Spoken Number Parser', () => {
    it('detects English and Hindi appropriately', () => {
      const enRes = parseSpokenNumber('one hundred thirty six', 'en');
      expect(enRes.number).toBe(136);
      expect(enRes.detectedLanguage).toBe('en');

      const hiRes = parseSpokenNumber('एक सौ छत्तीस', 'hi');
      expect(hiRes.number).toBe(136);
      expect(hiRes.detectedLanguage).toBe('hi');

      const crossRes = parseSpokenNumber('eighty four', 'hi');
      expect(crossRes.number).toBe(84);
    });
  });
});
