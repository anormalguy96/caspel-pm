# Outbound dependency register

Scope: every automatic or user-triggered outbound destination affected by, or relevant to, the Caspel PM web edition.

Evidence levels:
- **STATIC**: source review, 2026-09-16.
- **RUNTIME**: observed on the local stack (see "Runtime observations" at the end).

A hidden UI link does not mean an integration is disabled. The "Enabled by default" column reflects what the code does when its config is unset.

| # | Feature | Config field(s) | Default when unset | Enabled by default? | Sends company/user data? | Caspel replacement needed? | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Support, report bug, docs, privacy links | branding `support.supportLink/reportBugLink/docsLink/privacyPolicyLink` | `''`: entry hidden; only http(s) accepted (`plugins/support/src/index.ts`) | No | No (navigation only) | Yes, approved URLs (B-007) | Fixed in fork |
| 2 | Backup restore guide | branding `support.backupRestoreGuideLink` → `setting.metadata.BackupRestoreGuideUrl` | `''`: UI action hidden; RESTORE.md cites upstream guide, labelled as upstream technical documentation | No | No | Yes, a Caspel restore guide | Fixed in fork |
| 3 | Sign-up link (read-only guests) | front `SIGNUP_URL` | web `''`: hidden. Desktop: `https://huly.io/signup` | Web: no. Desktop: link only | No | Only if public sign-up exists | Web fixed; desktop out of scope |
| 4 | GitHub login | `GITHUB_CLIENT_ID/SECRET/DISPLAY_NAME` (account) | Strategy not registered | No | Yes, to github.com when used | Caspel OAuth app | Not configured |
| 5 | GitHub integration | front `GITHUB_URL/GITHUB_APP/GITHUB_CLIENTID`; pod-github `APP_ID`, `CLIENT_ID/SECRET`, `PRIVATE_KEY`, `WEBHOOK_SECRET` (default `secret`), `BOT_NAME` (default `ao-huly-dev[bot]`) | Front unset. Dev `config.json` points at upstream dev app `uberflow-dev` | Only when pod-github is deployed | Yes: issues/PRs synced with github.com; posts `Huly®:` backlink comments | Caspel GitHub App + `LINK_TEXT`; review hardcoded backlink (E-030) | Not approved (B-014) |
| 6 | GitHub link presenter | none (hardcoded `api.github.com`) | Registered in model; renderer not found | Unverified | Linked repo path + client IP | Decide | Needs review |
| 7 | Google login | `GOOGLE_CLIENT_ID/SECRET/DISPLAY_NAME` | Not registered | No | Yes, when used | Caspel Google app | Not configured |
| 8 | Gmail sync | front `GMAIL_URL`; pod-gmail credentials | Front `http://localhost:8087`; pod not deployed | Only if deployed | Yes: mailbox content via googleapis.com (`gmail.modify`) | Caspel Google app + legal review of `GooglePrivacy` text (B-012) | Not approved |
| 9 | Google Calendar / CalDAV | `CALENDAR_URL`, `PUBLIC_SCHEDULE_URL`, `CALDAV_SERVER_URL`; pod-calendar credentials | Front `http://localhost:8095` | Only if deployed | Yes: calendar data via googleapis.com | Caspel Google app | Not approved |
| 10 | Telegram user sync | `TELEGRAM_URL`; `TelegramApiID/Hash` | Front `http://localhost:8086` | Only if deployed | Yes: Telegram MTProto | Caspel Telegram app | Not approved |
| 11 | Telegram bot | `TELEGRAM_BOT_URL`; `BOT_TOKEN`, `DOMAIN`, `APP` | Front `http://huly.local:4020` (dev hostname, E-011); `APP` → `Caspel PM` | Only if deployed | Yes: Telegram Bot API | Caspel bot token | Not approved |
| 12 | AI bot (chat, summary, translation) | front `AI_URL`; `OPENAI_API_KEY`, `OPENAI_BASE_URL`, `OPENAI_MODEL` | Front unset; empty key disables client; base URL defaults to api.openai.com | No | Yes: messages/documents to OpenAI or proxy | AI policy decision (B-013) | Disabled |
| 13 | AI PDF conversion | `DATALAB_API_KEY` | `''`: skipped (`www.datalab.to`) | No | Yes: PDF files | AI policy | Disabled |
| 14 | Meeting transcription (love-agent) | `STT_PROVIDER` (deepgram), `DEEPGRAM_API_KEY`, `OPENAI_API_KEY` | Keys empty. The OpenAI path hardcodes `wss://api.openai.com` and ignores `OPENAI_BASE_URL` | Only if deployed | Yes: meeting audio | AI policy; note that it can't be proxied | Disabled |
| 15 | Translate service | `OPENAI_API_KEY/BASE_URL/MODEL` | Key unset | Only if deployed | Yes: text | AI policy | Disabled |
| 16 | Frontend analytics + error capture | `ANALYTICS_COLLECTOR_URL` | Unset: provider init returns false | No | When set: events, user email, window errors | Caspel-owned collector or leave off | Disabled |
| 17 | Analytics collector → PostHog | `POSTHOG_HOST`, `POSTHOG_API_KEY` | Unset: OTLP fallback | No | Yes: user events | Policy | Disabled |
| 18 | Backend telemetry (OTLP) | `OTEL_EXPORTER_OTLP_*` | Unset: not sent. **Dev compose sets `http://jaeger:4318` (local container)** | No (prod) | Traces/logs | Caspel observability stack | Disabled in prod config |
| 19 | Sentry / Amplitude / Intercom / Segment / Mixpanel / Google Fonts / CDN | none | Not present in runtime source | No | No | No | n/a |
| 20 | Link preview | front `LINK_PREVIEW_URL`; pod `USER_AGENT`, `TIMEOUT` | Web unset: disabled. UA `Caspel PM Link Preview Service/1.0` | Web: no | Server fetches any URL users post (SSRF blocklist present) | Egress policy | Disabled unless configured |
| 21 | Calls (LiveKit) | `LOVE_ENDPOINT`, `LIVEKIT_WS`; love `LIVEKIT_HOST`, keys | Unset | No | Audio/video to configured LiveKit | Self-hosted LiveKit or off | Disabled |
| 22 | LiveKit Cloud billing poll | `BILLING_URL`, `LIVEKIT_PROJECT` | Empty: skipped (`cloud-api.livekit.io`) | No | Usage data | No | Disabled |
| 23 | Mail (SMTP/SES) | front `MAIL_URL`; pod-mail `SMTP_*` or `SES_*` | Pod refuses to start without exactly one transport; no built-in host | Only if deployed | Yes: email content | Approved SMTP identity (B-011) | Not configured |
| 24 | Desktop auto-update | `DESKTOP_UPDATES_URL`, channel | Desktop code default `https://dist.huly.io`, channel `huly`. Dev compose value now empty | Desktop: yes | Version check + binary download | Caspel signed feed if desktop ships | Desktop out of first-release scope (B-008) |
| 25 | Desktop default server | `FRONT_URL` / packed `server` | `https://huly.app` | Desktop: yes, when unpacked | All data | Caspel host | Out of scope |
| 26 | Web push | `PUSH_PUBLIC_KEY`, `PUSH_PRIVATE_KEY`, `PUSH_SUBJECT` | Not set up; fork also requires `PUSH_SUBJECT` | No | Notification payloads through browser vendor push services (FCM/Mozilla/Apple), inherent to Web Push | Operator contact for `PUSH_SUBJECT` | Disabled |
| 27 | OIDC login | `OPENID_CLIENT_ID/SECRET/ISSUER/DISPLAY_NAME` | Not registered | No | To configured issuer | Approved IdP (B-010) | Not configured |
| 28 | Billing / payment | `BILLING_URL`, `PAYMENT_URL`; Polar/Stripe keys | `''`: billing plugin not loaded | No | Customer data to Polar/Stripe | Not planned | Disabled |
| 29 | **Gravatar** | none (hardcoded `https://gravatar.com/avatar/<md5(email)>`) | Probed when the avatar picker opens; rendered for gravatar avatars | **Yes, user-triggered** | Hashed email + client IP | Privacy decision: keep, or remove the option | **Needs decision (B-024)** |
| 30 | YouTube embeds / oEmbed | none | Only when a user embeds a YouTube link | User-triggered | Pasted URL + client IP | Policy | Accepted as user action |
| 31 | Icon fallback `https://anticrm.org/logo.svg` | none | Previously requested when an icon asset had no metadata | Previously automatic (edge case) | Client IP, referrer | — | **Removed in fork** (`packages/ui/.../Icon.svelte`, `text-editor-resources/.../reference.ts`) |
| 32 | Branding fetch | front `BRANDING_URL`, backend `BRANDING_PATH` | Unset: no fetch; title falls back to `Caspel PM` | No | No | Caspel branding host entries (B-006) | Dev configured |
| 33 | Workspace seed content | `INIT_REPO_DIR`, `INIT_WORKSPACE`, branding `initWorkspace` | Fork: no seeding unless a script is named | No | No | Caspel starter set included (opt-in) | Fixed in fork |
| 34 | Build/deploy pulls | Dockerfiles `hardcoreeng/base*`, `pods/external` `hardcoreeng/service_*`, upstream CI `github.com/hcengineering/init` | — | Build time | Source/images only | Caspel registry mirror (B-022) | Open |

## Runtime observations

See "Runtime network audit" in [RUNTIME_QA_REPORT.md](RUNTIME_QA_REPORT.md).
