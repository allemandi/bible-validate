# 📖 @allemandi/bible-validate

[![NPM Version](https://img.shields.io/npm/v/@allemandi/bible-validate)](https://www.npmjs.com/package/@allemandi/bible-validate)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/allemandi/bible-validate/blob/main/LICENSE)

> Utilities for validating and parsing Bible references
> Supports ESM, CommonJS, and UMD – works in modern builds, Node.js, and browsers.

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
ESM
```bash
import {
    parseAndValidateReference,
    isValidBook,
    getChapterCount,
} from '@allemandi/bible-validate';
const ref = 'GeN Chapter 3:  16 to 18';
const result = parseAndValidateReference(ref, {structured: true})
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
console.log(getVerseCount('Rev', 3)) // 22
```
CommonJS
```bash
const { parseAndValidateReference } = require('@allemandi/bible-validate');
```

## 📦 API
`parseAndValidateReference(reference: string, options?: { structured?: boolean })`

Parses and validates a Bible reference string. Returns an object with:
- isValid (boolean)
- error (string|null)
- original (input string)
- formatted (string) - human-readable reference
- optionally (if { structured: true }):
  - book (string)
  - chapter (number)
  - verseStart (number|null)
  - verseEnd (number|null)

`formatReference({ book, chapter, verseStart, verseEnd })`

Formats a Bible reference object into a string, e.g., "Genesis 1:1-5".

`getBook(bookName: string): BookObject | null`

 Returns the full book object (including aliases and chapter data) if valid, otherwise null.

`getChapterCount(bookName: string): number | null`

Returns the number of chapters in the specified book, or null if invalid.

`getVerseCount(bookName: string, chapter: number): number | null`

Returns the number of verses in the specified chapter of the book, or null if invalid.

`normalizeBookName(bookName: string | null): string | null`

Normalizes a book name string by trimming and converting to lowercase for consistent comparisons.

`parseChapterVerse(str: string): { chapter: number, verseStart: number|null, verseEnd: number|null } | null`

Parse chapter and verse portion from a string. Supports single chapters, chapter+verse, and verse ranges.

`extractBookAndRange(ref: string): [string|null, string|null]`

Extracts the book name and chapter/verse range strings from a reference string.

`parseBibleReference(ref: string): { book: string|null, chapter: number|null, verseStart: number|null, verseEnd: number|null } | null`
Parse a full Bible reference into normalized book and chapter/verse info.


`isValidBook(bookName: string): boolean`

Returns true if the given book name or alias is valid.

`isValidChapter(bookName: string, chapter: number): boolean`

Returns true if the chapter number is valid for the specified book.

`isValidVerses(bookName: string, chapter: number, verseStart: number, verseEnd?: number): boolean`

Returns true if the verse(s) are valid within the specified book and chapter.

`isValidReference(bookName: string, chapter: number, verse: number): boolean`

Returns true if the full reference (book, chapter, and verse) is valid.


## 🧪 Tests
```bash
# Run the test suite with Jest
yarn test
# or
npm test
```

## 📦 Build Details
This package is bundled with microbundle, providing:
- ESM (recommended for modern projects)
- CommonJS for Node.js compatibility
- UMD (for use directly in browsers)

Import as shown above for your environment.

## 🤝 Contributing
If you have ideas, improvements, or new features:

1. Fork the project
2. Create your feature branch (git checkout -b feature/amazing-feature)
3. Commit your changes (git commit -m 'Add some amazing feature')
4. Push to the branch (git push origin feature/amazing-feature)
5. Open a Pull Request