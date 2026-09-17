# Test report

Run 2026-09-16 (owner-authorized continuation), after the last code change. Command per package: `node common/scripts/install-run-rushx.js test` (Jest).

Legend: **RUNTIME VERIFIED** = executed and passed · **BLOCKED** = could not run in this environment.

## Unit tests: packages changed by Caspel PM (38 packages)

| Package | Suites | Tests | Result |
| --- | --- | --- | --- |
| packages/ui | 5 | 71 passed | ✅ |
| plugins/support | 1 | 3 passed (new `links.test.ts`) | ✅ |
| plugins/setting-resources | 3 | 43 passed (incl. new restore-guide tests) | ✅ |
| plugins/login-resources | 2 | 7 passed | ✅ |
| plugins/view-resources | 6 | 40 passed | ✅ |
| plugins/text-editor-resources | 4 | 18 passed | ✅ |
| server/tool | 1 | 3 passed (new `initScript.test.ts`) | ✅ |
| server-plugins/calendar-resources | 1 | 7 passed | ✅ |
| pods/link-preview | 1 | 69 passed | ✅ |
| pods/preview | 2 | 24 passed | ✅ |
| services/gmail/pod-gmail | 9 | 92 passed (updated footer assertions) | ✅ |
| services/mail/pod-mail-worker | 4 | 59 passed | ✅ |
| services/notification/pod-notification | 2 | 13 passed | ✅ |
| Locale key-parity tests (`*-assets`: billing, calendar, contact, gmail, huly-mail, login, notification, onboard, setting, workbench, github) | 11 | 11 passed | ✅ |
| models/contact, plugins/onboard-resources, plugins/setting, pods/workspace, server-plugins/notification-resources, services/backup/backup-api-pod, services/datalake/pod-datalake, services/sign/pod-sign | 0 (no test files) | — | ✅ exit 0 |
| packages/theme, plugins/calendar-resources, plugins/workbench-resources | no `test` script | — | n/a |

## Integration suites

| Package | First run | Re-run | Result |
| --- | --- | --- | --- |
| server/account | 4 failed (no database) | `DB_URL` → dev CockroachDB, `POSTGRES_URL` → local PostgreSQL 16 container | ✅ **9 suites, 522/522 passed** |
| services/telegram-bot/pod-telegram-bot | 16 failed (no database) | Same databases | ✅ **16/16 passed** |
| pods/fulltext (user-owned config) | 3 failed: Kafka connection error | Needs the upstream test stack (Redpanda :19093, Elasticsearch :9201, account :3003, hulylake :8096); not affordable next to the dev stack on 16 GB RAM | ⛔ **BLOCKED (MISSING_EXTERNAL_SERVICE)**, not a rebrand regression. Its `build`/`validate` pass |

Note: with PostgreSQL **15**, 4 `server/account` tests fail with `subquery in FROM must have an alias`. The upstream test stack uses PostgreSQL 18.1, and 16 passes. This is environment only.

## Summary

- Failed tests attributable to Caspel PM changes: **0**.
- Tests weakened or removed: **0**. Gmail footer assertions were updated to the intended new default; new tests were added for support links, restore-guide selection and init-script selection.
- Not executed: `tests/sanity` Playwright suite (upstream test stack) and `pods/fulltext` integration. Browser-level QA was instead run with custom Playwright scripts against the local stack (RUNTIME_QA_REPORT.md).
