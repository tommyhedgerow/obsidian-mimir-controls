'use strict'
/*
 * The words this plugin says, in the two languages it says them in.
 *
 * WHY BOTH TABLES ARE IN ONE FILE. The rules the community directory lints with know a
 * locale file by its name — `en.js`, `en.json`, `en/**` — and expect one file per
 * language. That layout is for a plugin with a book of strings, where loading the wrong
 * two is waste. This plugin has nine, and the thing that keeps two languages in step is
 * reading them side by side on one screen; two files drift apart, and a drifted
 * translation is worse than none. The eslint config points the rule that checks English
 * locale modules — `obsidianmd/ui/sentence-case-locale-module` — at this file by name,
 * because otherwise the English half would be the one piece of user-facing text in the
 * repository that nothing checks.
 *
 * WHY PLACEHOLDERS AND NOT FUNCTIONS. Every word a user reads should be a string in one
 * of the two lists below, so that the two can be read against each other and a missing
 * key is visible. A sentence assembled from `+` pieces inside a function is a sentence no
 * reviewer and no rule ever sees whole.
 *
 * WHICH LANGUAGE, AND WHICH CHINESE. The tag comes from Obsidian's own `getLanguage()` —
 * the interface language chosen in the app — and from nowhere else. Not
 * `navigator.language`, which follows the machine rather than the app, and not a setting
 * of this plugin's: the interface language is Obsidian's decision, and a second place to
 * set it is a second place to be wrong. A Chinese tag selects the table below only when
 * it is not Traditional: Obsidian treats Traditional as a language in its own right, and
 * a reader who chose it is better served by English than by a script they did not ask
 * for.
 */

/**
 * English, and the table that every tag but Simplified Chinese falls back to.
 */
const EN = {
  // The three commands: the keyboard route to the same two moves.
  commandToggleFrame: 'Toggle light and dark',
  commandSizeNext: 'Reading size: next step',
  commandSizePrevious: 'Reading size: previous step',

  // The size button. The numbers are the app's own and are the same in both languages.
  sizeLabel: 'Reading size {px} px ({step} of {total}) — press for the next, right-click for the previous',
  sizeTooltip: 'Reading size: {px}px — {step} of {total}. Everything read moves together. Right-click steps back.',

  // The frame button. The tooltip names the MOVE and not the state — 'Light' is what the
  // press gives you while the pane is dark — which is the rule its own comment records.
  frameLabelDark: 'Reading in the dark — press for the light',
  frameLabelLight: 'Reading in the light — press for the dark',
  frameTitleDark: 'Light',
  frameTitleLight: 'Dark',
}

/**
 * Simplified Chinese.
 *
 * 浅色 and 深色 are Obsidian's own words for the two frames, and 字号 is what it calls a
 * font size; 档 counts the three steps the size mark holds, which is shorter than 第 n 个
 * 尺寸 and is what a Chinese reader would say about a three-position control.
 */
const ZH = {
  commandToggleFrame: '切换浅色与深色',
  commandSizeNext: '阅读字号：下一档',
  commandSizePrevious: '阅读字号：上一档',
  sizeLabel: '阅读字号 {px} px（第 {step}/{total} 档）——点击下一档，右键上一档',
  sizeTooltip: '阅读字号：{px}px——第 {step}/{total} 档。所有阅读内容一起变化。右键退回上一档。',
  frameLabelDark: '正在深色下阅读——点击切换到浅色',
  frameLabelLight: '正在浅色下阅读——点击切换到深色',
  frameTitleDark: '浅色',
  frameTitleLight: '深色',
}

/**
 * The subtags that mean Traditional Chinese: the script where it is written, and the
 * regions that write it.
 */
const TRADITIONAL = ['hant', 'tw', 'hk', 'mo']

/**
 * The table for one interface-language tag, English for anything unmatched.
 *
 * The match is on the PRIMARY subtag, so `zh`, `zh-CN`, `zh-Hans` and `zh-SG` all land on
 * the same table; the rest of the tag is read only to keep Traditional out of it. Case is
 * not trusted and the separator is not assumed — Obsidian hands back tags like `zh-CN`,
 * but `ZH_cn` means the same thing and should not fall to English over a spelling.
 *
 * @param tag - a BCP 47 tag, or nothing at all on an app older than `getLanguage()`.
 */
function tableFor (tag) {
  const parts = String(tag == null ? '' : tag).toLowerCase().split(/[-_]/)
  if (parts[0] !== 'zh') return EN
  if (parts.some((part) => TRADITIONAL.includes(part))) return EN
  return ZH
}

/**
 * One string with its `{placeholders}` filled in.
 *
 * A placeholder with nothing to fill it is left standing rather than written as
 * `undefined`, so a caller that forgets one shows the hole instead of hiding it.
 */
function fill (template, values) {
  return String(template).replace(/\{(\w+)\}/g, (whole, key) => (
    Object.prototype.hasOwnProperty.call(values, key) ? String(values[key]) : whole
  ))
}

/* `TABLES` is here for the test harness, which holds the two side by side and fails if
 * one has a key the other has not: a string only one language carries prints `undefined`
 * at the user, and nothing else in the build would notice. */
module.exports = { TABLES: { en: EN, zh: ZH }, fill, tableFor }
