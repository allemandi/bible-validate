import { getBook } from './lookup.js';

/**
 * Returns true if the book name or alias is valid.
 */
function isValidBook(book) {
    return getBook(book) !== null;
}

function isValidChapter(book, chapter) {
    const bookObj = getBook(book);
    if (!bookObj) return false;
    return chapter >= 1 && chapter <= bookObj.chapters.length;
}

function isValidVerses(book, chapter, verseStart, verseEnd = null) {
    const bookObj = getBook(book);
    if (!bookObj || !isValidChapter(book, chapter)) return false;
    const maxVerses = bookObj.chapters[chapter - 1];
    if (verseStart < 1 || verseStart > maxVerses) return false;
    if (verseEnd !== null) {
        if (verseEnd < verseStart || verseEnd > maxVerses) return false;
    }
    return true;
}

/**
 * Returns true if the given book, chapter, and verse is valid.
 */
function isValidReference(book, chapter, verseStart, verseEnd = null) {
    const bookObj = getBook(book);
    if (!bookObj) return false;

    return (
        isValidChapter(book, chapter) &&
        isValidVerses(book, chapter, verseStart, verseEnd)
    );
}

export {
    isValidBook,
    isValidChapter,
    isValidVerses,
    isValidReference
};