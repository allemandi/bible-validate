import bibleCounts from '../data/bibleCounts.json';
import { normalizeBookName } from './normalizer';
/**
 * @import { BibleBook } from './types.js'
 */

// Build a Map at load time for fast lookup by normalized book name or alias
const bookCache = new Map();

/**
 * Retrieves a book object from the Bible collection matching the given book name or its aliases, ignoring case and special characters.
 * @public
 * @param {string} book - The name or alias of the book to lookup, which will be normalized internally.
 * @returns {BibleBook|null} - The matched book object containing book name, aliases, and chapters, or null if no match is found.
 * @example
 * // Returns the Genesis book object with its aliases and 50 chapters
 * getBook('Genesis'); // { book: 'Genesis', aliases: ['Gen', 'Ge', 'Gn'], chapters: [...] }
 * // Returns the Song of Solomon book object when queried with a normalized alias ignoring punctuation and case
 * getBook('The CANticle of CantiClEs !!?*'); // { book: 'Song of Solomon', aliases: [...], chapters: [...] }
 * // Returns null for an unknown or invalid book name
 * getBook('Judas'); // null
 */
function getBook(book) {
    if (!book) return null;

    const normalized = normalizeBookName(book);
    if (bookCache.has(normalized)) {
        return bookCache.get(normalized);
    }

    const found = bibleCounts.find(b => {
        const normalizedBook = normalizeBookName(b.book);
        if (normalizedBook === normalized) return true;

        const normalizedAliases = b.aliases.map(normalizeBookName);
        return normalizedAliases.includes(normalized);
    }) || null;

    bookCache.set(normalized, found);
    return found;
}

/**
 * Returns the number of chapters for a given Bible book name or alias, or null if the book is not found.
 * @public
 * @param {string} name - The name or alias of the book to lookup, which will be normalized internally.
 * @returns {number|null} - The total number of chapters in the matched book, or null if no book is found.
 * @example
 * // Returns 50 chapters for Genesis
 * getChapterCount('Genesis'); // 50
 * // Returns null for an unknown or invalid book name
 * getChapterCount('Judas');
 */
function getChapterCount(name) {
    const book = getBook(name);
    return book ? book.chapters.length : null;
}

/**
 * Returns the number of verses in a specified chapter of a given Bible book, or null if the book or chapter is invalid.
 * @public
 * @param {string} name - The name or alias of the book to lookup, which will be normalized internally.
 * @param {number} chapter - The chapter number to retrieve the verse count for; must be within valid range.
 * @returns {number|null} - The count of verses in the specified chapter, or null if the book is unknown or chapter is out of bounds.
 * @example
 * // Returns 25, the number of verses in Genesis chapter 2
 * getVerseCount('GeN.  ', 2); // 25
 * // Returns null for an invalid book name
 * getVerseCount('Judas', 1);
 * // Returns null for a chapter number that is too high
 * getVerseCount('Genesis', 999);
 * // Returns null for a chapter number less than 1
 * getVerseCount('Genesis', 0);
 */
function getVerseCount(name, chapter) {
    const book = getBook(name);
    if (!book || chapter < 1 || chapter > book.chapters.length) return null;
    return book.chapters[chapter - 1];
}

/**
 * Returns an array of all Bible book names in their canonical order.
 * @public
 * @returns {string[]} - An array containing 66 book names starting with Genesis and ending with Revelation.
 * @example
 * // Returns an array of 66 Bible books
 * listBibleBooks();
 * // The first and last elements are Genesis and Revelation respectively
 * const books = listBibleBooks();
 * console.log(books[0]); // "Genesis"
 * console.log(books[books.length - 1]); // "Revelation"
 */
function listBibleBooks() {
    return bibleCounts.map(b => b.book);
}

/**
 * Returns all aliases for a given book name, including the official book title, optionally normalized.
 * @public
 * @param {string} bookName - The name or alias of the book to lookup, which will be normalized internally.
 * @param {Object} [options] - Optional settings.
 * @param {boolean} [options.normalized=false] - If true, returns all aliases normalized (lowercased and stripped of special characters).
 * @returns {string[]|null} - An array of aliases including the official book name, either normalized or in original form, or null if no matching book is found.
 * @example
 * // Returns non-normalized aliases for "Second Corinthians"
 * listAliases('Second Corinthians');
 * // Expected output: ["2 Corinthians", "2 Co", ...other aliases]
 * // Returns normalized aliases for "Song" with normalization enabled
 * listAliases('Song', { normalized: true });
 * // Expected output: ["songofsolomon", "canticleofcanticles", "sos", ...]
 * // Returns null for unrecognized or empty book names
 * listAliases('UnknownBook'); // null
 * listAliases(null);          // null
 * listAliases('');            // null
 */
function listAliases(bookName, { normalized = false } = {}) {
    const book = getBook(bookName);
    if (!book) return null;
    if (normalized) {
        return [book.book, ...book.aliases]
            .map(normalizeBookName)
            .filter(s => s != null);
    }
    return [book.book, ...book.aliases];
}

/**
 * Returns an array of chapter numbers for a given Bible book, starting from 1 up to the total chapter count.
 * @public
 * @param {string} bookName - The name or alias of the book to lookup, which will be normalized internally.
 * @returns {number[]|null} - An array of chapter numbers from 1 to the book's chapter count, or null if the book is invalid or not found.
 * @example
 * // Returns an array [1, 2, ..., 40] for Exodus, which has 40 chapters
 * listChapters('Exodus'); // [1, 2, 3, ..., 40]
 * // Returns null for an invalid or unknown book
 * listChapters('UnknownBook'); // null
 */
function listChapters(bookName) {
    const count = getChapterCount(bookName);
    if (count == null) return null;
    return Array.from({ length: count }, (_, i) => i + 1);
}


/**
 * Lists all verse numbers for a given book and chapter as a sequential array starting from 1.
 * @public
 * @param {string} bookName - The name or alias of the book to lookup, which will be normalized internally.
 * @param {number} chapter - The chapter number within the book.
 * @returns {number[]|null} - An array of verse numbers from 1 up to the chapter's verse count, or null if the book or chapter is invalid or out of range.
 * @example
 * // Returns an array of verses [1, 2, ..., 31] for Genesis chapter 1
 * listVerses('Genesis', 1); // [1, 2, 3, ..., 31]
 * // Returns null for a missing chapter parameter
 * listVerses('Genesis'); // null
 * // Returns null for an invalid chapter number or unknown book
 * listVerses('Genesis', 0); // null
 * listVerses('Genesis', 999); // null
 * listVerses('UnknownBook', 1); // null
 */
function listVerses(bookName, chapter) {
    const verseCount = getVerseCount(bookName, chapter);
    if (verseCount == null) return null;
    return Array.from({ length: verseCount }, (_, i) => i + 1);
}

export {
    getBook,
    getChapterCount,
    getVerseCount,
    listBibleBooks,
    listAliases,
    listChapters,
    listVerses
};