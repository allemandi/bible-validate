import { getBook, getVerseCount } from './lookup.js';

/**
 * Returns true if the book name or alias is valid.
 */
function isValidBook(book) {
  return getBook(book) !== null;
}

/**
 * Returns true if the given book, chapter, and verse is valid.
 */
function isValidReference(name, chapter, verse) {
  const maxVerses = getVerseCount(name, chapter);
  return maxVerses !== null && verse >= 1 && verse <= maxVerses;
}

export {
    isValidBook,
    isValidReference
};