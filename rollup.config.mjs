import { createRequire } from 'node:module';

import json from '@rollup/plugin-json';
import dts from 'rollup-plugin-dts';

const require = createRequire(import.meta.url);
/** @type {import('./package.json')} */
const pkg = require('./package.json');

const deps = Object.keys(pkg.dependencies ?? {});
const peerDeps = Object.keys(pkg.peerDependencies ?? {});

/** @param {string[]} names */
function makeExternal(names) {
    const set = new Set(names);
    return (id) => {
        for (const name of set) {
            if (id === name || id.startsWith(`${name}/`)) return true;
        }
        return false;
    };
}

const plugins = [json()];

export default [
    // ESM + CJS
    {
        input: 'src/index.js',
        external: makeExternal([...deps, ...peerDeps]),
        plugins,
        output: [
            {
                file: pkg.module,
                format: 'es',
                compact: true,
                sourcemap: true,
            },
            {
                file: pkg.main,
                format: 'cjs',
                exports: 'named',
                compact: true,
                sourcemap: true,
            },
        ],
    },

    // UMD
    {
        input: 'src/index.js',
        external: makeExternal(peerDeps),
        plugins,
        output: {
            file: pkg.unpkg,
            format: 'umd',
            name: 'bibleValidate',
            exports: 'named',
            compact: true,
            sourcemap: true,
            globals: Object.fromEntries(peerDeps.map((d) => [d, d])),
        },
    },

    // Types bundling
    {
        input: 'dist/index.d.ts',
        output: [{ file: pkg.types, format: 'es' }],
        plugins: [dts()],
    },
];
