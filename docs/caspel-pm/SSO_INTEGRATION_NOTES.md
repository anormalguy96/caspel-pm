# SSO / OIDC integration notes

No SSO configuration was added. Caspel's public SSO product does not establish an issuer for this deployment, so compatibility is a hypothesis until it's tested (B-010).

## Existing upstream mechanism (`pods/authProviders/src/openid.ts`)

| Variable | Purpose |
| --- | --- |
| `OPENID_ISSUER` | Discovery base; must come from an approved IdP discovery document |
| `OPENID_CLIENT_ID` | Client registration |
| `OPENID_CLIENT_SECRET` | Secret manager only |
| `OPENID_DISPLAY_NAME` | Login button label. Set to the approved provider name; don't invent one |

- Redirect URI: `<ACCOUNTS_URL>/auth/openid/callback` (single, exact; no wildcards).
- `state` carries the branding key (`encodeState(ctx, brandings)`) and is parsed on callback. The account service must receive `BRANDING_PATH` so the callback resolves Caspel branding.
- Identity: social id `SocialIdType.OIDC` with value `sub` (stable). Email is used only when `email_verified` is true. Name comes from `given_name`/`family_name` or `name`.
- `HIDE_LOCAL_LOGIN` hides the form only. `DISABLE_SIGNUP=true` in the account service is the server-side switch (`server/account-service/src/index.ts`).

## Decisions required before enabling

Issuer and discovery URL; client registration; claim mapping (confirm `sub` stability and `email_verified`); who may create workspaces; guest policy; offboarding and disabled-account behaviour (does IdP disablement revoke existing sessions or tokens?); emergency local-admin recovery path; post-logout redirect.

## Tests to run on staging

Expired access token, expired refresh, revoked user, changed email, duplicate identity mapping (existing email/password account + OIDC), state tampering, callback behind reverse proxy (correct external `ACCOUNTS_URL`), unknown host branding, SSO-only mode with local login hidden **and** sign-up disabled server-side.
