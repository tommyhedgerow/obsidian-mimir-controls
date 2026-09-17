/*
 * Produce the release artifact, `main.js`, from `src/main.js`.
 *
 * This is a copy, and that is the honest description of it: the plugin is
 * hand-written CommonJS with no bundler, no transpiler and no dependencies
 * beyond the `obsidian` module Obsidian itself provides. There is nothing to
 * compile.
 *
 * It exists as a build step anyway because `main.js` must not be committed —
 * the community directory rebuilds it from source and checks that the two
 * match, so that a reviewer can read the code that actually runs. A copy makes
 * that check exact rather than approximate. The banner below is the only
 * difference between the two files — with one exception, explained at
 * `inlineLocale`: the locale module is spliced in, because what ships has to be
 * one file.
 *
 * Usage:
 *   node build.mjs            write main.js
 *   node build.mjs --check    fail if main.js is missing or stale
 */

import { readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const SOURCE = join(HERE, 'src', 'main.js')
const STRINGS = join(HERE, 'src', 'strings.js')
const TARGET = join(HERE, 'main.js')

const BANNER = `/* Generated from src/main.js — edit the source, not this file. */

`

/* The line in `src/main.js` that pulls the locale module in. Spelled out, and checked
 * for below: if the source ever stops requiring the module in this exact shape, the
 * artifact would otherwise be built around a `require` of a file nobody ships, and the
 * failure would land in a user's vault rather than here. */
const INLINE_AT = "const { fill, tableFor } = require('./strings')"

/**
 * `src/strings.js` written out as a local binding instead of a `require`.
 *
 * The module is ordinary CommonJS and `src/main.js` requires it, which is what the test
 * harness loads. What ships cannot be two files: Obsidian downloads `main.js`,
 * `manifest.json` and `styles.css` from a release and nothing else, so a `main.js` that
 * required a sibling `strings.js` would fail to load in every vault it was installed
 * into, in both languages. The module's body is therefore placed here, wrapped so that
 * the `module.exports` it writes is the wrapper's own object rather than the plugin's.
 */
function inlineLocale (source) {
  return [
    'const { fill, tableFor } = (function () {',
    '  const module = { exports: {} }',
    source.trimEnd(),
    '  return module.exports',
    '})()',
  ].join('\n')
}

const source = await readFile(SOURCE, 'utf8')
if (!source.includes(INLINE_AT)) {
  console.log('build: src/main.js no longer requires ./strings in the shape this build inlines')
  process.exit(1)
}
const locale = await readFile(STRINGS, 'utf8')
const next = BANNER + source.replace(INLINE_AT, () => inlineLocale(locale))

if (process.argv.includes('--check')) {
  if (!existsSync(TARGET)) {
    console.log('build: main.js is missing — run `npm run build`')
    process.exit(1)
  }
  const current = await readFile(TARGET, 'utf8')
  if (current !== next) {
    console.log('build: main.js is stale — run `npm run build`')
    process.exit(1)
  }
  console.log('build: main.js is current')
  process.exit(0)
}

await writeFile(TARGET, next, 'utf8')
console.log(`build: wrote main.js (${next.length} bytes) from src/main.js`)
