/**
 * @typedef {Object} BibleBook
 * @property {string} book - The canonical name of the book.
 * @property {string[]} aliases - Alternative names or abbreviations for the book.
 * @property {number[]} chapters - Array of verse counts for each chapter.
 */

/**
 * @typedef {Object} ParsedReference
 * @property {string|null} book - The normalized book name
 * @property {number|null} chapter - The chapter number
 * @property {number|null} verseStart - The starting verse number
 * @property {number|null} verseEnd - The ending verse number (for ranges)
 */

export {};