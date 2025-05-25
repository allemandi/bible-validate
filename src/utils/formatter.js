import { parseBibleReference } from './normalizer.js';
import { getBook } from './lookup.js';
import { isValidReference } from './validator.js';

function formatReference({ book, chapter, verseStart, verseEnd }) {
  if (!book || !chapter) return book || '';

  if (verseStart == null) return `${book} ${chapter}`;
  if (verseEnd == null || verseEnd === verseStart) return `${book} ${chapter}:${verseStart}`;

  return `${book} ${chapter}:${verseStart}-${verseEnd}`;
}

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
