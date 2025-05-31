

/**
 * Normalizes a Bible book name or alias by trimming spaces, removing common prefixes, 
 * converting ordinal prefixes to digits, and stripping non-alphanumeric characters.
 * @public
 * @param {string} name - The raw book name or alias to normalize, possibly with prefixes, punctuation, and mixed case.
 * @returns {string|null} - A cleaned lowercase alphanumeric string with numeric prefixes for ordinals, or null if input is null or undefined.
 * @example
 * // Converts ordinal prefix to digit and removes punctuation
 * normalizeBookName('1st John'); // '1john'
 * // Removes unified prefixes and lowercases the name
 * normalizeBookName('The Epistle to the Romans'); // 'romans'
 * // Strips non-alphanumeric characters and trims spaces
 * normalizeBookName('  Book of *EX*  '); // 'ex'
 * // Returns null if input is null or undefined
 * normalizeBookName(null); // null
 */
function normalizeBookName(name) {
    if (!name) return null;
    /** @type {Record<string, string>} */
    const prefixMap = {
        '1st': '1', 'first': '1',
        '2nd': '2', 'second': '2',
        '3rd': '3', 'third': '3',
        'iii': '3', 'ii': '2', 'i': '1',
    };
    let cleaned = name.trim().toLowerCase().replace(/\s+/g, ' ');
    cleaned = cleaned.replace(
        /^(?:the\s+)?(?:(book|epistle|gospel|letter)\s+(?:according\s+)?(?:to|for|of)(?:\s+the)?\s*)?/,
        ''
    );
    const prefixMatch = cleaned.match(/^(first|1st|second|2nd|third|3rd|iii|ii|i)\b/);
    if (prefixMatch) {
        const key = prefixMatch[0];
        if (key in prefixMap) {
            const prefix = prefixMap[key];
            cleaned = prefix + ' ' + cleaned.slice(key.length).trim();
        }
    }
    return cleaned.replace(/[^a-z0-9]/g, '');
}

/**
 * Parses a string representing a chapter and optional verse or verse range
 * into an object with numeric values.
 * @public
 * @param {string} str - The string containing chapter and verse references, which may include words, punctuation, and ranges.
 * @returns {{chapter: number, verseStart: number|null, verseEnd: number|null}|null} - An object with the chapter number and optional verse start and end numbers, or null if no valid numbers are found.
 * @example
 * // Parses chapter only reference
 * parseChapterVerse('12'); // { chapter: 12, verseStart: null, verseEnd: null }
 * // Parses chapter and single verse reference
 * parseChapterVerse('5:3'); // { chapter: 5, verseStart: 3, verseEnd: null }
 * // Parses chapter with verse range including words and punctuation
 * parseChapterVerse('Chapter 13 Verses 4–7'); // { chapter: 13, verseStart: 4, verseEnd: 7 }
 * // Parses chapter with verse range using "to" as a separator
 * parseChapterVerse('chap. 13, v3 to 8'); // { chapter: 13, verseStart: 3, verseEnd: 8 }
 * // Returns null if no numeric chapter is present
 * parseChapterVerse('nonsense'); // null
 * // Parses chapter and verse range with extra whitespace and punctuation
 * parseChapterVerse('  10 : 2  - 6 '); // { chapter: 10, verseStart: 2, verseEnd: 6 }
 * // Handles pure whitespace and number combination
 * parseChapterVerse('  11  1   2 '); // { chapter: 11, verseStart: 1, verseEnd: 2 }
 */
function parseChapterVerse(str) {
    if (!str) return null;

    const cleaned = str.toLowerCase()
        .replace(/[–—]/g, '-')
        .replace(/\bto\b/g, '-')
        .replace(/[a-z.,]/g, '')
        .replace(/\s+/g, ' ')
        .trim();

    const tokens = cleaned.split(/[\s\-:]+/).filter(Boolean);
    const nums = tokens.map(t => parseInt(t, 10)).filter(n => !isNaN(n));

    if (nums.length === 0) return null;

    switch (nums.length) {
        case 1:
            return { chapter: nums[0], verseStart: null, verseEnd: null };
        case 2:
            return { chapter: nums[0], verseStart: nums[1], verseEnd: null };
        default:
            return { chapter: nums[0], verseStart: nums[1], verseEnd: nums[2] };
    }
}
/**
 * Splits a Bible reference string into the book name and chapter/verse range parts,
 * trimming empty space. No further normalization.
 * @public
 * @param {string} ref - The Bible reference string containing a book name optionally followed by a chapter/verse range.
 * @returns {[string|null, string|null]} - A tuple where the first element is the extracted book name and the second is the range; returns [null, null] if input is invalid or empty.
 * @example
 * // Extracts book and range from a standard reference
 * extractBookAndRange('1st John 3:16'); // ['1st John', '3:16']
 * // Extracts book name with punctuation and range
 * extractBookAndRange("The Revelation 4:5"); // ["The Revelation", '4:5']
 * // Returns book name with empty range when no range is given
 * extractBookAndRange('Genesis'); // ['Genesis', '']
 * // Returns [null, null] for empty or invalid input
 * extractBookAndRange(''); // [null, null]
 * // Handles leading spaces and complex ranges with simple chapter abbreviations
 * extractBookAndRange(' Exodus   12. 1 to 3'); // ['Exodus', '12. 1 to 3']
 * extractBookAndRange('Exodus Chapter 12:1-3'); // ['Exodus', 'Chapter 12:1-3']
 * extractBookAndRange(' Exodus  Ch. 12. 1 to 3'); // ['Exodus', 'Ch. 12. 1 to 3']
 * extractBookAndRange('second Kings Chape 1 to 3'); // ['second Kings Chape', '1 to 3']
 */
function extractBookAndRange(ref) {
    if (!ref || typeof ref !== 'string') return [null, null];

    const cleaned = ref.trim().replace(/\s+/g, ' ');

    const pattern = /^([\d\w\s.']+?)\s*(?=\b(ch(?:apter)?|chap\.?)\b|\d)/i;
    const match = cleaned.match(pattern);

    if (match) {
        const book = match[1].trim();
        const range = cleaned.slice(match[0].length).trim();
        return [book, range];
    }
    return [cleaned, ''];
}


/**
 * @import { ParsedReference } from './types.js'
 */

/**
 * Parses a Bible reference string into its book, chapter, and verse components, supporting various formats and spacing.
 * @public
 * @param { string } ref - The Bible reference string to parse, which may include ordinal prefixes, varying case, punctuation, and verse ranges.
 * @returns {ParsedReference|null}- An object with normalized book name, chapter, verseStart, and verseEnd fields, or null if the input is not a string.
 * @example
 * // Parses ordinal prefix and returns structured reference
 * parseBibleReference('2nd Kings 4:2'); 
 * // { book: '2kings', chapter: 4, verseStart: 2, verseEnd: null }
 * // Handles mixed casing, chapter/verse labels, and verse range
 * parseBibleReference(' Iii JohN  Chap. 1 verses 9 to  11'); 
 * // { book: '3john', chapter: 1, verseStart: 9, verseEnd: 11 }
 * // Returns null fields when chapter and verse are omitted
 * parseBibleReference('Genesis'); 
 * // { book: 'genesis', chapter: null, verseStart: null, verseEnd: null }
 * // Cleans and parses input with excessive spacing
 * parseBibleReference('  1st   Samuel    17 : 4-9 '); 
 * // { book: '1samuel', chapter: 17, verseStart: 4, verseEnd: 9 }
 * // Returns null for invalid or non-string input
 * parseBibleReference('!!!'); 
 * // { book: null, chapter: null, verseStart: null, verseEnd: null }
 * parseBibleReference(42); // null
 */
function parseBibleReference(ref) {
    if (!ref || typeof ref !== 'string') return null;

    const cleanedRef = ref.trim().replace(/\s+/g, ' ');
    const [bookRaw, chapterVerseRaw] = extractBookAndRange(cleanedRef);

    const book = bookRaw && normalizeBookName(bookRaw);

    if (!book) {
        return {
            book: null,
            chapter: null,
            verseStart: null,
            verseEnd: null,
        };
    };

    const chapVerse = chapterVerseRaw ? parseChapterVerse(chapterVerseRaw) : null;
    return {
        book,
        chapter: chapVerse?.chapter ?? null,
        verseStart: chapVerse?.verseStart ?? null,
        verseEnd: chapVerse?.verseEnd ?? null,
    };
}


export {
    normalizeBookName,
    parseChapterVerse,
    extractBookAndRange,
    parseBibleReference,
};