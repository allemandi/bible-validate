import { getBook } from './lookup.js';

/**
 * Checks if a given book name or alias corresponds to a valid Bible book.
 *
 * @param {string|null|undefined} book - The name or alias of the book to lookup, which will be normalized internally.
 * @returns {boolean} - True if the book exists in the Bible collection, false otherwise.
 *
 * @example
 * // Valid full book name returns true
 * isValidBook('Genesis'); // true
 *
 * @example
 * // Valid alias, case-insensitive, returns true
 * isValidBook('gEn'); // true
 *
 * @example
 * // Unknown book returns false
 * isValidBook('Judas'); // false
 *
 * @example
 * // Empty string returns false
 * isValidBook(''); // false
 *
 * @example
 * // Null or undefined input returns false
 * isValidBook(null); // false
 * isValidBook(undefined); // false
 */
function isValidBook(book) {
    return getBook(book) !== null;
}

/**
 * Checks if the given chapter number is valid for the specified Bible book.
 *
 * @param {string} book - The name or alias of the book to lookup, which will be normalized internally.
 * @param {number} chapter - The chapter number to check, expected to be a positive integer.
 * @returns {boolean} - True if the chapter is within the valid range for the book; otherwise, false.
 *
 * @example
 * // Valid chapters for Genesis include 1 and 50
 * isValidChapter('Genesis', 1);  // true
 * isValidChapter('Genesis', 50); // true
 *
 * @example
 * // Invalid chapters are below 1 or above the book's chapter count
 * isValidChapter('Genesis', 0);  // false
 * isValidChapter('Genesis', 51); // false
 * isValidChapter('Genesis', -1); // false
 *
 * @example
 * // Returns false if the book is unknown or input is null/undefined
 * isValidChapter('Judas', 1);    // false
 * isValidChapter(null, 1);       // false
 * isValidChapter('Genesis', null); // false
 */
function isValidChapter(book, chapter) {
    const bookObj = getBook(book);
    if (!bookObj) return false;
    return chapter >= 1 && chapter <= bookObj.chapters.length;
}

/**
 * Validates whether a given Bible reference consisting of book, chapter, and verse(s) is valid.
 *
 * @param {string} book - The name or alias of the book to lookup, which will be normalized internally.
 * @param {number} chapter - The chapter number, must be a positive integer within the book's chapter count.
 * @param {number} verseStart - The starting verse number, must be a positive integer within the chapter's verse count.
 * @param {number|null} [verseEnd=null] - Optional ending verse number, must be greater than or equal to verseStart and within the chapter's verse count if provided.
 * @returns {boolean} True if the reference is valid within the book's chapter and verse bounds, otherwise false.
 *
 * @example
 * // Valid single verse in Genesis chapter 1
 * isValidReference('Genesis', 1, 1); // true
 *
 * @example
 * // Valid last verse in Genesis chapter 1
 * isValidReference('Genesis', 1, 31); // true
 *
 * @example
 * // Invalid verse number exceeding the number of verses in chapter 1 of Genesis
 * isValidReference('Genesis', 1, 32); // false
 *
 * @example
 * // Invalid chapter number (0) in Genesis
 * isValidReference('Genesis', 0, 1); // false
 *
 * @example
 * // Invalid verse number (0) in Genesis chapter 1
 * isValidReference('Genesis', 1, 0); // false
 *
 * @example
 * // Invalid unknown book name returns false
 * isValidReference('Blah', 1, 1); // false
 *
 * @example
 * // Reference with a verse range, valid only if verseEnd >= verseStart and within chapter verse count
 * isValidReference('Genesis', 1, 1, 5); // true
 *
 * @example
 * // Case-insensitive book name input is accepted
 * isValidReference('gEnEsIs', 1, 1); // true
 */
function isValidReference(book, chapter, verseStart, verseEnd = null) {
    const bookObj = getBook(book);
    if (!bookObj || !isValidChapter(book, chapter)) return false;
    const maxVerses = bookObj.chapters[chapter - 1];
    if (verseStart < 1 || verseStart > maxVerses) return false;
    if (verseEnd !== null) {
        if (verseEnd < verseStart || verseEnd > maxVerses) return false;
    }
    return true;
}

export {
    isValidBook,
    isValidChapter,
    isValidReference
};