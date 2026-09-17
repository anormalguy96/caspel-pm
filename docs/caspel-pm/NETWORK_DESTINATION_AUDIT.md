# Network destination audit

Static review of configuration-driven outbound destinations. A config option existing doesn't prove traffic. **No runtime network capture was performed** (no running instance; see B-002).

| Destination | Config | Default when unset | Data class | Required? | Caspel production recommendation |
| --- | --- | --- | --- | --- | --- |
| Branding JSON | `BRANDING_URL` (front), `BRANDING_PATH` (account, sign) | No branding: title falls back to `Caspel PM`, no manifest | Public config | Yes | Serve a Caspel `branding.json` from the front service; set both variables |
| Analytics collector | `ANALYTICS_COLLECTOR_URL` | Disabled | Usage events | No | Leave unset unless approved (B-013) |
| Analytics providers | `@hcengineering/analytics-providers` (`configure.ts`); in this tree the only provider is the collector above | Collector returns early when `ANALYTICS_COLLECTOR_URL` is null/empty | Usage events (includes email when authenticated) | No | Leave unset; re-check after each upstream merge in case new providers are added |
| AI bot / assistant | `AI_URL`, `HULY_ASSISTANT` | Disabled | Company content | No | Do not enable without AI policy (B-013) |
| LiveKit calls | `LOVE_ENDPOINT`, `LIVEKIT_WS` | Disabled | Audio/video | No | Self-host or leave unset |
| GitHub integration | `GITHUB_URL`, `GITHUB_APP`, `GITHUB_CLIENTID` | Disabled | Code/issue metadata | No | Caspel-owned GitHub App only (B-014) |
| Gmail / Google Calendar | `GMAIL_URL`, `CALENDAR_URL` | Disabled | Email, calendar | No | Caspel-owned Google OAuth app; legal review of GooglePrivacy text (B-012) |
| Telegram | `TELEGRAM_URL`, `TELEGRAM_BOT_URL` | Disabled | Messages | No | Caspel-owned bot token |
| Link preview fetches | `LINK_PREVIEW_URL` | Disabled | URLs posted by users, fetched server-side | No | Consider egress restrictions; UA now `Caspel PM Link Preview Service/1.0` |
| Web push (VAPID) | `PUSH_PUBLIC_KEY`, `PUSH_PRIVATE_KEY`, `PUSH_SUBJECT` | Disabled; now also disabled when `PUSH_SUBJECT` is missing | Notification payload to browser push services | No | Set `PUSH_SUBJECT` to an approved operator contact |
| Mail / SMTP | `MAIL_URL` (+ mail service SMTP config) | Disabled | Email | Yes, for invites/OTP | Approved SMTP identity (B-011) |
| Desktop updates | `DESKTOP_UPDATES_URL` | `https://dist.huly.io` in desktop main | Binary downloads | Desktop only | Must not remain upstream if desktop ships (B-008) |
| Billing / payment | `BILLING_URL`, `PAYMENT_URL` | Disabled | Billing | No | Leave unset |
| Fonts | Bundled in `packages/theme/fonts` | No external font CDN found in `dev/prod/src`, `packages/theme` or plugin Svelte | — | — | OK |
| Build-time registries | npm, GitHub Packages (`@hcengineering` scope) | — | Source dependencies | Build | Mirror via Caspel-controlled proxy if policy requires |
| Container images | `hardcoreeng/*` in compose | — | Images | Deploy | Build and publish Caspel fork images to a Caspel registry (B-022) |

Developer-only upstream hosted config: `dev/prod/public/config-huly.json` (`*.huly.app`). It is only selected by `CLIENT_TYPE=dev-huly`. Never deploy it.
