# Outbound link audit

User-clickable or user-visible external destinations.

| Link | Where | Before | After |
| --- | --- | --- | --- |
| Contact us (sidebar) | `Workbench.svelte` | `https://link.huly.io/slack` (hardcoded constant, ignored branding) | Branding `support.supportLink`; hidden when empty |
| Contact us (help popup) | `HelpAndSupport.svelte` | Same Slack link | Same as above |
| Report a bug | `HelpAndSupport.svelte` | `github.com/hcengineering/platform/issues/new` | `support.reportBugLink`; hidden when empty |
| Documentation card | `HelpAndSupport.svelte` | `http://docs.huly.io/` | `support.docsLink`; card hidden when empty |
| Privacy policy | `HelpAndSupport.svelte` | `https://v1.huly.io/legal/privacy/` | `support.privacyPolicyLink`; hidden when empty |
| Sign up (read-only guest) | `ReadOnlyNotification.svelte`, `AccountPopup.svelte` | `https://huly.io/signup` | `SIGNUP_URL` config; hidden when empty |
| Mail-sync footer | mail worker, gmail | `<a href="https://huly.io">Huly</a>` | Plain text `Sent via Caspel PM` (`FOOTER_MESSAGE` overrides) |
| Service root pages | preview, link-preview, backup, datalake | Links to `huly.io`, `hulylabs.com` | No links; text attribution only |
| Notification email "View in {app}" | `server-plugins/notification-resources` | Link to workspace (FRONT_URL); app name fallback `Huly` | App name fallback `Caspel PM`; link unchanged (deployment host) |
| Google API policy link | `GooglePrivacy` strings | `developers.google.com` policy | Unchanged (correct third-party destination) |
| GitHub backlink comments | `pod-github` | Link to workspace object, text `Huly®:` | Unchanged (E-030); set `LINK_TEXT` env to change new comments |
| Backup restore guide (Settings → Backup, admins) | `plugins/setting-resources/src/utils/backup.ts` | Upstream GitHub guide | Unchanged, exception E-024: publish a Caspel copy and repoint |
| Desktop: signup, update feed | `desktop/src/ui/platform.ts`, `desktop/src/main/start.ts` | `huly.io/signup`, `dist.huly.io` | Unchanged; desktop out of scope (B-008) |

Rel attributes: new/changed anchors use `rel="noopener noreferrer"`, and the docs card opens with `noopener,noreferrer`.

## Configuring destinations

Per host in `branding.json` (served at `BRANDING_URL`):

```json
"pm.example.internal": {
  "title": "Caspel PM",
  "support": {
    "supportLink": "https://<approved>",
    "reportBugLink": "https://<approved>",
    "docsLink": "https://<approved>",
    "privacyPolicyLink": "https://<approved>"
  }
}
```

Values must be approved by their owners (B-007). Don't substitute the company homepage for a privacy policy.

## Verification

`node scripts/caspel-pm/check-residual-brand.js` fails on any `huly.io`, `huly.app`, `hulylabs.com`, `hardcoreeng.com` or `github.com/hcengineering/` URL in non-test runtime source outside the allowlist. Result on 2026-09-16: 0 findings. Browser network inspection of a running instance was **not** performed.
