/**
 * Normalize book ref
 * - unified string prefix remover, "The Epistle to the", "Book of", "Gospel according to"
 * - Converts common ordinals after string remover, "1st", "first" to "1"
 * - Lowercases and removes non-alphanumeric characters
 */
function normalizeBookName(name) {
    if (!name) return null;
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
        const prefix = prefixMap[prefixMatch[0]];
        cleaned = prefix + ' ' + cleaned.slice(prefixMatch[0].length).trim();
    }
    return cleaned.replace(/[^a-z0-9]/g, '');
}

/**
 * Parse chapter and verse portion of a reference string.
 * Supports:
 * - single chapter ("23")
 * - chapter and verse ["4:2", "4 2"
 * - verse ranges ["chap. 13, v3 to 8", "Chapter 13 Verses 4–7"]
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
 * Extracts book name and chapter/verse range from a reference string.
 * - Book part is the first part of the string until a digit or end of string
 * - Identifies chapter strings like "chapter", "chap.", or digits 
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

function parseBibleReference(ref) {
    if (!ref || typeof ref !== 'string') return null;

    const cleanedRef = ref.trim().replace(/\s+/g, ' ');
    const [bookRaw, chapterVerseRaw] = extractBookAndRange(cleanedRef);

    const book = normalizeBookName(bookRaw);

    if (!book) {
        return {
            book: null,
            chapter: null,
            verseStart: null,
            verseEnd: null,
        };
    }

    const chapVerse = parseChapterVerse(chapterVerseRaw);

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