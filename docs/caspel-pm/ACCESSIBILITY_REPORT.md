# Accessibility report

Status: contrast **statically verified**; light and dark screenshots **reviewed at runtime** (RUNTIME_QA_REPORT.md). No axe-core, screen reader, zoom or keyboard-only testing yet.

## Verified by calculation or code inspection

| Check | Result |
| --- | --- |
| White text on primary button `#236B8E` / hover `#2B7AA0` / pressed `#1D5D7C` | 5.89 / 4.78 / 7.22 : 1 (AA normal text ≥ 4.5) |
| Primary button vs dark background `#161719` | 3.05 : 1 (≥ 3:1 non-text; upstream was 2.91) |
| Primary button vs light background `#F1F1F4` | 5.23 : 1 |
| Secondary button text `rgba(0,0,0,.8)` on `#D3E4EC` / `#BFD7E3` / `#A9C9D8` | ≈ 9.7 / 8.5 / 7.2 : 1 (approximated with `#333`) |
| Email header/button white on `#0A2A3D` | 14.88 : 1 |
| Login panel text (white) on navy gradient `#15506A`–`#0A2A3D` | 8.80 – 14.88 : 1 (was on `#313D9A`–`#202669`) |
| Official green `#4CAF50` not used behind white text | Confirmed |
| Focus outline tokens | Unchanged from upstream (`#5190EC`), drawn outside the control (`0 0 0 2px`): 3.21:1 on light, 5.60:1 on dark background |
| Placeholder SVG favicon | `role="img"` + `aria-label="Caspel PM"`; login mark `aria-hidden` (adjacent visible title text) |
| Login backdrop | Decorative `div` with `aria-hidden="true"`, replacing an `<img alt="">`. Same semantics |
| Hidden support links | Removed from DOM via `{#if}`, so no focusable empty links remain |
| Azerbaijani/Russian glyphs in bundled IBM Plex Sans | All required code points present in all 4 weights (cmap parse) |
| `<html lang>` | `dev/prod/src/index.ejs` has no `lang` attribute (upstream). Not changed; recommend setting it from the active language at runtime |

## Not yet verified (required before production)

Keyboard-only navigation of changed surfaces (help popup with 0–3 footer links, sidebar without Contact us), focus order, visible focus on the new primary colour, 200% zoom, reflow at 320 px, reduced motion, screen-reader labels, dark-theme checked selectors (`--selector-active-BackgroundColor`), long ru/de/tr strings where "Caspel PM" is longer than "Huly" (e.g. "Caspel-PM-Postfach verbinden", "Rozpocznij korzystanie z Caspel PM"). Add axe-core runs on the six prototype surfaces (VISUAL_QA_MATRIX.md).
