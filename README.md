# Mimir Controls

Two controls in the header of an Obsidian pane: step the reading size, and switch between light and dark. Both show their current state on the button itself, so nothing has to be opened to see what is set. There is no panel and no settings tab.

## What it does

Mimir Controls adds a small group of two buttons to the header of a pane, after the note's own actions.

- **Reading size.** A type mark with three pips beside it, one of them filled. Left-click steps forward through 15 px, 16.5 px and 18.5 px; right-click steps back. The cycle wraps at both ends.
- **Frame.** A sun or a moon, showing the frame you are reading in. Press to swap between light and dark.

Both buttons write Obsidian's own settings rather than keeping a copy of their own:

- the reading size is Obsidian's **base font size**, so it applies to the whole app and not to one note;
- the frame is Obsidian's **theme**, `moonstone` or `obsidian`.

The buttons read the live settings before every paint, so a change made in Settings → Appearance shows on them at once, and a base font size set anywhere else snaps to the nearest of the three steps.

While it is loaded, the plugin also puts `theme-dark` or `theme-light` on the document element. Obsidian itself styles `body.theme-dark`, so the class is there for drawings and snippets that should follow the frame rather than the operating system.

Three commands do the same work from the keyboard, and they work whether or not a note is open:

- `Toggle light and dark`
- `Reading size: next step`
- `Reading size: previous step`

Nothing is moved or hidden. Obsidian's ribbon, and every button already in the header, stay where the app put them. Disable the plugin and the header is exactly as it was.

Mimir Controls is built for the Mimir learning vault; the project is at https://github.com/tommyhedgerow/Mimir.

## Install

Mimir Controls is not in the community directory yet. Submission is pending, so the manual path is the one that works today.

Manual install:

1. Download `main.js`, `manifest.json` and `styles.css` from the latest release at https://github.com/tommyhedgerow/obsidian-mimir-controls/releases.
2. Put the three files in `<Vault>/.obsidian/plugins/mimir-controls/`.

```text
<Vault>/.obsidian/plugins/mimir-controls/
  main.js
  manifest.json
  styles.css
```

3. Reload Obsidian, then enable **Mimir Controls** in Settings → Community plugins.

Once the listing is live, the same plugin can be installed from Settings → Community plugins → Browse, by searching for "Mimir Controls".

## Usage

Press the pips to move the reading size up, and right-click them to move it down. Press the sun or the moon to change the frame. A group is added to each pane header as panes are created, so a new tab gets the buttons too.

## Settings

The plugin has no settings tab and writes no file of its own. The two values it changes live in Obsidian: `baseFontSize` and `theme`, both of which can also be set by hand in Settings → Appearance.

## Disclosures

- **Network use:** none. The plugin makes no requests.
- **Files outside the vault:** none. It reads and writes no files.
- **Obsidian settings:** it writes two of Obsidian's own settings, `theme` and `baseFontSize`, and nothing else. Both are reversible by hand in Settings → Appearance.
- **Data stored:** none. The plugin keeps no state of its own and creates no `data.json`. The only other thing it touches is a class on the document element, which is not stored anywhere.
- **Accounts and payments:** none.
- **Ads:** none.
- **Telemetry:** none. Nothing is collected or sent anywhere.

## Licence

MIT. See [LICENSE](LICENSE).
