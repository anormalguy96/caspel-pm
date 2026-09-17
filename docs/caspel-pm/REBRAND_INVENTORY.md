# Rebrand inventory

Search executed 2026-09-16 on the baseline tree:

```sh
git grep -n -I 'Huly\|HULY\|huly' -- ':!CASPEL_PM_MASTER_AGENT_PROMPT.md' ':!AGENTS.md' ':!common/config/rush/pnpm-lock.yaml'
```

3,687 matching lines before changes. Distribution by top-level directory:

| Area | Lines | Dominant classification |
| --- | ---: | --- |
| foundations | 958 | INTERNAL_IDENTIFIER (HulyPulse, hulylake, hulykvs, Rust/TS protocol code) |
| plugins | 849 | INTERNAL_IDENTIFIER (`@hcengineering/*`, `huly-mail` plugin); USER_FACING in `*/lang/*.json` |
| packages | 461 | INTERNAL_IDENTIFIER (importer `Huly*` types, pulse client) |
| dev | 323 | OPERATOR_FACING / DOC_EXAMPLE (`huly.local`, compose, branding) |
| services | 233 | INTERNAL_IDENTIFIER (`hulygun`, mail headers); USER_FACING mail footers |
| tests, ws-tests, qms-tests | 352 | TEST_FIXTURE |
| server | 115 | INTERNAL_IDENTIFIER (`SocialIdType.HULY`, migrations); USER_FACING fallbacks |
| .vscode, common, .github, scripts | 129 | OPERATOR_FACING / INTERNAL |
| desktop, desktop-package, qms-desktop-package | 69 | USER_FACING (desktop, out of scope — see PWA_DESKTOP_AUDIT.md) |
| pods, models, server-plugins | 64 | mixed; root pages and fallbacks changed |
| docs, README, ARCHITECTURE_OVERVIEW, changelog, SECURITY | ~150 | DOC_EXAMPLE / upstream reference |

## User-facing entry points found and their disposition

| Surface | Location | Disposition |
| --- | --- | --- |
| First-paint title/favicon | `dev/prod/src/index.ejs` | Changed to Caspel PM + authentic icon (`?v=3`) |
| Runtime title fallback | `dev/prod/src/platform.ts` (`'Platform'`) | Changed to `Caspel PM` |
| Branding map | `dev/prod/public/branding.json`, `dev/branding.json` | Titles + links changed for `huly.local:8080/8087` and `host.docker.internal:8087`; TraceX entries consistent |
| PWA manifest | `dev/prod/public/huly/site.webmanifest` (`name: huly`) | New `dev/prod/public/caspel-pm/site.webmanifest` (`?v=3`); upstream file left in place, unused by Caspel hosts |
| Support/docs/privacy/bug links | `plugins/support/src/index.ts` | Defaults emptied; UI hides empty entries |
| Sign-up URL | `dev/prod/src/platform.ts` (`https://huly.io/signup`) | Default emptied; UI hides action; server-side `DISABLE_SIGNUP=true` |
| Login mark & artwork | `plugins/login-resources` | Huly mark → authentic Caspel geometric mark; wave artwork → navy CSS backdrop; public sign-up route removed |
| Localization values | 155 `*/lang/*.json` files | 271 values changed across 14 languages; `ExportUnifiedFormat` retained |
| Account emails | `server/account/lang/*.json` | Wordmark, body copy, footer, header/button colour changed |
| Email/TOTP/notification product name fallbacks | `server/account`, `server-plugins/notification-resources` | `Huly` → `Caspel PM` |
| Mail-sync footers | `services/mail/pod-mail-worker`, `services/gmail/pod-gmail` | `Sent via Caspel PM` (no link); env override unchanged |
| PDF signature title fallback | `services/sign/pod-sign` | `Caspel PM` |
| Telegram bot app name default | `services/telegram-bot` | `Caspel PM` |
| Social identity provider label | `models/contact` | `Caspel PM` |
| Service root pages | preview, link-preview, backup, datalake | Caspel PM service identity + upstream attribution |
| Link-preview User-Agent / oEmbed name | `pods/link-preview` | `Caspel PM Link Preview Service/1.0` |
| Web-push VAPID subject default | `services/notification/pod-notification` (`mailto:hey@huly.io`) | Removed; `PUSH_SUBJECT` now required for web push |
| GitHub sync backlink text | `services/github/pod-github` (`Huly&reg;`) | **Retained** — protocol-sensitive (E-030) |
| Desktop app identity/update feed | `desktop`, `desktop-package` | **Not changed** — out of scope pending decision (B-008) |

Additional entry points discovered beyond the prompt's map: backup-api and datalake root pages, notification VAPID subject, sign PDF title, telegram-bot `APP`, contact social-identity label, `ReadOnlyNotification` / `AccountPopup` sign-up actions, `Workbench.svelte` sidebar support link (it imported the constant directly, bypassing branding metadata).
