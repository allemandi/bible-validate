import { formatReference, parseAndValidateReference } from '../src/utils/formatter.js';

describe('formatReference()', () => {
    it('returns empty string if no input', () => {
        expect(formatReference({})).toBe('');
    });

    it('returns book name if no chapter', () => {
        expect(formatReference({ book: 'Genesis' })).toBe('Genesis');
    });

    it('returns book and chapter if no verse', () => {
        expect(formatReference({ book: 'Genesis', chapter: 1 })).toBe('Genesis 1');
    });

    it('returns book, chapter and verse', () => {
        expect(formatReference({ book: 'Genesis', chapter: 1, verseStart: 1 })).toBe('Genesis 1:1');
    });

    it('returns book, chapter and verse range', () => {
        expect(formatReference({ book: 'Genesis', chapter: 1, verseStart: 1, verseEnd: 5 })).toBe('Genesis 1:1-5');
    });

    it('returns single verse if verseStart equals verseEnd', () => {
        expect(formatReference({ book: 'Genesis', chapter: 1, verseStart: 3, verseEnd: 3 })).toBe('Genesis 1:3');
    });
});

describe('parseAndValidateReference()', () => {
    it('rejects empty string', () => {
        expect(parseAndValidateReference('')).toEqual({
            isValid: false,
            error: 'Empty or invalid input',
            original: '',
        });
    });

    it('rejects null', () => {
        expect(parseAndValidateReference(null)).toEqual({
            isValid: false,
            error: 'Empty or invalid input',
            original: null,
        });
    });

    it('rejects invalid book name', () => {
        const result = parseAndValidateReference('Book of Judas 1:1');
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Invalid book name');
    });

    it('rejects malformed reference', () => {
        const result = parseAndValidateReference('::::');
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Could not parse reference');
    });

    it('rejects valid book but bad chapter/verse', () => {
        const result = parseAndValidateReference('Genesis 99:1');
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Invalid chapter or verse');
    });

    it('accepts valid single verse (Genesis Chapter 1 verse 1)', () => {
        const result = parseAndValidateReference('Genesis Chapter 1 verse 1');
        expect(result.isValid).toBe(true);
        expect(result.formatted).toBe('Genesis 1:1');
    });

    it('accepts verse range and formats correctly (  GN. Ch 1 , 1 to 3)', () => {
        const result = parseAndValidateReference('  GN. Ch 1 , 1 to 3');
        expect(result.isValid).toBe(true);
        expect(result.formatted).toBe('Genesis 1:1-3');
    });

    it('returns structured output when flag is passed', () => {
        const result = parseAndValidateReference('Genesis 1:1', { structured: true });
        expect(result).toMatchObject({
            isValid: true,
            book: 'Genesis',
            chapter: 1,
            verseStart: 1,
            verseEnd: null,
            formatted: 'Genesis 1:1',
        });
    });

    it('is case-insensitive', () => {
        const result = parseAndValidateReference('gEnEsIs 1:1');
        expect(result.isValid).toBe(true);
        expect(result.formatted).toBe('Genesis 1:1');
    });
});