# Identifier classification

Classes follow the master prompt: USER_FACING, OPERATOR_FACING, EXTERNAL_DESTINATION, INTERNAL_IDENTIFIER, LEGAL_ATTRIBUTION, TEST_FIXTURE, DOC_EXAMPLE, GENERATED, DEAD_CODE.

## Families

| Family | Example | Class | Policy applied |
| --- | --- | --- | --- |
| `@hcengineering/*` packages | `import ... from '@hcengineering/core'` | INTERNAL_IDENTIFIER | Keep (E-001) |
| Plugin / model / mixin / space / attribute IDs | `hulyMailId`, `contact.socialIdentityProvider.Huly` | INTERNAL_IDENTIFIER | Keep (E-002) |
| Localization **keys** | `StartUsingHuly`, `ConnectHulyMail` | INTERNAL_IDENTIFIER | Keep; values rebranded |
| Localization **values** | `"Start using Huly"` | USER_FACING | Rebranded |
| Persisted enums | `SocialIdType.HULY` → `'huly'`, `'huly-assistant'` in account DB migrations | INTERNAL_IDENTIFIER (persisted) | Keep; never rewrite migrations (E-003) |
| Branding keys | `dev/branding.json` `key: huly`, `huly-dev`; `brandingKey ?? 'huly'` | INTERNAL_IDENTIFIER (stored on workspace records) | Keep (E-004) |
| Service ids / topics | `huly-mail`, `hulygram`, `hulygun` | INTERNAL_IDENTIFIER (service auth allowlists, Kafka topics) | Keep (E-005) |
| Env vars | `HULY_TOKEN_SECRET`, `HULY_REDIS_URLS`, `HULYLAKE_URL`, `HULY_DB_CONNECTION`, … | INTERNAL_IDENTIFIER / OPERATOR_FACING | Keep (E-006) |
| Mail headers | `Huly-Sent`, `Huly-Message-Id`, `Huly-Message-Type` | INTERNAL_IDENTIFIER (thread/loop detection) | Keep (E-007) |
| MIME types | `application/vnd.huly.applet.*` | INTERNAL_IDENTIFIER (persisted in messages) | Keep (E-008) |
| CSS custom property | `--huly-top-indent` | INTERNAL_IDENTIFIER | Keep |
| Subsystem names | HulyPulse, hulylake, hulykvs, hulygun | OPERATOR_FACING / INTERNAL | Keep (E-009) |
| Export format label | `ExportUnifiedFormat` → "Huly Unified Format" | USER_FACING but interoperability name | Keep, reviewed (E-010) |
| Product title fallbacks | `?? 'Huly'` in account/notification/sign/telegram | USER_FACING | Rebranded |
| Upstream web destinations | `huly.io`, `docs.huly.io`, `link.huly.io`, `v1.huly.io` in support defaults | EXTERNAL_DESTINATION | Removed / configurable |
| `dist.huly.io` update feed | `desktop`, `desktop-package`, `dev/local-mongo` compose | EXTERNAL_DESTINATION | Unchanged: desktop out of scope (B-008) |
| `config-huly.json`, webpack `dev-huly` proxy | `https://*.huly.app` | OPERATOR_FACING dev config | Keep, allowlisted (E-020, E-021) |
| `huly.local` dev hostnames | README, compose, branding host keys | DOC_EXAMPLE / OPERATOR_FACING | Keep (E-011) |
| Copyright headers | `Hardcore Engineering Inc.`, `Huly Platform Contributors`, `Huly Labs` | LEGAL_ATTRIBUTION | Keep unchanged (E-012) |
| GitHub backlink marker | `Huly&reg;:` posted to/parsed from GitHub comments | INTERNAL_IDENTIFIER (sync detection) | Keep (E-030) |
| Upstream README / ARCHITECTURE_OVERVIEW / changelog | top-level docs | DOC_EXAMPLE | Keep; fork notice added to README |
| Test fixtures | `tests/`, `ws-tests/`, `qms-tests/`, `desktop/src/__test__` | TEST_FIXTURE | Keep except gmail footer fixtures, which track the changed default |

## Uncertain items needing review

| Item | Why uncertain | Current state |
| --- | --- | --- |
| `GooglePrivacy` strings (calendar, gmail) | Legal disclosure tied to the Google OAuth app identity | Rebranded to Caspel PM; needs legal review and a Caspel-owned Google app (B-012) |
| Email footer `&copy; Caspel PM — All rights reserved` | Copyright statement in email template | Rebranded; needs legal review (B-012) |
| `models/contact` social-identity label | Model doc label; changes model hash on upgrade (no ID change) | Rebranded; verify via workspace upgrade on staging |
| `huly-mail` integration display ("Caspel PM Mail") | Feature is upstream's built-in mail service | Display rebranded; whether to ship it is B-015 |
