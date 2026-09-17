# Rollback notes

All changes are source-level and reversible. No data migrations, ID renames or schema changes were made.

| Concern | Rollback |
| --- | --- |
| Entire conversion | Revert the conversion commits (grouped per `UPSTREAM_MERGE_PLAYBOOK.md`), rebuild images, redeploy the previous image digests |
| Theme only | Delete `@use "./_caspel-pm.scss" as *;` from `packages/theme/styles/global.scss` |
| Branding/first paint | Revert `index.ejs`, `branding.json` files; `/huly/` assets are still present |
| Support links | Set `support.*` in branding JSON (preferred), or revert `plugins/support/src/index.ts` |
| Web push | Set `PUSH_SUBJECT` (no code rollback needed) |
| Mail footer | Set `FOOTER_MESSAGE` |
| Link-preview UA | Set `USER_AGENT` |
| Social identity label (`models/contact`) | Revert; the next workspace upgrade restores the model label. No stored data depends on it |
| Locale values | `git revert` of the locale commit; values only, so no key or placeholder impact |

Operational caveats:
- Browsers cache favicons and manifests. Rolling back icons needs a new `?v=` value to take effect promptly.
- Emails already sent keep the Caspel PM identity. Authenticator apps keep the label used at enrolment.
- Telegram bot descriptions update on the next bot start after rollback.
