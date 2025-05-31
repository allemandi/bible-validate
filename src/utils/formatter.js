import { parseBibleReference } from './normalizer.js';
import { getBook } from './lookup.js';
import { isValidReference } from './validator.js';

/**
 * Formats a scripture reference string based on the provided input. Input is not normalized.
 *
 * @param {Object} reference - The reference object.
 * @param {string} reference.book - The name of the book (e.g., "Genesis").
 * @param {number} [reference.chapter] - The chapter number.
 * @param {number} [reference.verseStart] - The starting verse number.
 * @param {number} [reference.verseEnd] - The ending verse number (optional, used for ranges).
 * 
 * @returns {string} A formatted Bible reference (e.g., "Genesis 1:1-5"). Returns an empty string if no input is provided.
 *
 * @example
 * formatReference({}); // ''
 * 
 * @example
 * formatReference({ book: 'Genesis' }); // 'Genesis'
 * 
 * @example
 * formatReference({ book: 'Genesis', chapter: 1 }); // 'Genesis 1'
 * 
 * @example
 * formatReference({ book: 'Genesis', chapter: 1, verseStart: 1 }); // 'Genesis 1:1'
 * 
 * @example
 * formatReference({ book: 'Genesis', chapter: 1, verseStart: 1, verseEnd: 5 }); // 'Genesis 1:1-5'
 * 
 * @example
 * formatReference({ book: 'Genesis', chapter: 1, verseStart: 3, verseEnd: 3 }); // 'Genesis 1:3'
 */
function formatReference({ book, chapter, verseStart, verseEnd }) {
  if (!book || !chapter) return book || '';

  if (verseStart == null) return `${book} ${chapter}`;
  if (verseEnd == null || verseEnd === verseStart) return `${book} ${chapter}:${verseStart}`;

  return `${book} ${chapter}:${verseStart}-${verseEnd}`;
}

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

/**
 * Parses and validates a Bible reference string.
 *
 * @param {string} reference - The raw Bible reference string to be parsed, normalized, and formatted (e.g., "Genesis 1:1", "Letter to the Romans. Ch 2 , 1 to 3").
 * @param {Object} [options] - Optional configuration.
 * @param {boolean} [options.structured=false] - Whether to return a structured object or just the formatted result.
 *
 * @returns {SimpleResult|StructuredResult} - Result object depending on options.structured.
 *
 * @example
 * parseAndValidateReference('  GN. Ch 1 , 1 to 3');
 * // → { isValid: true, formatted: 'Genesis 1:1-3', error: null, original: '  GN. Ch 1 , 1 to 3' }
 *
 * @example
 * parseAndValidateReference('gEnEsIs 1 verse 1', { structured: true });
 * // → {
 * //     isValid: true,
 * //     book: 'Genesis',
 * //     chapter: 1,
 * //     verseStart: 1,
 * //     verseEnd: null,
 * //     formatted: 'Genesis 1:1',
 * //     error: null,
 * //     original: 'gEnEsIs 1 verse 1'
 * //   }
 *
 * @example
 * parseAndValidateReference('Book of Judas 1:1');
 * // → { isValid: false, error: 'Invalid book name', original: 'Book of Judas 1:1' }
 */
function parseAndValidateReference(reference, { structured = false } = {}) {
  if (typeof reference !== 'string' || !reference.trim()) {
    return {
      isValid: false,
      error: 'Empty or invalid input',
      original: reference,
    };
  }

  const parsed = parseBibleReference(reference);
  if (!parsed?.book) {
    return {
      isValid: false,
      error: 'Could not parse reference',
      original: reference,
    };
  }

  const bookObj = getBook(parsed.book);
  if (!bookObj) {
    return {
      isValid: false,
      error: 'Invalid book name',
      original: reference,
    };
  }

  const { chapter, verseStart, verseEnd } = parsed;
  const valid = isValidReference(bookObj.book, chapter, verseStart, verseEnd);

  if (!valid) {
    return {
      isValid: false,
      error: 'Invalid chapter or verse',
      original: reference,
    };
  }

  const formatted = formatReference({ book: bookObj.book, chapter, verseStart, verseEnd });

  return structured
    ? {
        isValid: true,
        book: bookObj.book,
        chapter,
        verseStart,
        verseEnd,
        formatted,
        error: null,
        original: reference,
      }
    : {
        isValid: true,
        formatted,
        error: null,
        original: reference,
      };
}



export {
    parseAndValidateReference,
    formatReference,
}
