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

/**
 * @typedef {Object} ParseReferenceOptions
 * @property {boolean} [structured=false] - Whether to return structured result.
 */

/**
 * @typedef {Object} SimpleResult
 * @property {boolean} isValid
 * @property {string|null} error
 * @property {string} original
 * @property {string} [formatted]
 */

/**
 * @typedef {Object} StructuredResult
 * @property {boolean} isValid
 * @property {string} book
 * @property {number} chapter
 * @property {number|null} verseStart
 * @property {number|null} verseEnd
 * @property {string|null} error
 * @property {string} original
 * @property {string} [formatted]
*/

export {};