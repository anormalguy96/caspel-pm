# Functional QA matrix

**2026-09-16:** automated results in [TEST_REPORT.md](TEST_REPORT.md); runtime workflow results in [RUNTIME_QA_REPORT.md](RUNTIME_QA_REPORT.md). The tables below are the checklist template. The rebrand changes no model IDs, APIs or migrations, so regressions are most likely in the rows marked **risk**.

## Automated (repository canonical commands, run manually per AGENTS.md)

| Command | Scope | Result |
| --- | --- | --- |
| `rush install && rush build` | Whole monorepo (Svelte/TS compile of changed components) | ⬜ |
| `rush svelte-check` or `rushx svelte-check` in `plugins/workbench-resources`, `plugins/login-resources`, `plugins/view-resources` | Changed Svelte files | ⬜ |
| `rushx test` in `plugins/support` | New `links.test.ts` | ⬜ |
| `rushx test` in `services/gmail/pod-gmail` | Updated footer assertions | ⬜ |
| `rushx test` in `server/account`, `pods/link-preview`, `services/notification/pod-notification` | Changed fallbacks | ⬜ |
| `rushx test` in `*-assets` packages | en/ru locale key parity (values-only change) | ⬜ |
| `rushx lint` / `rushx format` in changed packages | Style | ⬜ |
| `node scripts/caspel-pm/check-residual-brand.js` | Brand guard | ✅ 0 findings (2026-09-16) |
| UI tests `tests/sanity` (Playwright) | End to end | ⬜ |

## Manual workflows

| Workflow | Risk | Result |
| --- | --- | --- |
| Sign up (if enabled), confirm email, sign in, password recovery | Email templates changed | ⬜ |
| 2FA enrolment: authenticator label | Label source | ⬜ |
| Invite member (email text + HTML), accept invite, resend invite | **risk**: email copy changed | ⬜ |
| Create/select workspace | none | ⬜ |
| Tracker: create issue, board/list, sub-issue, milestone, Gantt | Primary buttons recoloured | ⬜ |
| Document editing, multi-user collaboration, reconnect | none | ⬜ |
| Chat/inbox, mentions, notification email "View in Caspel PM" | Fallback name | ⬜ |
| Attachments upload/download; file preview service | none | ⬜ |
| Link preview (User-Agent changed) | **risk**: sites that sniff UA | ⬜ |
| Settings → Backup: guide button opens upstream guide | E-024 | ⬜ |
| Help & Support popup with and without branding `support` block | **risk**: new conditional rendering | ⬜ |
| Read-only guest: toast and account menu with and without `SIGNUP_URL` | **risk** | ⬜ |
| Mail sync send: footer "Sent via Caspel PM" | Footer change | ⬜ |
| Web push with and without `PUSH_SUBJECT` | **risk**: now disabled without subject | ⬜ |
| PDF signing: signature title | Fallback name | ⬜ |
| Workspace upgrade after model change (`models/contact` label) | **risk**: model hash changes, triggers upgrade | ⬜ |
| Export (Huly Unified Format label kept) and import tool | none | ⬜ |
| Permissions / private spaces (see SECURITY_REVIEW_NOTES.md) | unchanged code, unverified policy | ⬜ |
