import { createRequire } from 'node:module';

import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';

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

const plugins = [
  resolve({ extensions: ['.mjs', '.js', '.json'], browser: true }),
  commonjs(),
  json(),
];

export default [
  // ESM + CJS (like microbundle's module/main)
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

  // UMD (like microbundle's --name + unpkg)
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
];

