import js from '@eslint/js';
import globals from 'globals';
import { defineConfig, globalIgnores } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier';

export default defineConfig([
    globalIgnores(['dist/', 'coverage/', 'node_modules/']),
    js.configs.recommended,
    { files: ['**/*.js'], languageOptions: { sourceType: 'module' } },
    {
        files: ['**/*.{js,mjs,cjs}'],
        languageOptions: {
            globals: { ...globals.browser, ...globals.jest, ...globals.node },
        },
    },
    eslintConfigPrettier,
]);
