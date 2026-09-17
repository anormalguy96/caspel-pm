# Security review notes

## Changes reviewed

| Change | Security effect |
| --- | --- |
| Support/docs/privacy/bug/sign-up defaults emptied; UI hides empty links | Removes accidental navigation to third-party upstream properties. Support links now pass through `safeExternalLink()` (`plugins/support/src/index.ts`), which only accepts absolute `http(s)` URLs, so a `javascript:`/`data:` value in branding JSON is dropped. Unit test: `plugins/support/src/__tests__/links.test.ts` (**not executed**). `SIGNUP_URL` is not scheme-validated (front config, operator-controlled). `mailto:` support links are intentionally rejected; use an https contact page. |
| Added `rel="noopener noreferrer"` to changed external anchors; docs card opens with `noopener,noreferrer` | Prevents reverse tabnabbing and referrer leakage of workspace URLs |
| Service root pages no longer link out | Minor reduction in outbound links from operator-facing endpoints |
| Link-preview User-Agent renamed | No security effect. Sites that allowlisted the old UA would stop returning previews |
| Web push requires `PUSH_SUBJECT` | Stops advertising an upstream contact to push services; push is disabled until configured |
| Theme token layer, login backdrop, placeholder SVGs | No script or external fetch. SVGs are static with no `<script>` or external refs |
| Locale changes | Text only. Email HTML structure untouched except colour and text nodes. Placeholders verified identical |
| Residual-brand guard + CI workflow | Read-only `contents: read` permission; no secrets; no third-party actions beyond `actions/checkout@v4` and `actions/setup-node@v4` |

Not changed: CSP/CORS headers, OAuth redirect handling, authorization, password strictness, rate limiting, CSRF/state handling.

No secrets were added. The pre-existing dev `config.json` contains an upstream dev GitHub App client ID (`Iv1.43f9cac43bd68617`), which is a public identifier, not a secret (B-014).

## Open security work (not performed)

- Permission matrix and private-space isolation tests: issues, documents, attachment direct URLs, search, mentions, notification previews, email notifications, exports, API, WebSocket, link previews, activity, guest access (B-018).
- Session invalidation for disabled users and SSO offboarding (SSO_INTEGRATION_NOTES.md).
- Runtime egress verification (NETWORK_DESTINATION_AUDIT.md).
- Review of the unexplained `@caspel/platform-rig` change (B-000). A package scope that isn't in the repo could resolve from a public registry during install. **Treat it as a supply-chain risk until explained.**
