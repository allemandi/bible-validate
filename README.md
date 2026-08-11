# 📖 @allemandi/bible-validate

[![NPM Version](https://img.shields.io/npm/v/@allemandi/bible-validate)](https://www.npmjs.com/package/@allemandi/bible-validate)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/allemandi/bible-validate/blob/main/LICENSE)

> **Fast, type-safe utilities for parsing, validating, and normalizing Bible references.**
>
> Works in Node.js, browsers – supports ESM, CommonJS, UMD, and TypeScript.

<!-- omit from toc -->

## 🔖 Table of Contents

- [✨ Features](#-features)
- [🛠️ Installation](#️-installation)
- [🚀 Quick Usage Examples](#-quick-usage-examples)
- [📚 API Reference](#-api-reference)
  - [parseBibleReference](#parsebiblereference)
  - [normalizeBookName](#normalizebookname)
  - [parseChapterVerse](#parsechapterverse)
  - [extractBookAndRange](#extractbookandrange)
  - [isValidBook](#isvalidbook)
  - [isValidChapter](#isvalidchapter)
  - [isValidReference](#isvalidreference)
  - [formatReference](#formatreference)
  - [parseAndValidateReference](#parseandvalidatereference)
  - [getBook](#getbook)
  - [getChapterCount](#getchaptercount)
  - [getVerseCount](#getversecount)
  - [listBibleBooks](#listbiblebooks)
  - [listAliases](#listaliases)
  - [listChapters](#listchapters)
  - [listVerses](#listverses)
- [🧪 Tests](#-tests)
- [🤝 Contributing](#-contributing)

## ✨ Features

- Validate Bible book names and aliases
- Get chapter and verse counts
- Normalize references (e.g. `"III John Chapter 1 verses 3 - 8"` to `"3 John 1:3-8"`)
- Validate full references (book, chapter, verse range)
- Parse and format Bible references with optional structured output

## 🛠️ Installation

```bash
# Yarn
yarn add @allemandi/bible-validate

# or NPM
npm install @allemandi/bible-validate
```

## 🚀 Quick Usage Examples

**ESM**

```js
import { parseAndValidateReference, isValidBook, getChapterCount } from '@allemandi/bible-validate';
const ref = 'GeN Chapter 3:  16 to 18';
const result = parseAndValidateReference(ref, { structured: true });
console.log(result);
//  {
//     isValid: true,
//     book: 'Genesis',
//     chapter: 3,
//     verseStart: 16,
//     verseEnd: 18,
//     formatted: 'Genesis 3:16-18',
//     error: null,
//     original: 'GeN Chapter 3:  16 to 18'
//   }

// Check book validity
console.log(isValidBook('Second Chronicles')); // true

// Get verse count for specific chapter in a book
console.log(getVerseCount('Rev', 3)); // 22
```

**CommonJS**

```js
const { parseAndValidateReference } = require('@allemandi/bible-validate');
```

**UMD (Browser)**

```html
<script src="https://unpkg.com/@allemandi/bible-validate"></script>
<script>
  const result = window.bibleValidate.parseAndValidateReference('John 3:16');
  console.log(result);
</script>
```

## 📚 API Reference

---

### parseBibleReference

Parses a Bible reference string into its book, chapter, and verse components, supporting various formats and spacing.

#### Parameters

- `ref` (`string`): The Bible reference string to parse, which may include ordinal prefixes, varying case, punctuation, and verse ranges.

#### Return Value

- `ParsedReference | null`: An object with normalized book name, chapter, verseStart, and verseEnd fields, or null if the input is not a string.

#### Examples

```javascript
// Parses ordinal prefix and returns structured reference
parseBibleReference('2nd Kings 4:2');
// { book: '2kings', chapter: 4, verseStart: 2, verseEnd: null }

// Handles mixed casing, chapter/verse labels, and verse range
parseBibleReference(' Iii JohN  Chap. 1 verses 9 to  11');
// { book: '3john', chapter: 1, verseStart: 9, verseEnd: 11 }

// Returns null fields when chapter and verse are omitted
parseBibleReference('Genesis');
// { book: 'genesis', chapter: null, verseStart: null, verseEnd: null }

// Cleans and parses input with excessive spacing
parseBibleReference('  1st   Samuel    17 : 4-9 ');
// { book: '1samuel', chapter: 17, verseStart: 4, verseEnd: 9 }

// Returns null for invalid or non-string input
parseBibleReference('!!!');
// { book: null, chapter: null, verseStart: null, verseEnd: null }
parseBibleReference(42); // null
```

---

### normalizeBookName

Normalizes a Bible book name or alias by trimming spaces, removing common prefixes, converting ordinal prefixes to digits, and stripping non-alphanumeric characters.

#### Parameters

- `name` (`string`): The raw book name or alias to normalize, possibly with prefixes, punctuation, and mixed case.

#### Return Value

- `string | null`: A cleaned lowercase alphanumeric string with numeric prefixes for ordinals, or null if input is null or undefined.

#### Examples

```javascript
// Converts ordinal prefix to digit and removes punctuation
normalizeBookName('1st John'); // '1john'

// Removes unified prefixes and lowercases the name
normalizeBookName('The Epistle to the Romans'); // 'romans'

// Strips non-alphanumeric characters and trims spaces
normalizeBookName('  Book of *EX*  '); // 'ex'

// Returns null if input is null or undefined
normalizeBookName(null); // null
```

---

### parseChapterVerse

Parses a string representing a chapter and optional verse or verse range into an object with numeric values.

#### Parameters

- `str` (`string`): The string containing chapter and verse references, which may include words, punctuation, and ranges.

#### Return Value

- `Object | null`: An object with shape `{ chapter, verseStart, verseEnd }` or null if no numeric chapter is present.

#### Examples

```javascript
// Parses chapter only reference
parseChapterVerse('12'); // { chapter: 12, verseStart: null, verseEnd: null }

// Parses chapter and single verse reference
parseChapterVerse('5:3'); // { chapter: 5, verseStart: 3, verseEnd: null }

// Parses chapter with verse range including words and punctuation
parseChapterVerse('Chapter 13 Verses 4–7'); // { chapter: 13, verseStart: 4, verseEnd: 7 }

// Parses chapter with verse range using "to" as a separator
parseChapterVerse('chap. 13, v3 to 8'); // { chapter: 13, verseStart: 3, verseEnd: 8 }

// Returns null if no numeric chapter is present
parseChapterVerse('nonsense'); // null

// Parses chapter and verse range with extra whitespace and punctuation
parseChapterVerse('  10 : 2  - 6 '); // { chapter: 10, verseStart: 2, verseEnd: 6 }

// Handles pure whitespace and number combination
parseChapterVerse('  11  1   2 '); // { chapter: 11, verseStart: 1, verseEnd: 2 }
```

---

### extractBookAndRange

Splits a Bible reference string into the book name and chapter/verse range parts, trimming empty space. No further normalization.

#### Parameters

- `ref` (`string`): The Bible reference string containing a book name optionally followed by a chapter/verse range.

#### Return Value

- `Array<string | null>`: An array in the format `[bookName, range]` or `[null, null]` for empty or invalid input.

#### Examples

```javascript
// Extracts book and range from a standard reference
extractBookAndRange('1st John 3:16'); // ['1st John', '3:16']

// Extracts book name with punctuation and range
extractBookAndRange('The Revelation 4:5'); // ["The Revelation", '4:5']

// Returns book name with empty range when no range is given
extractBookAndRange('Genesis'); // ['Genesis', '']

// Returns [null, null] for empty or invalid input
extractBookAndRange(''); // [null, null]

// Handles leading spaces and complex ranges with simple chapter abbreviations
extractBookAndRange(' Exodus   12. 1 to 3'); // ['Exodus', '12. 1 to 3']
extractBookAndRange('Exodus Chapter 12:1-3'); // ['Exodus', 'Chapter 12:1-3']
extractBookAndRange(' Exodus  Ch. 12. 1 to 3'); // ['Exodus', 'Ch. 12. 1 to 3']
extractBookAndRange('second Kings Chape 1 to 3'); // ['second Kings Chape', '1 to 3']
```

---

### isValidBook

Checks if a given book name or alias corresponds to a valid Bible book.

#### Parameters

- `book` (`string | null | undefined`): The name or alias of the book to lookup, which will be normalized internally.

#### Return Value

- `boolean`: True if the book exists in the Bible collection, false otherwise.

#### Examples

```javascript
// Valid full book name returns true
isValidBook('Genesis'); // true

// Valid alias, case-insensitive, returns true
isValidBook('gEn'); // true

// Unknown book returns false
isValidBook('Judas'); // false

// Empty string returns false
isValidBook(''); // false

// Null or undefined input returns false
isValidBook(null); // false
isValidBook(undefined); // false
```

---

### isValidChapter

Checks if the given chapter number is valid for the specified Bible book.

#### Parameters

- `book` (`string`): The name or alias of the book to lookup, which will be normalized internally.
- `chapter` (`number`): The chapter number to check, expected to be a positive integer.

#### Return Value

- `boolean`: True if the chapter is within the valid range for the book; otherwise, false.

#### Examples

```javascript
// Valid chapters for Genesis include 1 and 50
isValidChapter('Genesis', 1); // true
isValidChapter('Genesis', 50); // true

// Invalid chapters are below 1 or above the book's chapter count
isValidChapter('Genesis', 0); // false
isValidChapter('Genesis', 51); // false
isValidChapter('Genesis', -1); // false

// Returns false if the book is unknown or input is null/undefined
isValidChapter('Judas', 1); // false
isValidChapter(null, 1); // false
isValidChapter('Genesis', null); // false
```

---

### isValidReference

Validates whether a given Bible reference consisting of book, chapter, and verse(s) is valid.

#### Parameters

- `book` (`string`): The name or alias of the book to lookup, which will be normalized internally.
- `chapter` (`number`): The chapter number, must be a positive integer within the book's chapter count.
- `verseStart` (`number`): The starting verse number, must be a positive integer within the chapter's verse count.
- `verseEnd` (`number | null`, optional, default `null`): Optional ending verse number, must be greater than or equal to verseStart and within the chapter's verse count if provided.

#### Return Value

- `boolean`: True if the reference is valid within the book's chapter and verse bounds, otherwise false.

#### Examples

```javascript
// Valid single verse in Genesis chapter 1
isValidReference('Genesis', 1, 1); // true

// Valid last verse in Genesis chapter 1
isValidReference('Genesis', 1, 31); // true

// Invalid verse number exceeding the number of verses in chapter 1 of Genesis
isValidReference('Genesis', 1, 32); // false

// Invalid chapter number (0) in Genesis
isValidReference('Genesis', 0, 1); // false

// Invalid verse number (0) in Genesis chapter 1
isValidReference('Genesis', 1, 0); // false

// Invalid unknown book name returns false
isValidReference('Blah', 1, 1); // false

// Reference with a verse range, valid only if verseEnd >= verseStart and within chapter verse count
isValidReference('Genesis', 1, 1, 5); // true

// Case-insensitive book name input is accepted
isValidReference('gEnEsIs', 1, 1); // true
```

---

### formatReference

Formats a scripture reference string based on the provided input. Input is not normalized.

#### Parameters

- `reference` (`Object`): The reference object.
  - `reference.book` (`string`): The name of the book (e.g., "Genesis").
  - `reference.chapter` (`number`, optional): The chapter number.
  - `reference.verseStart` (`number`, optional): The starting verse number.
  - `reference.verseEnd` (`number | null`, optional): The ending verse number (optional, used for ranges).

#### Return Value

- `string`: A formatted Bible reference (e.g., "Genesis 1:1-5"). Returns an empty string if no input is provided.

#### Examples

```javascript
formatReference({}); // ''
formatReference({ book: 'Genesis' }); // 'Genesis'
formatReference({ book: 'Genesis', chapter: 1 }); // 'Genesis 1'
formatReference({ book: 'Genesis', chapter: 1, verseStart: 1 }); // 'Genesis 1:1'
formatReference({ book: 'Genesis', chapter: 1, verseStart: 1, verseEnd: 5 }); // 'Genesis 1:1-5'
formatReference({ book: 'Genesis', chapter: 1, verseStart: 3, verseEnd: 3 }); // 'Genesis 1:3'
```

---

### parseAndValidateReference

Parses and validates a Bible reference string.

#### Parameters

- `reference` (`string`): The raw Bible reference string to be parsed, normalized, and formatted (e.g., "Genesis 1:1", "Letter to the Romans. Ch 2 , 1 to 3").
- `options` (`Object`, optional, default `{}`): Optional configuration.
  - `options.structured` (`boolean`, optional, default `false`): If true, returns the detailed structured object.

#### Return Value

- `SimpleResult | StructuredResult`: Result object depending on `options.structured`.

#### Examples

```javascript
parseAndValidateReference('  GN. Ch 1 , 1 to 3');
// → { isValid: true, formatted: 'Genesis 1:1-3', error: null, original: '  GN. Ch 1 , 1 to 3' }

parseAndValidateReference('gEnEsIs 1 verse 1', { structured: true });
// → {
//     isValid: true,
//     book: 'Genesis',
//     chapter: 1,
//     verseStart: 1,
//     verseEnd: null,
//     formatted: 'Genesis 1:1',
//     error: null,
//     original: 'gEnEsIs 1 verse 1'
//   }

parseAndValidateReference('Book of Judas 1:1');
// → { isValid: false, error: 'Invalid book name', original: 'Book of Judas 1:1' }
```

---

### getBook

Retrieves a book object from the Bible collection matching the given book name or its aliases, ignoring case and special characters.

#### Parameters

- `book` (`string`): The name or alias of the book to lookup, which will be normalized internally.

#### Return Value

- `BibleBook | null`: The matched book object containing book name, aliases, and chapters, or null if no match is found.

#### Examples

```javascript
// Returns the Genesis book object with its aliases and 50 chapters
getBook('Genesis'); // { book: 'Genesis', aliases: ['Gen', 'Ge', 'Gn'], chapters: [...] }

// Returns the Song of Solomon book object when queried with a normalized alias ignoring punctuation and case
getBook('The CANticle of CantiClEs !!?*'); // { book: 'Song of Solomon', aliases: [...], chapters: [...] }

// Returns null for an unknown or invalid book name
getBook('Judas'); // null
```

---

### getChapterCount

Returns the number of chapters for a given Bible book name or alias, or null if the book is not found.

#### Parameters

- `name` (`string`): The name or alias of the book to lookup, which will be normalized internally.

#### Return Value

- `number | null`: The total number of chapters in the matched book, or null if no book is found.

#### Examples

```javascript
// Returns 50 chapters for Genesis
getChapterCount('Genesis'); // 50

// Returns null for an unknown or invalid book name
getChapterCount('Judas');
```

---

### getVerseCount

Returns the number of verses in a specified chapter of a given Bible book, or null if the book or chapter is invalid.

#### Parameters

- `name` (`string`): The name or alias of the book to lookup, which will be normalized internally.
- `chapter` (`number`): The chapter number to retrieve the verse count for; must be within valid range.

#### Return Value

- `number | null`: The count of verses in the specified chapter, or null if the book is unknown or chapter is out of bounds.

#### Examples

```javascript
// Returns 25, the number of verses in Genesis chapter 2
getVerseCount('GeN.  ', 2); // 25

// Returns null for an invalid book name
getVerseCount('Judas', 1);

// Returns null for a chapter number that is too high
getVerseCount('Genesis', 999);

// Returns null for a chapter number less than 1
getVerseCount('Genesis', 0);
```

---

### listBibleBooks

Returns an array of all Bible book names in their canonical order.

#### Return Value

- `Array<string>`: An array containing 66 book names starting with Genesis and ending with Revelation.

#### Examples

```javascript
// Returns an array of 66 Bible books
listBibleBooks();

// The first and last elements are Genesis and Revelation respectively
const books = listBibleBooks();
console.log(books[0]); // "Genesis"
console.log(books[books.length - 1]); // "Revelation"
```

---

### listAliases

Returns all aliases for a given book name, including the official book title, optionally normalized.

#### Parameters

- `bookName` (`string`): The name or alias of the book to lookup, which will be normalized internally.
- `options` (`Object`, optional, default `{}`): Optional settings.
  - `options.normalized` (`boolean`, optional, default `false`): If true, returns all aliases normalized (lowercased and stripped of special characters).

#### Return Value

- `Array<string> | null`: An array of aliases including the official book name, either normalized or in original form, or null if no matching book is found.

#### Examples

```javascript
// Returns non-normalized aliases for "Second Corinthians"
listAliases('Second Corinthians');
// Expected output: ["2 Corinthians", "2 Co", ...other aliases]

// Returns normalized aliases for "Song" with normalization enabled
listAliases('Song', { normalized: true });
// Expected output: ["songofsolomon", "canticleofcanticles", "sos", ...]

// Returns null for unrecognized or empty book names
listAliases('UnknownBook'); // null
listAliases(null); // null
listAliases(''); // null
```

---

### listChapters

Returns an array of chapter numbers for a given Bible book, starting from 1 up to the total chapter count.

#### Parameters

- `bookName` (`string`): The name or alias of the book to lookup, which will be normalized internally.

#### Return Value

- `Array<number> | null`: An array of chapter numbers from 1 to the book's chapter count, or null if the book is invalid or not found.

#### Examples

```javascript
// Returns an array [1, 2, ..., 40] for Exodus, which has 40 chapters
listChapters('Exodus'); // [1, 2, 3, ..., 40]

// Returns null for an invalid or unknown book
listChapters('UnknownBook'); // null
```

---

### listVerses

Lists all verse numbers for a given book and chapter as a sequential array starting from 1.

#### Parameters

- `bookName` (`string`): The name or alias of the book to lookup, which will be normalized internally.
- `chapter` (`number`): The chapter number within the book.

#### Return Value

- `Array<number> | null`: An array of verse numbers from 1 up to the chapter's verse count, or null if the book or chapter is invalid or out of range.

#### Examples

```javascript
// Returns an array of verses [1, 2, ..., 31] for Genesis chapter 1
listVerses('Genesis', 1); // [1, 2, 3, ..., 31]

// Returns null for a missing chapter parameter
listVerses('Genesis'); // null

// Returns null for an invalid chapter number or unknown book
listVerses('Genesis', 0); // null
listVerses('Genesis', 999); // null
listVerses('UnknownBook', 1); // null
```

---

## 🧪 Tests

> Available in the GitHub repo only.

```bash
# Run the test suite with Jest
yarn test
# or
npm test
```

## 🤝 Contributing

If you have ideas, improvements, or new features:

1. Fork the project
2. Create your feature branch (git checkout -b feature/amazing-feature)
3. Commit your changes (git commit -m 'Add some amazing feature')
4. Push to the branch (git push origin feature/amazing-feature)
5. Open a Pull Request
