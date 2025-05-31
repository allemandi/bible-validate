import {
    getBook,
    getChapterCount,
    getVerseCount,
    listBibleBooks,
    listAliases,
    listChapters,
    listVerses
} from '../src/utils/lookup';

describe('Bible Utils', () => {
    describe('getBook()', () => {
        it('returns Genesis book object', () => {
            const result = getBook('Genesis');
            expect(result?.book).toBe('Genesis');
            expect(result?.aliases).toContain('Gen');
            expect(result?.chapters.length).toBe(50);
        });

        it('returns correct book object for alias case-insensitively', () => {
            const alias = 'GeN';
            const result = getBook(alias);
            expect(result?.book).toBe('Genesis');
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
            expect(getVerseCount('GeN.  ', 2)).toBe(25);
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

    describe('Bible List Functions', () => {
        describe('listBibleBooks()', () => {
            it('returns 66 elements in an array', () => {
                const books = listBibleBooks();
                expect(Array.isArray(books)).toBe(true);
                expect(books.length).toBe(66);
            });
            it('returns Genesis / Revelation ordered first / last in array', () => {
                const books = listBibleBooks();
                expect(books[0]).toBe('Genesis');
                expect(books[books.length - 1]).toBe('Revelation');
            });
        });
    });

    describe('listAliases()', () => {
        it('returns all aliases including official name for a valid book', () => {
            const aliases = listAliases('Second Corinthians');
            expect(aliases).not.toBeNull();
            expect(aliases[0]).toBe("2 Corinthians");
            expect(aliases).toContain('2 Co');
        });
        it('is case-insensitive for book names and aliases', () => {
            const aliases = listAliases('second COR');
            expect(aliases).toContain('2 Cor');
        });
        it('returns null for an unrecognized book name', () => {
            expect(listAliases('UnknownBook')).toBeNull();
            expect(listAliases(null)).toBeNull();
            expect(listAliases('')).toBeNull();
        });
        it('returns properly title-cased aliases by default as non-normalized', () => {
            const aliases = listAliases('song of solomon');
            expect(aliases[0]).toBe('Song of Solomon');
            expect(aliases).toContain('Canticle of Canticles');
            expect(aliases).toContain('Sos');
        });
        it('returns normalized aliases when requested', () => {
            const aliases = listAliases('Song', { normalized: true });
            expect(aliases[0]).toBe('songofsolomon');
            expect(aliases).toContain('canticleofcanticles');
            expect(aliases).toContain('sos');
            expect(aliases.every(a => a === a.toLowerCase())).toBe(true);
        });

        describe('listChapters()', () => {
            it('returns an array from 1 to chapter count for a valid book', () => {
                const chapters = listChapters('Exodus');
                const chapterCount = getChapterCount('Exodus');
                expect(Array.isArray(chapters)).toBe(true);
                expect(chapters.length).toBe(chapterCount);
                expect(chapters[0]).toBe(1);
                expect(chapters[chapters.length - 1]).toBe(chapterCount);
            });

            it('returns null for invalid book', () => {
                expect(listChapters('UnknownBook')).toBeNull();
            });
        });

        describe('listVerses()', () => {
            it('returns array from 1 to max verse count for a valid book and chapter', () => {
                const verses = listVerses('Genesis', 1);
                const verseCount = getVerseCount('Genesis', 1);
                expect(Array.isArray(verses)).toBe(true);
                expect(verses.length).toBe(verseCount);
                expect(verses[0]).toBe(1);
                expect(verses[verseCount - 1]).toBe(verseCount);
            });

            it('returns null for invalid book or chapter out of range', () => {
                expect(listVerses('Genesis')).toBeNull();
                expect(listVerses('Genesis', 0)).toBeNull();
                expect(listVerses('Genesis', 999)).toBeNull();
                expect(listVerses('UnknownBook', 1)).toBeNull();
            });
        });
    });

});