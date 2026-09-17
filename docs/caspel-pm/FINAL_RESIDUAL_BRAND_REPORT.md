# Final residual brand report

Generated 2026-09-16 on the working tree after the conversion.

## Machine check

```sh
node scripts/caspel-pm/check-residual-brand.js
# Caspel PM residual-brand check: 0 unclassified finding(s)
```

Coverage:
1. `Huly` in any localization value.
2. `huly.io`, `huly.app`, `hulylabs.com`, `hardcoreeng.com` and `github.com/hcengineering/` URLs in non-test runtime source under `dev/prod`, `plugins`, `packages`, `server`, `server-plugins`, `services`, `pods`, `models`.
3. First-paint title and manifest name.

Allowlisted items map to E-010, E-020, E-021, E-024, E-025 and E-026.

Proof the guard detects regressions: run against the pre-change `plugins/support/src/index.ts`, rule 2 matches 3 upstream URLs. Widening rule 2 to the upstream GitHub org immediately surfaced 3 previously unlisted occurrences, which were then classified.

## Occurrence counts

| Search | Before | After |
| --- | ---: | ---: |
| `git grep 'Huly\|HULY\|huly'` (excl. prompt, AGENTS.md, pnpm lock, Caspel docs/scripts) | 3,687 | 3,422 |
| `Huly` lines in `*/lang/*.json` | 285 | 56 (42 are key names `StartUsingHuly`/`ConnectHulyMail`; 14 are E-010) |
| User-facing `Huly` literals in Svelte markup | 0 (strings come from locales) | 0; remaining Svelte hits are comments/identifiers |
| Upstream web URLs in runtime source | support defaults, signup, mail footers, 5 root pages, VAPID subject, … | only allowlisted items |

## Remaining occurrences by class

| Class | Where | Register |
| --- | --- | --- |
| INTERNAL_IDENTIFIER | `@hcengineering/*`, plugin/model IDs, `SocialIdType.HULY`, service IDs, topics, env vars, mail headers, MIME types, `--huly-top-indent`, importer `Huly*` types, HulyPulse/hulylake/hulykvs code and directories | E-001…E-009 |
| LEGAL_ATTRIBUTION | Copyright headers; "Based on the open-source Huly® Platform" on service root pages | E-012 |
| DOC_EXAMPLE / upstream reference | README body, ARCHITECTURE_OVERVIEW, changelog, SECURITY.md, `docs/guides`, foundations READMEs, import-tool docs, `huly.local` | E-011, E-050 |
| OPERATOR_FACING dev config | `config-huly.json`, webpack dev proxy, compose `DESKTOP_UPDATES_URL` | E-020, E-021, E-041 |
| TEST_FIXTURE | `tests/`, `ws-tests/`, `qms-tests/`, service `__tests__` | E-060 |
| USER_FACING, accepted interoperability | "Huly Unified Format" export label | E-010 (review) |
| USER_FACING, admin link to upstream guide | Backup restore guide | E-024 (review) |
| USER_FACING asset still shown | `contact.icon.Huly` sprite glyph | **resolved**: neutral mark in `icons.svg` (E-029), authentic mark masters integrated (B-004) |
| USER_FACING, external content | GitHub backlink text `Huly®:` | E-030 (review; `LINK_TEXT` env) |
| USER_FACING, out of scope | Desktop app | E-040 (B-008) |
| USER_FACING, outside repository | Workspace init scripts ("Welcome to Huly!" issues) | **resolved**, explicit init script selection (B-023) |

## Remaining user-facing items (updated 2026-09-17)

1. Built-in account identity glyph: **replaced** (E-029).
2. Upstream onboarding seed: **fixed**; no seeding unless named, Caspel starter set runtime-verified (WORKSPACE_SEED_SPEC.md).
3. Desktop identity: out of first-release scope (B-008).
4. Authentic Caspel brand asset suite integrated (`?v=3`; B-004 resolved).
5. "HULY" calendar name only on workspaces migrated by upstream before the fork (E-027).
6. Runtime-verified: no Huly title/icon/text on first paint or web surfaces; public sign-up disabled; deep Appearance settings active; 0 external requests. Not verified: native desktop app, production push.

The guard gained rule 4 (bare `Huly`/`HULY` literals) and `anticrm.org` + upstream GitHub URLs. Final run: 0 unclassified findings.
