/**
 * Normalize book ref
 * - Converts common prefixes like "1st", "first" to "1"
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
    const prefixRegex = /^(first|1st|second|2nd|third|3rd|iii|ii|i)/;

    const cleaned = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const prefixMatch = cleaned.match(prefixRegex);

    return prefixMatch
        ? prefixMap[prefixMatch[0]] + cleaned.slice(prefixMatch[0].length)
        : cleaned;
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

export {
    normalizeBookName,
    parseChapterVerse
};