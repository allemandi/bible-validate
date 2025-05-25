import bibleCounts from '../data/bibleCounts.json';
import { normalizeBookName } from './normalizer';

// Build a Map at load time for fast lookup by normalized book name or alias
const bookCache = new Map();

/**
 * Returns the book object (including aliases and chapters) or null.
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