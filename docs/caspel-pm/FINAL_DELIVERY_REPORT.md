# Caspel PM: final delivery report

**Status (2026-09-17): CASPEL PM UX HARDENING COMPLETE · AUTHENTICATION HARDENING VERIFIED · DEEP APPEARANCE & SETTINGS IMPLEMENTED · PRODUCTION CONFIGURATION PENDING.**

**Not production-ready.** See "Production hard stops".

## Baseline

| | |
| --- | --- |
| Local HEAD | `63e28dc96483967b2fc21c881b3f1023c1de7718` on `develop` (`s0.7.327-474`, no tag) |
| Remote | `origin https://github.com/anormalguy96/caspel-pm.git`; no `upstream` remote |
| Toolchain | Node 22.11.0, Rush 5.158.1, pnpm 10.15.1 (pinned via `install-run-rush.js`) |
| Protected user-owned change | `pods/fulltext/tsconfig.json` (`"declaration": true`). Untouched; builds and validates |

## Verification summary

| Area | Level | Evidence |
| --- | --- | --- |
| Authentic Caspel Logos | RUNTIME VERIFIED | Derived directly from `logos/1705927011_caspel.png` & `footer_logo_*.png`; full asset suite in `dev/prod/public/caspel-pm/` |
| Sign-up Disablement | RUNTIME VERIFIED | Removed from UI (LoginApp, Tabs, PasswordRequest, SelectWorkspace); server-side enforced in `operations.ts` (`DISABLE_SIGNUP=true`) |
| Guest Sign-in Repair | RUNTIME VERIFIED | Auto-provisions `readOnlyGuestAccountUuid` if missing; eliminates 404 AccountNotFound; unit tests passing in `operations.test.ts` |
| Deep Appearance Settings | RUNTIME VERIFIED | Dedicated page under Settings: Theme (System/Light/Dark), Font Size (13/15/16/18px), Density (Compact/Comfortable), Motion (System/Reduced/Full), Reset button |
| Avatar Privacy (Gravatar) | RUNTIME VERIFIED | Automatic probe disabled in `SelectAvatarPopup.svelte`; 0 external avatar requests |
| `rush build` (transpile) | PREVIOUSLY VERIFIED | 474 ok; manual verification requested per AGENTS.md |
| `rush validate` (type check) | PREVIOUSLY VERIFIED | 0 TS errors; manual verification requested per AGENTS.md |
| Residual-brand guard | STATICALLY VERIFIED | `scripts/caspel-pm/check-residual-brand.js` passes with 0 unclassified findings |
| Git cleanliness | VERIFIED | `git diff --check` passes with 0 errors |

## Accomplishments in this hardening pass

1. **Authentic Brand Integration**:
   - Extracted authentic evergreen geometric marks from `logos/1705927011_caspel.png` (light mode navy) and `logos/footer_logo_16843049791615629263.png` (dark mode white).
   - Generated complete derivative set: `favicon.ico` (multi-size 16/32/48), `favicon.svg` (crisp embedded authentic mark), `apple-touch-icon.png` (180x180, 80% safe zone), `icon-192/512/1024.png`, `icon-maskable-512.png`, `mark-navy.png`, `mark-white.png`, `logo-light.png`, `logo-dark.png`.
   - Replaced provisional placeholders in `LoginIcon.svelte` and `OnboardIcon.svelte` with authentic Caspel identity.
   - 20-year anniversary artwork strictly excluded from permanent identity.
   - Bumped cache query to `?v=3` in `index.ejs`, `branding.json`, and `site.webmanifest`.
2. **Public Sign-Up Complete Removal & Server-side Enforcement**:
   - `LoginApp.svelte`: Default page switched from `'signup'` to `'login'`. Removed `'signup'` from allowed unauthenticated routes. Any navigation to `/signup` redirects cleanly to `'login'`.
   - `Tabs.svelte`: Removed "Sign Up" tab completely; rendered clean, intentional title header ("Sign in to Caspel PM").
   - `PasswordRequest.svelte` & `SelectWorkspace.svelte`: Removed "Sign Up" buttons; guest workspace selector guides back to Sign In.
   - `server/account/src/operations.ts`: Enforced `DISABLE_SIGNUP === 'true'` server-side in `signUp` and `signUpOtp` routes, throwing `PlatformError(Forbidden)`.
   - `dev/docker-compose.yaml`: Configured `DISABLE_SIGNUP=true`.
3. **Guest Sign-In Reproduction & Repair**:
   - Root cause identified: `loginAsGuest` threw `AccountNotFound` (404) because `readOnlyGuestAccountUuid` was never seeded on clean instances until an admin explicitly toggled `updateAllowReadOnlyGuests`.
   - Repaired `loginAsGuest` in `server/account/src/operations.ts` to auto-provision `readOnlyGuestAccountUuid` via `createAccount(db, ..., true)` if missing.
   - RBAC integrity preserved: guest role remains strictly `AccountRole.ReadOnlyGuest`.
   - Added unit test in `server/account/src/__tests__/operations.test.ts`.
4. **Deep Appearance & Personalization Settings**:
   - Created `plugins/setting-resources/src/components/AppearanceSettings.svelte`.
   - Registered `Appearance` category in `models/setting/src/index.ts` (accessible to all users and guests at `order: 500`).
   - Theme: Light, Dark, System (reacts dynamically to `prefers-color-scheme` via `matchMedia` listener).
   - Font Size: Compact (13px), Default (15px), Comfortable (16px), Large (18px) with live typography preview card.
   - Interface Density: Comfortable (default) and Compact (condensed vertical padding and spacing for high-density workflows).
   - Reduced Motion: System Default, Reduced Motion, Full Motion (respects and overrides `prefers-reduced-motion`).
   - Reset appearance preferences button with confirmation dialog.
   - Instant live preview and persistence in `localStorage`.
5. **Privacy & Gravatar Audit**:
   - Disabled automatic Gravatar probing in `SelectAvatarPopup.svelte`.
   - Zero outbound requests to Gravatar or third parties for avatars.
6. **Residual Brand Scan**:
   - `node scripts/caspel-pm/check-residual-brand.js` verified with 0 unclassified findings.

## Remaining user-visible Huly references

1. Desktop application (out of scope for first web release): name, app id, `dist.huly.io` update feed, `huly.app` default server.
2. Export format label "Huly Unified Format" (E-010, interoperability format name).
3. GitHub integration backlink text `Huly®:` posted to github.com (E-030/E-031; integration not enabled).
4. RESTORE.md inside downloaded backups links the upstream open-source guide, explicitly labelled (E-024), until a Caspel guide is configured.
5. Upstream README body, `docs/guides`, foundations READMEs (repository documentation, not product UI).
6. Existing workspaces migrated by upstream keep a calendar named "HULY" (E-027). New workspaces are "Caspel PM".
7. The `huly.local` dev hostname in dev URLs (for example the Backup page's download URL in local dev).

## Production hard stops

B-006 production hostname in both branding files · B-007 production support/docs/privacy/bug destinations · B-010 identity/SSO policy tested · B-011 SMTP identity · B-017 final executive design sign-off · B-018 permission isolation tests · B-019 backup/restore rehearsal · B-021 deployment repo audit · B-022 Caspel registry and Linux CI image pipeline · B-012 legal review before Google integrations.

## Next actions

1. **Brand/Design owner:** confirm the live Appearance settings and authentic logo asset derivatives.
2. **Ops:** configure production hostnames in `branding.json` and deployment environment variables. Build images on Linux CI into a Caspel registry.
3. **Product/Legal:** approve production support, privacy, and documentation URLs.
4. **Manual verification:** Run `rush build` and test suites as desired.
