# 📖 @allemandi/bible-validate

[![NPM Version](https://img.shields.io/npm/v/@allemandi/bible-validate)](https://www.npmjs.com/package/@allemandi/bible-validate)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/allemandi/bible-validate/blob/main/LICENSE)

> **Utilities for validating and parsing Bible references**
> 
> Supports ESM, CommonJS, and UMD – works in modern builds, Node.js, and browsers.


<!-- omit from toc -->
## 🔖 Table of Contents
- [✨ Features](#-features)
- [🛠️ Installation](#️-installation)
- [🚀 Quick Usage Examples](#-quick-usage-examples)
- [📦 API](#-api)
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
ESM
```js
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
```js
const { parseAndValidateReference } = require('@allemandi/bible-validate');
```
UMD (Browser)
```bash
<script src="https://unpkg.com/@allemandi/bible-validate"></script>
<script>
  const result = window.bibleValidate.parseAndValidateReference('John 3:16');
  console.log(result);
</script>
```


## 📦 API
### ℹ️ Input Normalization
String inputs get minimal normalization and basic alias matching, including:
- `"First KinGs"` → `"1 Kings"`
- `"Gen chapter 12, verses 2:4"` → `"Genesis 12:2–4"`
- `"Canticles"` → `"Song of Solomon"`
- `"Gospel according to John"` → `"John"`
- Case, punctuation, and ordinals normalized

Normalization details and examples are included in documentation.

### `formatReference({ book, chapter, verseStart, verseEnd })`

- Formats a parsed Bible reference object into a human-readable string.

#### Parameters

- `book` (`string`): The name of the Bible book.
- `chapter` (`number`): The chapter number.
- `verseStart` (`number`, optional): The starting verse number.
- `verseEnd` (`number`, optional): The ending verse number.

#### Returns

- `string`: A formatted string in the form:
  - `"Book"` (if only book is provided)
  - `"Book Chapter"` (if no verses provided)
  - `"Book Chapter:Verse"` (if a single verse is provided)
  - `"Book Chapter:Start-End"` (if a verse range is provided)

#### Examples

```js
formatReference({ book: 'Genesis' });
// => 'Genesis'

formatReference({ book: 'Genesis', chapter: 1 });
// => 'Genesis 1'

formatReference({ book: 'Genesis', chapter: 1, verseStart: 1 });
// => 'Genesis 1:1'

formatReference({ book: 'Genesis', chapter: 1, verseStart: 1, verseEnd: 5 });
// => 'Genesis 1:1-5'

formatReference({ book: 'Genesis', chapter: 1, verseStart: 3, verseEnd: 3 });
// => 'Genesis 1:3'
```

### parseAndValidateReference(reference, { structured = false } = {})

- Parses a Bible reference string and validates its structure and content.

#### Parameters

- reference (string): The Bible reference string to parse (e.g., 'Genesis 1:1-3').
- structured (boolean, optional): Whether to return a structured object. Default: false.

#### Returns
- If the input is invalid:

```js
{
  isValid: false,
  error: string,         // Description of the validation failure
  original: string|null  // The original input value
}
```

- If the input is valid and `structured` is `false`:
```js
{
  isValid: true,
  formatted: string,     // Formatted reference string
  error: null,
  original: string       // Original input
}
```

- If the input is valid and `structured` is `true`:
```js
{
  isValid: true,
  book: string,
  chapter: number,
  verseStart: number,
  verseEnd: number|null,
  formatted: string,
  error: null,
  original: string
}
```
#### Examples
```js
parseAndValidateReference('');
// => { isValid: false, error: 'Empty or invalid input', original: '' }

parseAndValidateReference('Book of Judas 1:1');
// => { isValid: false, error: 'Invalid book name', original: 'Book of Judas 1:1' }

parseAndValidateReference('Genesis 99:1');
// => { isValid: false, error: 'Invalid chapter or verse', original: 'Genesis 99:1' }

parseAndValidateReference('Genesis 1:1');
// => { isValid: true, formatted: 'Genesis 1:1', error: null, original: 'Genesis 1:1' }

parseAndValidateReference('Genesis 1:1-3');
// => { isValid: true, formatted: 'Genesis 1:1-3', error: null, original: 'Genesis 1:1-3' }

parseAndValidateReference('Genesis 1:1', { structured: true });
// => {
//   isValid: true,
//   book: 'Genesis',
//   chapter: 1,
//   verseStart: 1,
//   verseEnd: null,
//   formatted: 'Genesis 1:1',
//   error: null,
//   original: 'Genesis 1:1'
// }

parseAndValidateReference('  GN. Ch 1 , 1 to 3');
// => { isValid: true, formatted: 'Genesis 1:1-3', error: null, original: '  GN. Ch 1 , 1 to 3' }
```

### `getBook(book)`

- Looks up a Bible book by name or alias and returns detailed book metadata if found.

#### Parameters

- `book` (`string`): The name or alias of the book to look up.

#### Returns

- `object|null`: An object with the structure:

```js
  {
    book: string,         // Standardized book name
    aliases: string[],    // List of aliases
    chapters: number[]    // Array of verse counts per chapter
  }
```

- Or null if the book is not found.
#### Examples

```js
getBook('Genesis');
// => {
//   book: 'Genesis',
//   aliases: ['gen', ...],
//   chapters: [31, 25, 24, ..., 26] // verses per chapter
// }

getBook('gen');
// => { book: 'Genesis', ... }

getBook('Judas');
// => null
```

### getChapterCount(name)

- Returns the number of chapters in a Bible book.

#### Parameters
- name (string): The book name or alias.

#### Returns
- number|null: The number of chapters in the book, or null if the book is not found.

#### Examples
```js
getChapterCount('Genesis');
// => 50

getChapterCount('gen');
// => 50

getChapterCount('Judas');
// => null
```

### getVerseCount(name, chapter)
- Returns the number of verses in a specific chapter of a Bible book.

#### Parameters
- name (string): The book name or alias.
- chapter (number): The chapter number (1-based index).

#### Returns
- number|null: Number of verses in the chapter, or null if the book or chapter is invalid.

#### Examples

```js
getVerseCount('Genesis', 2);
// => 25

getVerseCount('Genesis', 999);
// => null

getVerseCount('Genesis', 0);
// => null

getVerseCount('Judas', 1);
// => null
```

### `normalizeBookName(name)`

- Normalizes a Bible book name by:
  - Converting common ordinal prefixes to digits
  - Removing prefixes like `"The Epistle to the"`, `"Book of"`, `"Gospel according to"`, `"Letter to"`
  - Lowercasing and removing non-alphanumeric characters

#### Parameters

- `name` (`string|null|undefined`): Book name or alias to normalize.

#### Returns

- `string|null`: Normalized book name (e.g. `"1john"`, `"genesis"`) or `null` if input is null/undefined.

#### Examples

```js
normalizeBookName('1st John');   // => '1john'
normalizeBookName('second Kings'); // => '2kings'
normalizeBookName('Iii John');   // => '3john'
normalizeBookName('The Epistle to the Romans'); // => 'romans'
normalizeBookName('Book of Psalms');      // => 'psalms'
normalizeBookName('Gospel according to John'); // => 'john'
normalizeBookName('The Song of Solomon'); // => 'songofsolomon'
normalizeBookName('1st! Samuel?');        // => '1samuel'
normalizeBookName('   ');                  // => ''
normalizeBookName(null);                   // => null
```

### parseChapterVerse(str)
- Parses the chapter and verse portion of a reference string into numeric components.

#### Parameters
- str (string|null|undefined): Chapter and verse string to parse.

#### Returns
- object|null: An object with:

```js
{
  chapter: number,       // chapter number
  verseStart: number|null, // starting verse or null
  verseEnd: number|null    // ending verse or null
}
```
or `null` if parsing fails.

#### Examples
```js
parseChapterVerse('12');          // => { chapter: 12, verseStart: null, verseEnd: null }
parseChapterVerse('5:3');         // => { chapter: 5, verseStart: 3, verseEnd: null }
parseChapterVerse('Chapter 13 Verses 4–7'); // => { chapter: 13, verseStart: 4, verseEnd: 7 }
parseChapterVerse('chap. 13, v3 to 8');     // => { chapter: 13, verseStart: 3, verseEnd: 8 }
parseChapterVerse('nonsense');    // => null
```

### `extractBookAndRange(ref)`
- Extracts the book name and chapter/verse range string from a full Bible reference.

#### Parameters
- ref (string|null|undefined): Full Bible reference string.

#### Returns
- [string|null, string|null]: Tuple with
  - Book name (string) or `null`
  - Chapter/verse range substring or `null`

#### Examples
```js
extractBookAndRange('1st John 3:16');            // => ['1st John', '3:16']
extractBookAndRange("John's Revelation 4:5");    // => ["John's Revelation", '4:5']
extractBookAndRange('Genesis');                   // => ['Genesis', '']
extractBookAndRange('');                          // => [null, null]
```

### parseBibleReference(ref)
- Parses a full Bible reference string into normalized book and chapter/verse components.

#### Parameters
- `ref` (`string|null|undefined`): Reference string to parse.

#### Returns
- `object|null`: Parsed reference object with keys:
```js
{
  book: string|null,        // normalized book name or null
  chapter: number|null,     // chapter number or null
  verseStart: number|null,  // starting verse or null
  verseEnd: number|null     // ending verse or null
}
```

or `null` if input invalid.

#### Examples
```js
parseBibleReference('2nd Kings 4:2');
// => { book: '2kings', chapter: 4, verseStart: 2, verseEnd: null }

parseBibleReference('Iii JohN  Chap. 1 verses 9 to 11');
// => { book: '3john', chapter: 1, verseStart: 9, verseEnd: 11 }

parseBibleReference('Genesis');
// => { book: 'genesis', chapter: null, verseStart: null, verseEnd: null }

parseBibleReference('!!!');
// => { book: null, chapter: null, verseStart: null, verseEnd: null }

parseBibleReference(null);
// => null
```

### `isValidBook(book)`

- Checks if the given book name or alias corresponds to a valid Bible book.

#### Parameters
- `book` (`string|null|undefined`): Book name or alias to validate.

#### Returns
- `boolean`: `true` if the book is valid, `false` otherwise.

#### Examples
```js
isValidBook('Genesis');  // true
isValidBook('gEn');      // true (alias, case-insensitive)
isValidBook('Judas');    // false (not a valid book)
isValidBook('');         // false
isValidBook(null);       // false
```

### `isValidChapter(book, chapter)`
- Checks if the given chapter number is valid for the specified book.

#### Parameters
- `book` (`string|null|undefined`): Book name or alias.
- `chapter` (`number|null|undefined`): Chapter number to validate.

#### Returns
`boolean`: `true` if the chapter is valid for the book, `false` otherwise.

#### Examples
```js
isValidChapter('Genesis', 1);   // true
isValidChapter('Genesis', 50);  // true (Genesis has 50 chapters)
isValidChapter('Genesis', 51);  // false (chapter out of range)
isValidChapter('Judas', 1);     // false (invalid book)
isValidChapter(null, 1);        // false
isValidChapter('Genesis', null); // false
```

### `isValidReference(book, chapter, verseStart, verseEnd = null)`
- Checks if the full reference (book, chapter, verse/range) is valid.

#### Parameters
- book (string|null|undefined): Book name or alias.
- chapter (number|null|undefined): Chapter number.
- verseStart (number|null|undefined): Starting verse number.
- verseEnd (number|null|undefined, optional): Ending verse number. Defaults to null.

#### Returns
- boolean: true if the complete reference is valid, false otherwise.

#### Examples
```js
isValidReference('Genesis', 1, 1);         // true
isValidReference('Genesis', 1, 31);        // true (last verse)
isValidReference('Genesis', 1, 32);        // false (verse too high)
isValidReference('Genesis', 0, 1);         // false (invalid chapter)
isValidReference('Genesis', 1, 0);         // false (invalid verse)
isValidReference('Blah', 1, 1);            // false (unknown book)
isValidReference(null, 1, 1);               // false
isValidReference('Genesis', 'one', 'one'); // false
isValidReference('gEnEsIs', 1, 1);         // true (case-insensitive book)
```

### `listBibleBooks()`
- Returns a list of all canonical Bible book names in proper display format.

#### Returns
- `string[]`: An array of book names indexed to canon order.

#### Examples
```js
listBibleBooks();
// => ["Genesis", "Exodus", ..., "Revelation"]
```

### `listAliases(bookName, options)`
- Returns an array of all known aliases for a given book, including its canonical name.

#### Parameters
- `bookName` (`string)`: A Bible book name or known alias.
- `options` (`object`, optional):
  - `normalized` (`boolean`, default `false`):
    - If `true`, returns all aliases in normalized form (lowercase, no spaces or punctuation).
    - If `false` or not set, returns display-friendly aliases (title-cased with spacing preserved).

#### Returns
- `string[]|null`: An array of aliases, or `null` if the book was not found.

#### Examples
```js
listAliases('1 Corinthians');
// => ["1 Corinthians", "1 Cor", "1 Co"]

listAliases('1co', { normalized: true });
// => ["1corinthians", "1cor", "1co"]

listAliases('UnknownBook');
// => null
```
### `listChapters(bookName)`
- Returns the list of chapter numbers in a given book.

#### Parameters
- `bookName` (`string`): The book name or alias.

#### Returns
`number[]|null`: An array of chapter numbers (`[1, 2, ..., N]`), or `null` if the book is not found.

#### Examples
```js
listChapters('Genesis');
// => [1, 2, 3, ..., 50]

listChapters('gen');
// => [1, 2, ..., 50]

listChapters('UnknownBook');
// => null
```

### `listVerses(bookName, chapter)`
- Returns the list of verse numbers in a given chapter of a book.

#### Parameters
- `bookName` (`string`): The book name or alias.
- `chapter` (`number`): The chapter number.

#### Returns
`number[]|null`: An array of verse numbers (`[1, 2, ..., M]`), or `null` if the book and chapter are invalid.

```js
listVerses('Genesis', 1);
// => [1, 2, ..., 31]

listVerses('gen', 2);
// => [1, 2, ..., 25]

listVerses('gen', 100);
// => null

listVerses('UnknownBook', 1);
// => null
```

Examples
## 🧪 Tests
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