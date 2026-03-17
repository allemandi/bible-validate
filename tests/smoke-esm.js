import { isValidBook } from '../dist/index.module.js';

if (isValidBook('Genesis') !== true) {
    console.error('ESM smoke test failed: isValidBook("Genesis") should be true');
    process.exit(1);
}

if (isValidBook('InvalidBook') !== false) {
    console.error('ESM smoke test failed: isValidBook("InvalidBook") should be false');
    process.exit(1);
}

console.log('ESM smoke test passed');
