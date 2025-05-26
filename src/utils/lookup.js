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

/**
 * Returns an array of all book names.
 */
function listBibleBooks() {
  return bibleCounts.map(b => b.book);
}

/**
 * listAliases(bookName, options)
 *
 * @param {string} bookName
 * @param {object} [opts]
 * @param {boolean} [opts.normalized=false] 
 *        if true, returns ["1cor", "1co", ...]  (lowercase, no spaces)
 *        if false, returns ["1 Corinthians", "1 Cor", "1 Co", ...] (display-friendly default)
 */
function listAliases(bookName, { normalized = false } = {}) {
  const book = getBook(bookName);
  if (!book) return null;

  if (normalized) {
    return [book.book, ...book.aliases].map(normalizeBookName);
  }

  const minorWords = new Set(['of', 'the', 'and', 'in', 'on']); // customize as needed

  const titleCase = str => {
    const words = str.toLowerCase().split(' ');
    return words.map((word, i) =>
      (i === 0 || !minorWords.has(word))
        ? word[0].toUpperCase() + word.slice(1)
        : word
    ).join(' ');
  };

  const displayAliases = book.aliases.map(titleCase);

  return [book.book, ...displayAliases];
}

/**
 * Returns [1, 2, …, N] where N is the number of chapters in the book.
 * @returns number[] | null
 */
function listChapters(bookName) {
  const count = getChapterCount(bookName);
  if (count == null) return null;
  return Array.from({ length: count }, (_, i) => i + 1);
}

/**
 * Returns [1, 2, …, M] where M is the number of verses in that chapter.
 * @returns number[] | null
 */
function listVerses(bookName, chapter) {
  const verseCount = getVerseCount(bookName, chapter);
  if (verseCount == null) return null;
  return Array.from({ length: verseCount }, (_, i) => i + 1);
}

export {
    getBook,
    getChapterCount,
    getVerseCount,
    listBibleBooks,
    listAliases,
    listChapters,
    listVerses
};