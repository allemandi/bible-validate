# 📖 @allemandi/bible-validate

[![NPM Version](https://img.shields.io/npm/v/@allemandi/bible-validate)](https://www.npmjs.com/package/@allemandi/bible-validate)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/allemandi/bible-validate/blob/main/LICENSE)

> **Utilities for validating and parsing Bible references**
> 
> Supports ESM, CommonJS, UMD, and TypeScript – works in modern builds, Node.js, and browsers.

<!-- omit from toc -->
## 🔖 Table of Contents
- [✨ Features](#-features)
- [🛠️ Installation](#️-installation)
- [🚀 Quick Usage Examples](#-quick-usage-examples)
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

> 📘 For a complete list of methods and options, see [the API docs](https://github.com/allemandi/bible-validate/blob/main/docs/API.md).


**ESM**
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

**CommonJS**
```js
const { parseAndValidateReference } = require('@allemandi/bible-validate');
```

**UMD (Browser)**
```bash
<script src="https://unpkg.com/@allemandi/bible-validate"></script>
<script>
  const result = window.bibleValidate.parseAndValidateReference('John 3:16');
  console.log(result);
</script>
```

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