# Caspel PM: Staging and Release Manifest

**Date:** 2026-09-17
**Branch:** `delivery/caspel-pm-web-rc1`
**Base commit:** `63e28dc96483967b2fc21c881b3f1023c1de7718` (`develop`, `s0.7.327-474`)
**Remote:** `origin https://github.com/anormalguy96/caspel-pm.git`
**Submodules:** 0 submodules
**Status:** Worktree frozen and protected under release candidate branch

---

## 1. Classification Overview

Every changed and untracked path in the working tree is classified into one of seven categories per Phase 0 of [DEEP_IMPLEMENTATION_PLAN.md](file:///d:/github_repos/platform/docs/caspel-pm/DEEP_IMPLEMENTATION_PLAN.md):

| Category | Description | Staging Action |
| --- | --- | --- |
| **Product change** | Application code, configuration, models, styling, and services | Stage in product commit series |
| **Test/CI change** | Automated test suites, test mocks, and CI workflows | Stage in test/CI commit family |
| **Source brand asset** | Original master logos and raw vector/bitmap brand sources | Stage in asset commit family |
| **Generated production asset** | Web manifests, favicons, app icons, and runtime derivatives | Stage in asset commit family |
| **Documentation** | Fork audits, QA reports, registers, and delivery runbooks | Stage in documentation commit family |
| **Owner-only instruction** | Personal agent execution prompts (`CASPEL_PM_MASTER_AGENT_PROMPT.md`) | **EXCLUDED** from release commits via `.gitignore` |
| **Local scratch / generated output** | Build output logs (`output.txt`), scratch files, temp data | **EXCLUDED** from release commits via `.gitignore` |

---

## 2. Category Breakdown

### 2.1 Product Changes

- **Repository configuration & line endings:**
  - `.gitattributes` (line-ending normalization `* text=auto eol=lf`)
  - `.gitignore` (explicit exclusions for `output.txt` and `CASPEL_PM_MASTER_AGENT_PROMPT.md`)
- **Branding & Runtime Configuration:**
  - `dev/branding.json` (backend dev branding keyed to Caspel PM)
  - `dev/docker-compose.yaml` (`DISABLE_SIGNUP=true`, deterministic MinIO image, desktop update feed emptied)
  - `dev/local-mongo/docker-compose.yaml` (deterministic MinIO image)
  - `dev/prod/public/branding.json` (frontend web branding, Caspel PM title & assets `?v=3`)
  - `dev/prod/src/index.ejs` (Caspel PM first-paint title & favicon)
  - `dev/prod/src/platform.ts` (Caspel PM fallback title & backup link wiring)
- **Styling & Appearance:**
  - `packages/theme/styles/_caspel-pm.scss` (Caspel brand tokens, button and control styles)
  - `packages/theme/styles/global.scss` (import Caspel theme layer)
  - `packages/theme/src/Theme.svelte` & `packages/theme/src/index.ts` (theme provider integration)
  - `plugins/setting-resources/src/components/AppearanceSettings.svelte` (deep appearance settings: theme, font size, density, motion, reset)
  - `models/setting/src/index.ts` (register Appearance category for all users)
- **Login, Authentication & Shell:**
  - `plugins/login-resources/src/components/LoginApp.svelte` (signup removed, redirect to login, navy theme)
  - `plugins/login-resources/src/components/Tabs.svelte` (signup tab removed, login title header)
  - `plugins/login-resources/src/components/PasswordRequest.svelte` (signup button removed)
  - `plugins/login-resources/src/components/SelectWorkspace.svelte` (signup button removed)
  - `plugins/login-resources/src/components/icons/LoginIcon.svelte` (authentic Caspel geometric mark)
  - `plugins/onboard-resources/src/components/OnboardApp.svelte` (navy branding backdrop)
  - `plugins/onboard-resources/src/components/icons/OnboardIcon.svelte` (authentic Caspel mark)
  - `plugins/workbench-resources/src/components/Workbench.svelte` (safe support links)
  - `plugins/workbench-resources/src/components/HelpAndSupport.svelte` (safe external links, `rel=noopener`)
  - `plugins/workbench-resources/src/components/AccountPopup.svelte` (signup disabled when unconfigured)
  - `plugins/view-resources/src/components/ReadOnlyNotification.svelte` (signup disabled)
  - `packages/ui/src/components/Icon.svelte` (icon component adjustments)
- **Privacy & Avatars:**
  - `plugins/contact-resources/src/components/SelectAvatarPopup.svelte` (Gravatar auto-probing disabled)
  - `plugins/contact-assets/assets/icons.svg` (neutralized contact icons)
- **Account Service & RBAC:**
  - `server/account/src/operations.ts` (`DISABLE_SIGNUP=true` enforcement in `signUp` and `signUpOtp`; auto-provisioning `readOnlyGuestAccountUuid` in `loginAsGuest`)
  - `models/contact/src/index.ts` (provider label Caspel PM)
- **Backup, Storage & Initialization:**
  - `plugins/setting/src/index.ts` (`metadata.BackupRestoreGuideUrl`)
  - `plugins/setting-resources/src/index.ts` & `plugins/setting-resources/src/utils/backup.ts` (backup guide config & download link)
  - `plugins/setting-resources/src/components/Backup.svelte` (backup guide display)
  - `server/tool/src/initScript.ts` & `server/tool/src/index.ts` (explicit-only workspace initialization)
  - `pods/workspace/caspel-pm-init/**` & `pods/workspace/Dockerfile` (Caspel PM starter workspace content)
- **Server Identity, Mail & Outbound Services:**
  - `server-plugins/calendar-resources/src/index.ts` (calendar resource identity)
  - `server-plugins/notification-resources/src/index.ts` (email template identity)
  - `services/backup/backup-api-pod/src/server.ts` (backup API root identity)
  - `services/datalake/pod-datalake/src/server.ts` (datalake root identity)
  - `services/gmail/pod-gmail/src/config.ts` (email footer Caspel PM)
  - `services/mail/pod-mail-worker/src/config.ts` (mail footer Caspel PM)
  - `services/notification/pod-notification/src/main.ts` & `README.md` (mandatory `PUSH_SUBJECT`)
  - `services/sign/pod-sign/src/server.ts` & `debug/branding.json` (signature title)
  - `services/telegram-bot/pod-telegram-bot/src/config.ts` (bot application name)
  - `pods/link-preview/src/config.ts`, `src/parse.ts`, `src/server.ts` (link preview User-Agent / oEmbed)
  - `pods/preview/src/server.ts` (preview service identity)
  - `plugins/support/src/index.ts` (safe support links)
  - `plugins/text-editor-resources/src/components/extension/reference.ts` (reference handling)
  - `plugins/calendar-resources/src/components/CalendarSettings.svelte` (calendar settings)
- **Protected User-Owned Change:**
  - `pods/fulltext/tsconfig.json` (`"declaration": true` preserved byte-for-byte; B-000)
- **Localization Files (141 files):**
  - `plugins/*-assets/lang/*.json`
  - `server/account/lang/*.json`
  - `services/github/github-assets/lang/*.json`

### 2.2 Test & CI Changes

- `.github/workflows/caspel-pm-brand-guard.yml` (automated CI workflow for residual brand check)
- `scripts/caspel-pm/check-residual-brand.js` (brand scanner script)
- `server/account/src/__tests__/operations.test.ts` (guest sign-in auto-provisioning test)
- `plugins/support/src/__tests__/links.test.ts` (support link validation test)
- `plugins/setting-resources/src/__tests__/backup.test.ts` (backup restore guide test)
- `server/tool/src/__tests__/initScript.test.ts` (workspace init script test)
- `services/gmail/pod-gmail/src/__tests__/config.test.ts`, `attachments.test.ts`, `__mocks__/config.ts` (Gmail config & attachments tests)

### 2.3 Source Brand Assets

Located under `logos/`:
- `logos/1705927011_caspel.png` (light-mode navy geometric mark master)
- `logos/footer_logo_16843049791615629263.png` (dark-mode white geometric mark master)

### 2.4 Generated Production Assets

Located under `dev/prod/public/caspel-pm/`:
- `apple-touch-icon.png` (180x180, 80% safe zone)
- `favicon.ico` (multi-size 16x16, 32x32, 48x48)
- `favicon.svg` (crisp scalable geometric mark)
- `icon-192.png`, `icon-512.png`, `icon-1024.png` (standard PWA app icons)
- `icon-maskable-512.png` (Android/PWA maskable icon with safe zone)
- `logo-dark.png`, `logo-light.png` (high-res logo lockups)
- `mark-navy.png`, `mark-white.png` (isolated brand marks)
- `site.webmanifest` (PWA web manifest `?v=3`)

### 2.5 Documentation

Located under `docs/caspel-pm/`:
- `ACCESSIBILITY_REPORT.md`
- `BLOCKERS.md`
- `BRAND_ASSET_INVENTORY.md`
- `BRAND_DECISIONS.md`
- `BUILD_REPORT.md`
- `CUSTOMIZATION_REGISTER.md`
- `DEEP_IMPLEMENTATION_PLAN.md`
- `DEPLOYMENT_CONFIG_AUDIT.md`
- `EMAIL_NOTIFICATION_AUDIT.md`
- `FINAL_DELIVERY_REPORT.md`
- `FINAL_RESIDUAL_BRAND_REPORT.md`
- `FUNCTIONAL_QA_MATRIX.md`
- `IDENTIFIER_CLASSIFICATION.md`
- `IDENTIFIER_EXCEPTION_REGISTER.md`
- `LICENSE_ATTRIBUTION_AUDIT.md`
- `LOCALIZATION_GLOSSARY.md`
- `LOCALIZATION_STATUS.md`
- `NETWORK_DESTINATION_AUDIT.md`
- `OUTBOUND_DEPENDENCY_REGISTER.md`
- `OUTBOUND_LINK_AUDIT.md`
- `PWA_DESKTOP_AUDIT.md`
- `README.md`
- `REBRAND_INVENTORY.md`
- `ROLLBACK_NOTES.md`
- `RUNTIME_QA_REPORT.md`
- `SECURITY_REVIEW_NOTES.md`
- `SSO_INTEGRATION_NOTES.md`
- `STAGING_MANIFEST.md` (this file)
- `TEST_REPORT.md`
- `UPSTREAM_BASELINE.md`
- `UPSTREAM_MERGE_PLAYBOOK.md`
- `VISUAL_QA_MATRIX.md`
- `WORKSPACE_SEED_SPEC.md`

### 2.6 Owner-Only Instructions (Excluded)

- `CASPEL_PM_MASTER_AGENT_PROMPT.md` — personal execution prompt, explicitly excluded from release commits and ignored in `.gitignore`.
- `AGENTS.md` — local IDE operating instructions.

### 2.7 Local Scratch & Generated Output (Excluded)

- `output.txt` — local Rush build log, explicitly excluded from release commits and ignored in `.gitignore`.
