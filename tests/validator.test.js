import { isValidBook, isValidReference } from '../src/utils/validator.js';

describe('Bible Reference Validator', () => {
  describe('isValidBook()', () => {
    it('returns true for full book name', () => {
      expect(isValidBook('Genesis')).toBe(true);
    });

    it('returns true for alias (case-insensitive)', () => {
      expect(isValidBook('gEn')).toBe(true);
    });

    it('returns false for unknown book', () => {
      expect(isValidBook('Judas')).toBe(false);
    });

    it('returns false for empty string', () => {
      expect(isValidBook('')).toBe(false);
    });

    it('returns false for null or undefined', () => {
      expect(isValidBook(null)).toBe(false);
      expect(isValidBook(undefined)).toBe(false);
    });
  });

  describe('isValidReference()', () => {
    it('returns true for Genesis 1:1', () => {
      expect(isValidReference('Genesis', 1, 1)).toBe(true);
    });

    it('returns true for Genesis 1:31 (last verse)', () => {
      expect(isValidReference('Genesis', 1, 31)).toBe(true);
    });

    it('returns false for Genesis 1:32 (verse too high)', () => {
      expect(isValidReference('Genesis', 1, 32)).toBe(false);
    });

    it('returns false for Genesis 0:1 (invalid chapter)', () => {
      expect(isValidReference('Genesis', 0, 1)).toBe(false);
    });

    it('returns false for Genesis 1:0 (invalid verse)', () => {
      expect(isValidReference('Genesis', 1, 0)).toBe(false);
    });

    it('returns false for unknown book', () => {
      expect(isValidReference('Blah', 1, 1)).toBe(false);
    });

    it('returns false for null input', () => {
      expect(isValidReference(null, 1, 1)).toBe(false);
      expect(isValidReference('Genesis', null, 1)).toBe(false);
      expect(isValidReference('Genesis', 1, null)).toBe(false);
    });

    it('returns false for non-numeric chapter/verse', () => {
      expect(isValidReference('Genesis', 'one', 'one')).toBe(false);
    });

    it('is case-insensitive for book input', () => {
      expect(isValidReference('gEnEsIs', 1, 1)).toBe(true);
    });
  });
});
