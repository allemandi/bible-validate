import { normalizeBookName, parseChapterVerse, extractBookAndRange, parseBibleReference } from '../src/utils/normalizer';

describe('normalizeBookName()', () => {
    it('normalizes case insensitive ordinal prefixes', () => {
        expect(normalizeBookName('1st John')).toBe('1john');
        expect(normalizeBookName('second Kings')).toBe('2kings');
        expect(normalizeBookName('Iii John')).toBe('3john');
    });
    it('removes unified string prefixes like "The Epistle to the", "Book of", "Gospel according to"', () => {
        expect(normalizeBookName('The Epistle to the Romans')).toBe('romans');
        expect(normalizeBookName('Book of Psalms')).toBe('psalms');
        expect(normalizeBookName('Gospel according to John')).toBe('john');
        expect(normalizeBookName('The Song of Solomon')).toBe('songofsolomon');
        expect(normalizeBookName('The Gospel of Luke')).toBe('luke');
    });
    it('removes non-alphanumeric characters', () => {
        expect(normalizeBookName("1st! Samuel?")).toBe("1samuel");
        expect(normalizeBookName('Book of *EX*')).toBe('ex');
    });
    it('trims leading and trailing spaces', () => {
        expect(normalizeBookName('  Gen ')).toBe('gen');
    });
    it('handles mixed case and extra spaces', () => {
        expect(normalizeBookName('  gEnEsIs  ')).toBe('genesis');
        expect(normalizeBookName('  The   Epistle   to   the   Colossians  ')).toBe('colossians');
    });
    it('returns empty string if input is only spaces', () => {
        expect(normalizeBookName('   ')).toBe('');
    });
    it('returns null if input is null or undefined', () => {
        expect(normalizeBookName(null)).toBeNull();
        expect(normalizeBookName(undefined)).toBeNull();
    });
    it('works with already clean input', () => {
        expect(normalizeBookName('genesis')).toBe('genesis');
    });
});

describe('parseChapterVerse()', () => {
    it('parses chapter only', () => {
        expect(parseChapterVerse('12')).toEqual({
            chapter: 12,
            verseStart: null,
            verseEnd: null,
        });
    });
    it('parses chapter and verse', () => {
        expect(parseChapterVerse('5:3')).toEqual({
            chapter: 5,
            verseStart: 3,
            verseEnd: null,
        });
    });
    it('parses mixed string reference', () => {
        expect(parseChapterVerse('Chapter 13 Verses 4–7')).toEqual({
            chapter: 13,
            verseStart: 4,
            verseEnd: 7,
        });
    });
    it('handles "to" in range', () => {
        expect(parseChapterVerse('chap. 13, v3 to 8')).toEqual({
            chapter: 13,
            verseStart: 3,
            verseEnd: 8,
        });
    });
    it('returns null for non-numeric input', () => {
        expect(parseChapterVerse('nonsense')).toBeNull();
    });
    it('handles extra whitespace and punctuation', () => {
        expect(parseChapterVerse('  10 : 2  - 6 ')).toEqual({
            chapter: 10,
            verseStart: 2,
            verseEnd: 6,
        });
    });
    it('handles pure whitespace and number combination', () => {
        expect(parseChapterVerse('  11  1   2 ')).toEqual({
            chapter: 11,
            verseStart: 1,
            verseEnd: 2,
        });
    });
});

describe('extractBookAndRange()', () => {
    it('extracts book and range from standard input', () => {
        expect(extractBookAndRange('1st John 3:16')).toEqual(['1st John', '3:16']);
    });
    it('extracts with punctuation in book name', () => {
        expect(extractBookAndRange("The Revelation 4:5")).toEqual(["The Revelation", '4:5']);
    });
    it('extracts when no range is given', () => {
        expect(extractBookAndRange('Genesis')).toEqual(['Genesis', '']);
    });
    it('returns [null, null] for invalid input', () => {
        expect(extractBookAndRange('')).toEqual([null, null]);
    });
    it('handles leading spaces', () => {
        expect(extractBookAndRange('   Exodus 12')).toEqual(['Exodus', '12']);
    });
    it('extracts range from first digit after string reference', () => {
        expect(extractBookAndRange(' Exodus   12. 1 to 3')).toEqual(['Exodus', '12. 1 to 3']);
    });
    it('extracts range from chapter string or abbreviations', () => {
        expect(extractBookAndRange('Exodus Chapter 12:1-3')).toEqual(['Exodus', 'Chapter 12:1-3']);
        expect(extractBookAndRange(' Exodus  Ch. 12. 1 to 3')).toEqual(['Exodus', 'Ch. 12. 1 to 3']);
        expect(extractBookAndRange('Exodus  Chap 12. 1 to 3')).toEqual(['Exodus', 'Chap 12. 1 to 3']);
        expect(extractBookAndRange('second Kings Chape 1 to 3')).toEqual(['second Kings Chape', '1 to 3']);
    });
});

describe('parseBibleReference()', () => {
    it('parses complete reference with ordinal prefix', () => {
        expect(parseBibleReference('2nd Kings 4:2')).toEqual({
            book: '2kings',
            chapter: 4,
            verseStart: 2,
            verseEnd: null,
        });
    });
    it('parses mixed case string references with range', () => {
        expect(parseBibleReference(' Iii JohN  Chap. 1 verses 9 to  11')).toEqual({
            book: '3john',
            chapter: 1,
            verseStart: 9,
            verseEnd: 11,
        });
    });

    it('handles no chapter/verse part', () => {
        expect(parseBibleReference('Genesis')).toEqual({
            book: 'genesis',
            chapter: null,
            verseStart: null,
            verseEnd: null,
        });
    });

    it('returns null fields for invalid input', () => {
        expect(parseBibleReference('!!!')).toEqual({
            book: null,
            chapter: null,
            verseStart: null,
            verseEnd: null,
        });
    });

    it('handles extra spaces', () => {
        expect(parseBibleReference('  1st   Samuel    17 : 4-9 ')).toEqual({
            book: '1samuel',
            chapter: 17,
            verseStart: 4,
            verseEnd: 9,
        });
    });

    it('returns null for non-string input', () => {
        expect(parseBibleReference(42)).toBeNull();
        expect(parseBibleReference(null)).toBeNull();
    });
});