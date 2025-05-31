/**
 * @typedef {Object} ParsedReference
 * @property {string|null} book
 * @property {number|null} chapter
 * @property {number|null} verseStart
 * @property {number|null} verseEnd
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
