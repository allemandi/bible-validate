import { getBook, getChapterCount, getVerseCount } from '../src/utils/lookup';

describe('Bible Utils', () => {
    describe('getBook()', () => {
        it('returns Genesis book object', () => {
            const result = getBook('Genesis');
            expect(result?.book).toBe('genesis');
            expect(result?.aliases).toContain('gen');
            expect(result?.chapters.length).toBe(50);
        });

        it('returns correct book object for alias case-insensitively', () => {
            const alias = 'GeN';
            const result = getBook(alias);
            expect(result?.book).toBe('genesis');
        });

        it('returns null for unknown book', () => {
            expect(getBook('Judas')).toBeNull();
        });
    });

    describe('getChapterCount()', () => {
        it('returns 50 for Genesis', () => {
            expect(getChapterCount('Genesis')).toBe(50);
        });

        it('returns null for invalid book', () => {
            expect(getChapterCount('Judas')).toBeNull();
        });
    });

    describe('getVerseCount()', () => {
        it('returns 25 for Genesis 2', () => {
            expect(getVerseCount('Genesis', 2)).toBe(25);
        });

        it('returns null for invalid book', () => {
            expect(getVerseCount('Judas', 1)).toBeNull();
        });

        it('returns null for too high chapter', () => {
            expect(getVerseCount('Genesis', 999)).toBeNull();
        });

        it('returns null for chapter < 1', () => {
            expect(getVerseCount('Genesis', 0)).toBeNull();
        });
    });
});