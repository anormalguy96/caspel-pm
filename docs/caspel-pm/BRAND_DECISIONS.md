# Brand decisions

Labels: **[OFFICIAL]** = published Caspel logo rule; **[OBSERVED]** = seen on caspel.com, not a rule; **[PROPOSED]** = this fork's decision, pending brand-owner approval.

## Naming

| Decision | Value | Basis |
| --- | --- | --- |
| Display name | `Caspel PM` (never "Caspel PMS"; PMS is Caspel's Procurement Management System) | Master prompt §4 |
| Technical slug for new files/dirs | `caspel-pm` (e.g. `dev/prod/public/caspel-pm/`, `scripts/caspel-pm/`) | Master prompt §4 |
| CSS token prefix | `--cpm-*` | [PROPOSED] |
| Descriptor (manifest) | "Projects, tasks, documents, and team collaboration." | Master prompt §4 |
| Relationship to Caspel TMS | Not stated anywhere in the product | Open, B-003 |
| Brand name in translations | Untranslated `Caspel PM`; grammar adjusted per language (see LOCALIZATION_GLOSSARY.md) | Master prompt §37 |

## Colour

| Token | Value | Label | Use |
| --- | --- | --- | --- |
| `--cpm-brand-navy` | `#0A2A3D` | [OFFICIAL] | Identity: placeholder mark, email header, login backdrop, manifest `theme_color` |
| `--cpm-brand-green` | `#4CAF50` | [OFFICIAL] | Identity accent only. **Never** a filled action with white text (2.78:1) |
| `--cpm-ui-accent` | `#236B8E` | [PROPOSED] | Platform UI accent: primary buttons, checked checkbox/radio/toggle, focused input borders, selected calendar days, presence outlines (every upstream `--primary-button-default` use) |
| `--cpm-ui-accent-hover` | `#2B7AA0` | [PROPOSED] | Primary hover |
| `--cpm-ui-accent-pressed` | `#1D5D7C` | [PROPOSED] | Primary pressed |
| `--cpm-ui-accent-subtle` / `-hover` / `-pressed` | `#D3E4EC` / `#BFD7E3` / `#A9C9D8` | [PROPOSED] | Secondary buttons |
| Website `--caspel-primary #00001E`, `--caspel-secondary #20C940` | — | [OBSERVED] | Not used |

### Why a navy-teal action colour instead of green

- White on `#4CAF50` is 2.78:1, below WCAG AA for text.
- `#2E7D32` (the prompt's proposed action green) passes (5.13:1) but is nearly the same as upstream's `--positive-button-*` green `#05A05C`. Primary and "positive/success" buttons would then look identical, which breaks the rule that state must not depend on brand green.
- Primary button tokens in upstream `_colors.scss` are on `*`, so they're shared by light and dark themes. The value has to work on both.
  - Pure navy `#0A2A3D` gives 14.9:1 with white text, but only 1.21:1 against the dark theme background `#161719`, so the button disappears.
  - `#236B8E` sits in the navy family and gives white text 5.89:1. It is 3.05:1 against the dark background (≥3:1 non-text contrast; upstream's blue was 2.91:1) and 5.23:1 against the light background `#F1F1F4`.

Figures were computed with the WCAG 2.x relative-luminance formula. The script is in the transcript and is reproducible with any contrast checker.

### Deliberately unchanged

- Focus outlines (`--primary-button-outline #5190EC`, `--theme-editbox-focus-border`). Upstream is 5.60:1 on dark and 3.21:1 on light. The candidate green `#20C940` fails on light (2.21:1). Change only after visual QA.
- Link colour, semantic status/priority colours, positive/negative buttons, editor, syntax highlighting, collaborator cursors.
- Selected navigation, sidebar and surface palettes. Upstream neutrals are kept until the six prototype surfaces are reviewed (VISUAL_QA_MATRIX.md).

Implementation: `packages/theme/styles/_caspel-pm.scss` (the only file containing Caspel colour literals, verified by grep), loaded by `global.scss` right after the upstream colour files. Removing that one `@use` line restores upstream colours.

## Logo and icons

- **Resolved (B-004)**: Authentic Caspel evergreen geometric mark masters are present in `logos/` (`1705927011_caspel.png` and `footer_logo_*.png`).
- A complete derivative asset set has been generated and integrated into `dev/prod/public/caspel-pm/` (`favicon.ico`, `favicon.svg`, `apple-touch-icon.png`, `icon-192/512/1024.png`, `icon-maskable-512.png`, `mark-navy/white.png`, `logo-light/dark.png`) and linked with cache-busting query `?v=3`.
- `LoginIcon.svelte` and `OnboardIcon.svelte` embed the authentic Caspel geometric mark vector.
- 20-year anniversary artwork is strictly excluded from permanent brand identity. Small-size favicon rendering verified in browser testing.

## Typography

- Upstream stack kept: `'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto`. Regular, Medium, SemiBold and Bold woff/woff2 are bundled under `packages/theme/fonts/complete`. IBM Plex is published by IBM under SIL OFL 1.1, but **no OFL licence file sits next to the font files** in this repo; add one (LICENSE_ATTRIBUTION_AUDIT.md). Glyph coverage **verified** on 2026-09-16 by parsing the `cmap` table of each bundled `.woff` file (844 mapped code points per weight). All four weights map `ə Ə ğ Ğ ı İ ö Ö ü Ü ç Ç ş Ş` and the full Russian alphabet, including `Ё ё`. The `.woff2` files were not parsed separately. On-screen rendering still needs a visual check (ACCESSIBILITY_REPORT.md).
- Gilroy (observed on caspel.com) is **not** bundled: redistribution rights are unconfirmed (B-005).

## Copy

- Login and onboarding: "Start using Caspel PM".
- Mail sync footer: `Sent via Caspel PM`, with no link because there's no approved public URL. Override with `FOOTER_MESSAGE`.
- Service root pages: "Caspel PM <service> service. Based on the open-source Huly® Platform (EPL-2.0), © <year> Huly Labs." Product identity is kept separate from the upstream attribution.
- `Ahead of Time` is not used inside the product UI.
