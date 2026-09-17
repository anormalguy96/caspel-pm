# Deployment configuration audit

Scope: this repository only. The `huly-selfhost` companion repo is not present (B-021).

## Branding wiring

| Service | Variable | Dev compose value | Production requirement |
| --- | --- | --- | --- |
| front | `BRANDING_URL` | `http://huly.local:8087/branding.json` | URL of the Caspel `branding.json` on the public front host (HTTPS) |
| account | `BRANDING_PATH` | `/var/cfg/branding.json` (mounted `dev/branding.json`) | Mount a Caspel backend branding file with matching host keys |
| sign | `BRANDING_PATH` | `services/sign/pod-sign/debug/branding.json` (still titled "Huly", debug file) | Mount the Caspel backend branding file |
| transactor / workspace / others using branding | `BRANDING_PATH` | `dev/branding.json` | Same file |

Branding host keys are `window.location.host` values, **including a non-default port**. A production host such as `pm.example.internal` (placeholder) must be added to both files. Without it:
- The browser title still shows `Caspel PM` (new fallback), but no manifest link is added and support links stay empty.
- Account emails fall back to `PRODUCT_NAME` or `Caspel PM`.

Example production entries (hostname is a placeholder; don't commit a guessed hostname):

```json
// front branding.json
"<public-host>": {
  "title": "Caspel PM",
  "languages": "en,ru",
  "defaultLanguage": "en",
  "links": [
    { "rel": "manifest", "href": "/caspel-pm/site.webmanifest?v=3" },
    { "rel": "icon", "href": "/caspel-pm/favicon.svg?v=3", "type": "image/svg+xml", "sizes": "any" },
    { "rel": "shortcut icon", "href": "/caspel-pm/favicon.ico?v=3", "sizes": "16x16 32x32 48x48" },
    { "rel": "apple-touch-icon", "href": "/caspel-pm/apple-touch-icon.png?v=3" }
  ]
}
// backend branding.json
"<public-host>": { "key": "caspel-pm", "title": "Caspel PM", "protocol": "https", "language": "en" }
```

The backend `key` is stored on workspaces created under that host. Choose it once (E-004).

## Caspel-specific configuration introduced

No new `CASPEL_PM_*` environment variables were introduced. Everything uses existing upstream mechanisms:

| Need | Mechanism |
| --- | --- |
| Support/docs/privacy/bug URLs | branding `support.*` (existing) |
| Sign-up URL | `SIGNUP_URL` front config (existing); empty hides the action |
| Mail footer | `FOOTER_MESSAGE` (existing) |
| Product name in account emails | `PRODUCT_NAME` (existing) or branding title |
| Telegram app name | `APP` (existing) |
| Link-preview UA | `USER_AGENT` (existing) |
| Web push subject | `PUSH_SUBJECT` (existing, now **required** for push) |

## Upstream `HULY*` variables

Kept as upstream compatibility variables (E-006): `HULY_TOKEN_SECRET`, `HULY_REDIS_URLS`, `HULYLAKE_URL`, `HULYLAKE_ENDPOINT`, `HULYLAKE_CONFIG_KIND`, `HULY_DB_CONNECTION`, `HULY_KAFKA_BOOTSTRAP`, `HULY_BIND_PORT`, `HULY_BACKUP_TOKEN`, `HULY_ASSISTANT`, `HULY_ACCOUNT_SERVICE`, `HULY_LOG`, `HULY_RESTORE_EOF`. No aliases were added.

## Production checklist (not executed)

- HTTPS/WSS for `FRONT_URL`, `ACCOUNTS_URL`, `COLLABORATOR_URL`, `FILES_URL`, `PREVIEW_URL`, `PULSE_URL`, all behind one public scheme/host plan.
- `DISABLE_SIGNUP=true` (account service, server-side) if company-only access is required. The UI flag alone is not admission control.
- `PASSWORD_STRICTNESS` not `none` (dev `config.json` uses `none`).
- Secrets (`SERVER_SECRET`, `HULY_TOKEN_SECRET`, OIDC, SMTP, MinIO, CockroachDB) via secret management, never in branding or config JSON.
- CockroachDB TLS, Redpanda non-dev mode, MinIO non-default credentials, minimal exposed ports.
- Build images from this fork. Stock `hardcoreeng/*` images don't contain these changes (B-022). Record image digests.
- Leave `ANALYTICS_COLLECTOR_URL`, `AI_URL`, `LOVE_ENDPOINT`, `GITHUB_*`, `GMAIL_URL`, `CALENDAR_URL`, `TELEGRAM_*`, `BILLING_URL`, `PAYMENT_URL` unset unless approved.
- Never deploy `config-huly.json` or `CLIENT_TYPE=dev-huly`.
