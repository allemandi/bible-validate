import { parseBibleReference } from './normalizer.js';
import { getBook } from './lookup.js';
import { isValidReference } from './validator.js';


/**
 * Formats a scripture reference string based on the provided input. Input is not normalized.
 * @public
 * @param {Object} reference - The reference object.
 * @param {string} reference.book - The name of the book (e.g., "Genesis").
 * @param {number} [reference.chapter] - The chapter number.
 * @param {number} [reference.verseStart] - The starting verse number.
 * @param {number|null} [reference.verseEnd] - The ending verse number (optional, used for ranges).
 * @returns {string} - A formatted Bible reference (e.g., "Genesis 1:1-5"). Returns an empty string if no input is provided.
 * @example
 * formatReference({}); // ''
 * formatReference({ book: 'Genesis' }); // 'Genesis'
 * formatReference({ book: 'Genesis', chapter: 1 }); // 'Genesis 1'
 * formatReference({ book: 'Genesis', chapter: 1, verseStart: 1 }); // 'Genesis 1:1'
 * formatReference({ book: 'Genesis', chapter: 1, verseStart: 1, verseEnd: 5 }); // 'Genesis 1:1-5'
 * formatReference({ book: 'Genesis', chapter: 1, verseStart: 3, verseEnd: 3 }); // 'Genesis 1:3'
 */
function formatReference({ book, chapter, verseStart, verseEnd }) {
    if (!book || !chapter) return book || '';

    if (verseStart == null) return `${book} ${chapter}`;
    if (verseEnd == null || verseEnd === verseStart) return `${book} ${chapter}:${verseStart}`;

    return `${book} ${chapter}:${verseStart}-${verseEnd}`;
}

/**
 * Parses and validates a Bible reference string.
 * @public
 * @param {string} reference - The raw Bible reference string to be parsed, normalized, and formatted (e.g., "Genesis 1:1", "Letter to the Romans. Ch 2 , 1 to 3").
 * @param {{ structured?: boolean }} [options] - Optional configuration, return structured object or just the formatted result.
 * @returns {SimpleResult|StructuredResult} - Result object depending on options.structured.
 * @example
 * parseAndValidateReference('  GN. Ch 1 , 1 to 3');
 * // → { isValid: true, formatted: 'Genesis 1:1-3', error: null, original: '  GN. Ch 1 , 1 to 3' }
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
 * parseAndValidateReference('Book of Judas 1:1');
 * // → { isValid: false, error: 'Invalid book name', original: 'Book of Judas 1:1' }
 */
function parseAndValidateReference(reference, { structured = false } = {}) {
    /**
     * @private
     * @param {string} msg
     * @returns {{ isValid: false, error: string, original: string }}
     */
    const fail = (msg) => ({ isValid: false, error: msg, original: reference });

    if (typeof reference !== 'string' || !reference.trim()) {
        return fail('Empty or invalid input');
    }

    /** 
     * @private
     * @type {ParsedReference|null}
     */
    const parsed = parseBibleReference(reference);
    if (!parsed?.book) return fail('Could not parse reference');

    const bookObj = getBook(parsed.book);
    if (!bookObj) return fail('Invalid book name');

    const chapter = parsed.chapter ?? null;
    const verseStart = parsed.verseStart ?? null;
    const verseEnd = parsed.verseEnd ?? null;

    if (chapter === null || verseStart === null) {
        return fail('Missing chapter or verse');
    }

    if (!isValidReference(bookObj.book, chapter, verseStart, verseEnd)) {
        return fail('Invalid chapter or verse');
    }

    const formatted = formatReference({ book: bookObj.book, chapter, verseStart, verseEnd });

    const base = {
        isValid: true,
        formatted,
        error: null,
        original: reference,
    };

    return structured
        ? {
            ...base,
            book: bookObj.book,
            chapter,
            verseStart,
            verseEnd,
        }
        : base;
}

export {
    parseAndValidateReference,
    formatReference,
}

// --- JSDoc Type Definitions ---
/**
 * @private
 * @typedef {Object} SimpleResult
 * @property {boolean} isValid
 * @property {string|null} error
 * @property {string} original
 * @property {string} [formatted]
 *
 * @typedef {Object} StructuredResult
 * @property {boolean} isValid
 * @property {string} book
 * @property {number} chapter
 * @property {number|null} verseStart
 * @property {number|null} verseEnd
 * @property {string|null} error
 * @property {string} original
 * @property {string} [formatted]
 *
 */
