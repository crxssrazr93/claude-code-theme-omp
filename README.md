# claude-code-theme-omp

Claude Code visual identity for [omp](https://omp.sh): six CC palette themes plus a small
chrome extension for the CC turn footer.

Themes are ported from Claude Code's own theme tokens (`claude`, `claudeShimmer`, `inactive`,
`subtle`, `promptBorder`, `planMode`, `autoAccept`, `bashBorder`, `permission`,
`userMessageBackground`, `bashMessageBackgroundColor`, `selectionBg`, diff colors), remapped
onto omp's token vocabulary, with the CC spinner frame set (`· ✢ ✳ ✶ ✻ ✽`) and the CC
past-tense turn footer (`✻ Worked for 12s`).

## Install

```sh
mkdir -p ~/.omp/agent/themes
cp themes/claude-code-*.json ~/.omp/agent/themes/
omp config set theme.dark claude-code-dark     # or any of the six
omp config set theme.light claude-code-light
omp plugin link "$PWD/extension"               # CC turn footer
```

Restart omp (or start a new session) so the extension module loads and transcripts repaint.

## Themes

| file | palette |
|---|---|
| `claude-code-dark.json` | CC dark, truecolor |
| `claude-code-light.json` | CC light, truecolor |
| `claude-code-dark-ansi.json` | CC dark, terminal 16-color |
| `claude-code-light-ansi.json` | CC light, terminal 16-color |
| `claude-code-dark-daltonized.json` | CC dark, colorblind-friendly |
| `claude-code-light-daltonized.json` | CC light, colorblind-friendly |

Mapping notes:

- `accent` → CC `claude` (`#D77757`): logo, cursor, selected items, tool titles (omp has no
  assistant bullet token, so the brand orange lands there).
- `borderMuted` → CC `promptBorder` (`#888888`): composer rules and tool outlines.
- `userMessageBg` → CC `userMessageBackground` (`#373737` / `#F0F0F0`): the only user-side
  marker omp exposes; CC's `>` prompt glyph has no omp equivalent.
- `toolPendingBg`/`toolSuccessBg`/`toolErrorBg` → `""`: CC's flat tool rows; omp's cards draw
  their own outlines, and filling them would produce slabs heavier than CC's one-line bands.
- `statusLine*` → `inactive`/`subtle`, `statusLineBg` → `""`: CC's single dim status line.
- Spinner frames in `symbols.spinnerFrames`.

## Extension

`extension/` registers one `agent_start`/`agent_end` pair and emits a custom message rendered
dim: ` ✻ <Verb> for <duration>` using CC's completion verbs. No runtime imports.

## Known gaps (omp API limits, not palette)

- No transcript markers: CC's `>` (user) and `●` (assistant) cannot be rendered by a theme or
  extension; omp has no message-marker hook.
- Diff line backgrounds (`#022800` / `#3D0100` in CC) — omp diff tokens are foreground-only.
- `claude → claudeShimmer` animated gradient; mode borders (`planMode`, `autoAccept`,
  `permission`); eight `*_FOR_SUBAGENTS_ONLY` colors.
