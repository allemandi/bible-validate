import bibleCounts from '../data/bibleCounts.json';
import { normalizeBook } from './normalizer';

/**
 * Returns the book object (including aliases and chapters) or null.
 */
function getBook(book) {
  const query = normalizeBook(book);
  return bibleCounts.find(
    (b) => normalizeBook(b.book) === query || b.aliases.map(normalizeBook).includes(query)
  ) || null;
}

/**
 * Returns the number of chapters in the given book.
 */
function getChapterCount(name) {
  const book = getBook(name);
  return book ? book.chapters.length : null;
}

/**
 * Returns the number of verses in the given chapter of the book.
 */
function getVerseCount(name, chapter) {
  const book = getBook(name);
  if (!book || chapter < 1 || chapter > book.chapters.length) return null;
  return book.chapters[chapter - 1];
}


export {
  getBook,
  getChapterCount,
  getVerseCount,
};