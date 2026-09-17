# Email and notification audit

## Account-service emails (`server/account/lang/*.json`, 13 languages)

| Template | Subject | Body identity before | After |
| --- | --- | --- | --- |
| Confirmation | "Confirm your email address to sign up for {name}" (`{name}` = branding title or `PRODUCT_NAME`) | HTML wordmark "Huly", footer "© Huly — All rights reserved" | Wordmark/footer "Caspel PM" |
| Recovery | "Password recovery" | Same wordmark/footer | Caspel PM |
| Invite (text + HTML) | "Invitation to {ws}" | "…join the {ws} workspace on Huly" | "…on Caspel PM" |
| Resend invite (text + HTML) | "Re-invitation to {ws}" | "…workspace on Huly has been renewed" | "…on Caspel PM…" |
| OTP | "{app} confirmation code: {code}" | wordmark/footer | Caspel PM |
| Password setup | "Set a password for your Huly account" | wordmark/footer | "…your Caspel PM account" |

- Header band and primary button background: `#18181B` → Caspel navy `#0A2A3D` (white text 14.9:1). Body text colours unchanged.
- Text and HTML variants were changed by the same rule; the invite text/HTML pairs now agree.
- No logo image in emails (text wordmark), so there's no remote image fetch and no dark-mode logo issue yet.
- **Product name source:** `branding.title` → `PRODUCT_NAME` env → fallback `Caspel PM` (was `Huly`, only in the TOTP path). Set `BRANDING_PATH` for the account service so `{name}` and `{app}` resolve per host.
- Legal: the footer's "All rights reserved" wording needs legal confirmation (B-012).

## Notification emails (`server-plugins/notification-resources`)

- "View in {app}" link text: `{app}` = branding title, fallback now `Caspel PM`.
- Links use the workspace front URL from deployment config. No Huly domain is hardcoded.

## TOTP (2FA) issuer

`getTotpUrl(email, app, secret)`: the authenticator app label is the branding title, then `PRODUCT_NAME`, then `Caspel PM`. **Existing** authenticator entries enrolled under "Huly" keep their old label (cosmetic only; codes still work).

## Mail sync (Caspel PM Mail worker, Gmail)

- Default footer: `<br><br><p>Sent via Caspel PM</p>`, overridable with `FOOTER_MESSAGE` (mail worker) or the gmail footer env mapping.
- Gmail unit tests and mock updated to match (`services/gmail/pod-gmail/src/__tests__/config.test.ts`, `attachments.test.ts`, `__mocks__/config.ts`). **Not executed.**
- Threading/provider headers `Huly-Sent`, `Huly-Message-Id`, `Huly-Message-Type` retained (E-007). They're invisible to recipients in normal clients but visible in raw headers.

## Telegram bot

`APP` env default `Caspel PM`. It's used in bot description and command texts. Existing registered bot descriptions update on the next bot start.

## Web / desktop push

- Web push requires `PUSH_SUBJECT` (B-016).
- Push notification title/icon come from the browser/PWA identity (manifest + favicon, now Caspel PM provisional).
- Desktop notifications: desktop out of scope (B-008).

## Not verified

Actual email rendering in clients, SMTP sender/reply-to identity (deployment-configured), link host correctness under HTTPS, and localized rendering in each language.
