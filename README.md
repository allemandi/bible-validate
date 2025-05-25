# 📖 @allemandi/bible-validate

[![NPM Version](https://img.shields.io/npm/v/@allemandi/bible-validate)](https://www.npmjs.com/package/@allemandi/bible-validate)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/allemandi/bible-validate/blob/main/LICENSE)

> Utilities for Bible passage validation

## ✨ Features

- Validate if a book name or alias exists
- Retrieve the number of chapters in a given book
- Retrieve the number of verses in a given chapter of a book
- Normalize book names for case-insensitive comparisons
- Validate if a given book-chapter-verse reference is valid

## 🛠️ Installation
```bash
# Install using Yarn
yarn add @allemandi/bible-validate

# or using NPM
npm install @allemandi/bible-validate
```

## Tests
```bash
# Run the test suite with Jest
yarn test
```
## API
`getBook(bookName: string): BookObject | null`
- Returns the full book object (including aliases and chapter data) if valid, otherwise null.

`getChapterCount(bookName: string): number | null`
- Returns the number of chapters in the specified book, or null if invalid.

`getVerseCount(bookName: string, chapter: number): number | null`
- Returns the number of verses in the specified chapter of the book, or null if invalid.

`normalizeBook(bookName: string | null): string | null`
- Normalizes a book name string by trimming and converting to lowercase for consistent comparisons.

`isValidBook(bookName: string): boolean`
- Returns true if the given book name or alias is valid.

`isValidReference(bookName: string, chapter: number, verse: number): boolean`
- Returns true if the full reference (book, chapter, and verse) is valid.


## 🤝 Contributing
If you have ideas, improvements, or new features:

1. Fork the project
2. Create your feature branch (git checkout -b feature/amazing-feature)
3. Commit your changes (git commit -m 'Add some amazing feature')
4. Push to the branch (git push origin feature/amazing-feature)
5. Open a Pull Request