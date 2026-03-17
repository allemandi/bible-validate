const { isValidBook } = require('../dist/index.cjs');

if (isValidBook('Genesis') !== true) {
    console.error('CJS smoke test failed: isValidBook("Genesis") should be true');
    process.exit(1);
}

if (isValidBook('InvalidBook') !== false) {
    console.error('CJS smoke test failed: isValidBook("InvalidBook") should be false');
    process.exit(1);
}

console.log('CJS smoke test passed');
