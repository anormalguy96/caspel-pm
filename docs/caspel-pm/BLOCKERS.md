# Blockers and owner decisions

**Hard stop** = production rollout must not happen until resolved (master prompt §57).

| ID | Blocker / decision | Owner needed | Current safe state | Hard stop |
| --- | --- | --- | --- | --- |
| B-000 | **User-owned configuration (protected).** `pods/fulltext/tsconfig.json` (and at one point `.eslintrc.js`) were changed intentionally by the repository owner. Current state (2026-09-16 continuation): `tsconfig.json` only adds `"declaration": true`; `.eslintrc.js` is unmodified; no `@caspel/platform-rig` reference remains. `rush build` and `rush validate` for `@hcengineering/pod-fulltext` succeeded with this state. Not to be modified without owner authorization | Repo owner | Left as the owner set it | No (reclassified: USER_OWNED_CONFIGURATION, not a blocker) |
| B-001 | Fork tracks moving `develop` (`s0.7.327-474`), not a production `v*` tag | Engineering lead | Documented | No |
| B-002 | Build and test verification. Continuation run (owner-authorized): `rush install` ✅, `rush build` ✅, `rush validate` ✅ (0 type errors). Unit tests of all 38 changed packages ran; three integration suites need live CockroachDB/PostgreSQL/Kafka (see TEST_REPORT.md). A pre-change upstream baseline build was not produced separately | Engineer | See BUILD_REPORT.md, TEST_REPORT.md | No longer a hard stop for development; production still needs CI on Linux |
| B-003 | Internal-only vs customer-facing; relationship to Caspel TMS | Product owner | No positioning claims in UI | No |
| B-004 | Approved logo masters, app icon, small-size favicon icon. **RESOLVED in fork**: Authentic evergreen masters in `logos/` (`1705927011_caspel.png` and `footer_logo_*.png`) measured and converted into full derivative icon set (`favicon.ico`, `favicon.svg`, `apple-touch-icon.png`, `icon-192/512/1024.png`, `icon-maskable-512.png`, `mark-navy/white.png`). Embedded into `LoginIcon.svelte` and `OnboardIcon.svelte`. 20-year anniversary artwork excluded from permanent identity | Brand owner | Authentic brand assets integrated | **Resolved** |
| B-005 | Gilroy licence for web/desktop redistribution | Brand/legal | IBM Plex Sans (upstream, OFL) | No |
| B-006 | Production and staging hostnames | Ops | Branding keyed on `huly.local:*` dev hosts; unknown hosts fall back to title `Caspel PM` but get **no manifest link** | **Yes**: add a host entry to `branding.json` |
| B-007 | Support, docs, privacy, bug-report and status destinations | Support owner, legal | Empty defaults; the UI hides the entries | **Yes** for privacy policy if legally required |
| B-008 | Desktop distribution: **out of first-release scope** (web edition only). Desktop code unchanged (Huly name, `dist.huly.io`, `huly.app` default server). Web UI has no desktop download links; dev compose sends an empty `DESKTOP_UPDATES_URL` | Product, ops | Desktop not distributed | Yes, before any desktop release |
| B-009 | Azerbaijani **not approved** for this release. No `az` resources; glossary kept as future work (4,458 keys) | Product owner | `az` not enabled | No |
| B-010 | OIDC issuer, client, claims, admission policy, recovery path | IAM owner | Nothing configured | Yes, if SSO-only |
| B-011 | Email sender identity / SMTP provider | Ops | Deployment-configured; nothing hardcoded | Yes |
| B-012 | Legal review of changed legal-adjacent strings: `GooglePrivacy` (calendar, gmail) and email footer `© Caspel PM — All rights reserved` | Legal | Rebranded text, pending review | Yes, before enabling Google integrations |
| B-013 | Analytics/telemetry, AI and LiveKit policies | Security/privacy | Upstream behaviour: all config-driven, off unless URLs are set | Yes: confirm production config leaves them unset |
| B-014 | GitHub App ownership (dev `config.json` references upstream dev app `uberflow-dev`) | Engineering | Dev-only file | Yes, if GitHub integration is enabled |
| B-015 | Required modules (e.g. billing, recruiting, "Caspel PM Mail", Telegram) | Product owner | All upstream modules unchanged | No |
| B-016 | Web push now requires `PUSH_SUBJECT` (upstream default `mailto:hey@huly.io` removed) | Ops | Push disabled with a warning until set | No |
| B-017 | Design review of the Caspel PM visual system. Deep Appearance settings implemented (Theme: Light/Dark/System; Font Size: Compact/Default/Comfortable/Large; Density: Compact/Comfortable; Motion: System/Reduced/Full; Reset) | Design owner | Tokens, live settings, and authentic assets active | **Yes (Approval)** |
| B-018 | Permission / private-content isolation tests | QA/security | Not executed | **Yes** |
| B-019 | Backup restore rehearsal, RPO/RTO | Ops | Not executed | **Yes** |
| B-020 | Named owners for product, support, operations and exception review | Management | Unassigned | Yes |
| B-021 | `huly-selfhost` companion deployment repo is not present; its images, compose and nginx need a separate Caspel audit | Ops | Gap recorded | Yes, before deploying via selfhost |
| B-023 | Upstream starter content. **Fixed in fork:** no seeding unless a script is named; opt-in Caspel starter set verified at runtime (WORKSPACE_SEED_SPEC.md). Remaining: upstream CI `main.yml` still downloads `hcengineering/init` into images (inert unless named) | Product owner + ops | Default: empty workspace | No |
| B-022 | Container registry and image build pipeline for Caspel fork images | Ops | Not configured | **Yes**: stock upstream images do not contain these changes |
| B-024 | Gravatar: avatar picker probes `gravatar.com` with an MD5 hash of the user email and client IP. **RESOLVED in fork**: automatic background lookup disabled in `SelectAvatarPopup.svelte`; defaults strictly to uploaded avatars and local colored initials | Privacy owner | Zero third-party avatar network requests | **Resolved** |
| B-025 | `minio/minio` image is no longer publicly pullable; dev compose needs another MinIO image source (local QA used `quay.io/minio/minio` via an uncommitted override) | Ops | Dev only | No |
| B-026 | Rush `package`/`docker-build` phases need a POSIX shell (fail on Windows `cmd`); `do-svelte-check` falsely exits 0 on Windows | Engineering | Build images on Linux CI | No (dev tooling) |
