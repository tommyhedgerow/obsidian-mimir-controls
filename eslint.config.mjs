/*
 * The same checks the community directory runs, from the same package:
 * `eslint-plugin-obsidianmd` is the official plugin, and its `recommended`
 * config is the set the directory's automated review is built from.
 *
 *   npm run lint
 *   npm run lint -- --fix
 *
 * Four departures from the stock config, all explained where they are set:
 * the plugin is authored as CommonJS on purpose, `build.mjs` is a build script
 * rather than code that ships to a vault, sentence case has to be told which
 * words are proper nouns, and the two languages live in one module rather than
 * in the `en`/`zh` pair the locale conventions describe.
 */

import { defineConfig } from 'eslint/config'
import globals from 'globals'
import obsidianmd from 'eslint-plugin-obsidianmd'

export default defineConfig([
  ...obsidianmd.configs.recommended,

  {
    languageOptions: {
      sourceType: 'commonjs',
      globals: { ...globals.node, ...globals.browser },
      parserOptions: {
        // There is no tsconfig here — the plugin is plain JavaScript — so every
        // file falls to the default project. Without this the type-aware parser
        // refuses to parse `src/main.js` at all, and the whole point of running
        // the linter is to check that file.
        projectService: { allowDefaultProject: ['eslint.config.*', 'build.mjs', 'src/main.js', 'src/strings.js'] },
        // CommonJS wraps a module's top-level code in a function, and the
        // TypeScript parser does not infer that from `sourceType` on its own.
        // Without it `no-implicit-globals` reads every top-level helper in
        // `src/main.js` as a global leaked onto `window`, which none of them is.
        ecmaFeatures: { globalReturn: true },
      },
    },
    rules: {
      // Obsidian loads `main.js` as a CommonJS module and `require('obsidian')`
      // is the documented way to reach the API without a bundler. The rule
      // assumes an ESM or TypeScript source tree, which this is not.
      '@typescript-eslint/no-require-imports': 'off',
    },
  },

  {
    files: ['src/**/*.js'],
    rules: {
      'obsidianmd/ui/sentence-case': ['warn', {
        enforceCamelCaseLower: true,
        // Sentence case would rewrite the plugin's own name to "Mimir
        // Controls"
        // in the one string that says it out loud. Note that passing
        // `brands` REPLACES the rule's default list, so the platform names this
        // plugin's settings could plausibly use are repeated here rather than
        // left to be lowercased by `--fix`.
        brands: ['Mimir Controls', 'Obsidian', 'Markdown'],
      }],
    },
  },

  {
    // The locale convention the plugin's own rules describe is one file per
    // language, named `en.js`, `en.json`, `en/**`. This plugin keeps both
    // languages in one module instead — see the header of `src/strings.js` for
    // why — so the rule that checks an English locale module is pointed at that
    // file by name. Without it the English strings would be the one piece of
    // user-facing text here that nothing reads.
    files: ['src/strings.js'],
    rules: {
      'obsidianmd/ui/sentence-case-locale-module': ['warn', {
        enforceCamelCaseLower: true,
        // Passing `brands` REPLACES the rule's default list, so the names a
        // string here could plausibly contain are repeated rather than left to
        // be lowercased by `--fix`.
        brands: ['Mimir Controls', 'Obsidian', 'Markdown'],
      }],
    },
  },

  {
    // `build.mjs` and the test harness run on a contributor's machine and are
    // never shipped into a vault. The console guideline exists so a plugin does
    // not chatter into the user's developer console, and the Node rule guards
    // code that would crash on mobile — neither has anything to protect in a file
    // that only ever runs under Node at a terminal. A build script that cannot
    // print its progress, or a test that cannot report a failure, is worse than
    // one that can.
    files: ['build.mjs', 'test/**/*.mjs'],
    rules: {
      'obsidianmd/rule-custom-message': 'off',
      'obsidianmd/no-nodejs-modules': 'off',
      // The harness builds a throwaway fixture vault in a temp directory, so
      // `.obsidian` there is a path it is writing, not an assumption about the
      // user's configuration folder. The rule is about reading the real one.
      'obsidianmd/hardcoded-config-path': 'off',
    },
  },

  {
    // The release artifact and the build output are not sources.
    ignores: ['main.js', 'node_modules/'],
  },
])
