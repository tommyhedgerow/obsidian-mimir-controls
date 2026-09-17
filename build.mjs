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
 * difference between the two files.
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
const TARGET = join(HERE, 'main.js')

const BANNER = `/* Generated from src/main.js — edit the source, not this file. */

`

const source = await readFile(SOURCE, 'utf8')
const next = BANNER + source

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
