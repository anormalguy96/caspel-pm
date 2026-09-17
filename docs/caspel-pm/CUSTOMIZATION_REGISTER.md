# Customization register

Every file changed or added by the Caspel PM conversion (2026-09-16), grouped by concern. Excludes owner files `AGENTS.md` and `CASPEL_PM_MASTER_AGENT_PROMPT.md`, and the unexplained `pods/fulltext/*` change (B-000).

## 1. Branding configuration and first paint

| File | Change |
| --- | --- |
| `dev/prod/src/index.ejs` | Title `Caspel PM`; default favicon `/caspel-pm/favicon.svg?v=3` |
| `dev/prod/src/platform.ts` | Title fallback `Caspel PM`; `SIGNUP_URL` fallback empty |
| `dev/prod/public/branding.json` | `huly.local:8080`, `:8087`, `host.docker.internal:8087`: title + Caspel PM manifest/icon links (`?v=3`) |
| `dev/branding.json` | Titles for `huly.local:8080`, `:8087`, `host.docker.internal:8087` (Caspel PM) and `host.docker.internal:8088` (TraceX) |
| `dev/prod/public/caspel-pm/favicon.svg` | **new**, authentic Caspel mark |
| `dev/prod/public/caspel-pm/site.webmanifest` | **new**, manifest `?v=3` |

## 2. Theme

| File | Change |
| --- | --- |
| `packages/theme/styles/_caspel-pm.scss` | **new** token layer (buttons, selectors) |
| `packages/theme/styles/global.scss` | `@use "./_caspel-pm.scss"` after upstream colour files |

## 3. Login and shell

| File | Change |
| --- | --- |
| `plugins/login-resources/src/components/icons/LoginIcon.svelte` | Authentic Caspel geometric mark |
| `plugins/login-resources/src/components/LoginApp.svelte` | Artwork `<picture>` → navy CSS backdrop; public sign-up route removed; panel colours to navy |
| `plugins/login-resources/src/components/Tabs.svelte` | Removed "Sign Up" tab, clean "Sign in to Caspel PM" title |
| `plugins/login-resources/src/components/PasswordRequest.svelte` | Removed "Sign Up" button |
| `plugins/login-resources/src/components/SelectWorkspace.svelte` | Removed "Sign Up" button |
| `plugins/workbench-resources/src/components/Workbench.svelte` | Sidebar Contact us uses branding metadata, hidden when empty/unsafe |
| `plugins/workbench-resources/src/components/HelpAndSupport.svelte` | Docs card and footer links conditional + `safeExternalLink`; `rel=noopener` |
| `plugins/workbench-resources/src/components/AccountPopup.svelte` | Sign-up action only when `SIGNUP_URL` set |
| `plugins/view-resources/src/components/ReadOnlyNotification.svelte` | Sign-up button only when `SIGNUP_URL` set |

## 4. Support destinations

| File | Change |
| --- | --- |
| `plugins/support/src/index.ts` | Default links emptied; `safeExternalLink()` added |
| `plugins/support/src/__tests__/links.test.ts` | **new** unit test |

## 5. Localization values

141 files under `plugins/*-assets/lang/`, `services/*/*-assets/lang/`, `server/account/lang/`: 271 values (see `LOCALIZATION_STATUS.md`). Account email templates also change header/button background to `#0A2A3D`.

## 6. Server-side identity, email and outbound

| File | Change |
| --- | --- |
| `server/account/src/operations.ts` | TOTP app name fallback `Caspel PM`; `DISABLE_SIGNUP=true` server-side enforcement; `loginAsGuest` auto-provisions `readOnlyGuestAccountUuid` |
| `server/account/src/__tests__/operations.test.ts` | Guest sign-in auto-provisioning unit tests |
| `server-plugins/notification-resources/src/index.ts` | Email "View in" app fallback `Caspel PM` |
| `services/sign/pod-sign/src/server.ts` | PDF signature title fallback |
| `services/telegram-bot/pod-telegram-bot/src/config.ts` | `APP` default |
| `services/mail/pod-mail-worker/src/config.ts` | Footer default `Sent via Caspel PM` |
| `services/gmail/pod-gmail/src/config.ts`, `src/__mocks__/config.ts`, `src/__tests__/config.test.ts`, `src/__tests__/attachments.test.ts` | Footer default + matching tests |
| `services/notification/pod-notification/src/main.ts`, `README.md` | No `mailto:hey@huly.io` default; `PUSH_SUBJECT` required |
| `pods/link-preview/src/config.ts`, `src/parse.ts` | User-Agent / oEmbed name |
| `pods/preview/src/server.ts`, `pods/link-preview/src/server.ts`, `services/backup/backup-api-pod/src/server.ts` (two root routes), `services/datalake/pod-datalake/src/server.ts` | Root page identity + attribution |
| `models/contact/src/index.ts` | Social identity provider label `Caspel PM` |

## 6b. Second pass (2026-09-16)

| File | Change |
| --- | --- |
| `plugins/contact-assets/assets/icons.svg` | `#huly` glyph → neutral placeholder (id kept) |
| `plugins/onboard-resources/src/components/OnboardApp.svelte`, `icons/OnboardIcon.svelte` | Upstream artwork and mark → navy backdrop + authentic Caspel mark |
| `plugins/setting/src/index.ts` | `metadata.BackupRestoreGuideUrl` |
| `plugins/setting-resources/src/utils/backup.ts`, `components/Backup.svelte`, `__tests__/backup.test.ts` | Configurable, validated restore guide; Caspel PM script/archive/RESTORE.md text; tests |
| `dev/prod/src/platform.ts` | Branding `support.backupRestoreGuideLink` wiring |
| `server/tool/src/initScript.ts` (new), `src/index.ts`, `src/__tests__/initScript.test.ts` (new) | Explicit-only init script selection |
| `pods/workspace/caspel-pm-init/**` (new), `pods/workspace/Dockerfile` | Opt-in Caspel starter content |
| `server-plugins/calendar-resources/src/index.ts` | Internal calendar name from branding title |
| `plugins/calendar-resources/src/components/CalendarSettings.svelte` | Internal calendar group heading uses product title |
| `packages/ui/src/components/Icon.svelte`, `plugins/text-editor-resources/src/components/extension/reference.ts` | Removed `anticrm.org` fallback request |
| `packages/theme/styles/_caspel-pm.scss` | Semantic `--cpm-ui-accent*` tokens |
| `dev/prod/public/caspel-pm/**`, `dev/prod/public/branding.json`, `dev/prod/src/index.ejs` | Authentic Caspel brand asset suite, logos, README; `?v=3` |
| `dev/docker-compose.yaml` | Empty `DESKTOP_UPDATES_URL`; `DISABLE_SIGNUP=true`; commented seed opt-in |
| `services/sign/pod-sign/debug/branding.json` | Dev title Caspel PM |
| `scripts/caspel-pm/check-residual-brand.js`, `residual-brand-allowlist.json`, `render-icons.js` (new) | Guard rule 4 + extra domains; icon renderer |

## 6c. Hardening & Release Candidate Pass (2026-09-17)

| File | Change |
| --- | --- |
| `logos/**` | Authentic Caspel master marks (`1705927011_caspel.png`, `footer_logo_*.png`) |
| `dev/prod/public/caspel-pm/**` | Complete derivative asset suite: `favicon.ico`, `favicon.svg`, `apple-touch-icon.png`, `icon-192/512/1024.png`, `icon-maskable-512.png`, `mark-navy/white.png`, `logo-light/dark.png` (`?v=3`) |
| `plugins/setting-resources/src/components/AppearanceSettings.svelte` (new) | Deep appearance preferences: Theme (System/Light/Dark), Font Size (13/15/16/18px), Density (Compact/Comfortable), Motion (System/Reduced/Full), Reset |
| `models/setting/src/index.ts` | Registered Appearance setting category (`order: 500`) |
| `plugins/contact-resources/src/components/SelectAvatarPopup.svelte` | Disabled automatic Gravatar probing |
| `dev/docker-compose.yaml`, `dev/local-mongo/docker-compose.yaml` | Pinned MinIO image to deterministic `${MINIO_IMAGE:-quay.io/minio/minio:RELEASE.2024-09-13T20-26-02Z}` |
| `dev/branding.json`, `dev/prod/public/branding.json` | Reconciled `host.docker.internal:8087` (Caspel PM) and `host.docker.internal:8088` (TraceX) |
| `.gitattributes`, `.gitignore` | Normalized line endings to LF (`* text=auto eol=lf`); ignored scratch `output.txt` and master prompt |
| `docs/caspel-pm/STAGING_MANIFEST.md` (new) | Comprehensive staging classification manifest |

## 7. Guard, CI, docs

| File | Change |
| --- | --- |
| `scripts/caspel-pm/check-residual-brand.js`, `residual-brand-allowlist.json` | **new** |
| `.github/workflows/caspel-pm-brand-guard.yml` | **new** |
| `README.md` | Fork notice prepended |
| `docs/caspel-pm/*` | **new** documentation set |
