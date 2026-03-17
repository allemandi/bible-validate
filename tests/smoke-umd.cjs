// UMD in Node environment often acts like CJS if exported correctly.
// Rollup UMD bundle with `exports: 'named'` and `name: 'bibleValidate'`

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const code = fs.readFileSync(path.join(__dirname, '../dist/index.umd.js'), 'utf8');
const script = new vm.Script(code);
// For UMD to work in this simulated browser environment:
const context = { bibleValidate: {} };
context.self = context;
script.runInNewContext(context);
const lib = context.bibleValidate;

if (lib.isValidBook('Genesis') !== true) {
    console.error('UMD smoke test failed: isValidBook("Genesis") should be true');
    process.exit(1);
}

if (lib.isValidBook('InvalidBook') !== false) {
    console.error('UMD smoke test failed: isValidBook("InvalidBook") should be false');
    process.exit(1);
}

console.log('UMD smoke test passed');
