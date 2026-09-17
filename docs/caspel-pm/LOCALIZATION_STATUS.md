# Localization status

## Brand-name rebrand of existing locales

Changed only **values** in `*/lang/*.json`, never keys. Tool: a line-based rewrite that re-parsed every file as JSON before writing.

| Metric | Result |
| --- | --- |
| Files containing `Huly` before | 155 |
| Values changed | 271 (in 141 files) |
| Languages touched | en, ru, pl, pt, pt-br, es, fr, de, it, cs, ja, ko, tr, zh (+ one `sp.json`) |
| Placeholder check | Every changed line pair compared for `{name}` tokens: **0 mismatches** |
| JSON validity | Every rewritten file parsed successfully |
| Remaining `Huly` in values | Only `ExportUnifiedFormat` (14 files), retained as E-010 |
| Account email HTML | Header wordmark, body text, footer; header/button background `#18181B` → `#0A2A3D` |

Branding `languages` list is unchanged: `en,ru,pl,pt,pt-br,es,zh,fr,de,ja,ko,tr`.

Review priority: en and ru (likely first-release languages), then tr, ko, pt and de, where grammar was adjusted.

## Azerbaijani (az)

| Item | Status |
| --- | --- |
| `az` resource files | **None exist** (0 of 67 `en.json` resource packages) |
| English keys to translate | 4,458 keys across 67 packages (counted 2026-09-16) |
| Glossary | Proposed, unapproved (LOCALIZATION_GLOSSARY.md) |
| Font glyphs | Bundled IBM Plex Sans maps all Azerbaijani letters (verified via cmap) |
| Enabled in branding | **No**. Azerbaijani is **not approved for this release** (owner decision 2026-09-16); future work |
| Language selector / `addStringsLoader` wiring | Not added |
| Email templates (`server/account/lang/az.json`) | Not created |
| Date/time, Baku timezone, dotted/dotless I casing | Not tested |

Recommended sequence: approve glossary → translate login, workbench, tracker, document, chunter, notification, setting and account emails first → add `az` loaders → enable on staging for a pilot group.
