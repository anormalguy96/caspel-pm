# Caspel PM fork documentation

Caspel PM is Caspel's product edition of the open-source [Huly Platform](https://github.com/hcengineering/platform) (EPL-2.0).
These documents record what the fork changes, what it deliberately keeps from upstream, and what still needs an owner decision.

Start with:

| Document | Purpose |
| --- | --- |
| [DEEP_IMPLEMENTATION_PLAN.md](DEEP_IMPLEMENTATION_PLAN.md) | Same-day private-repo delivery, runtime/account setup, deep QA and production gates |
| [FINAL_DELIVERY_REPORT.md](FINAL_DELIVERY_REPORT.md) | What was done, how it was verified, what remains |
| [BLOCKERS.md](BLOCKERS.md) | Decisions and inputs required from Caspel before production |
| [CUSTOMIZATION_REGISTER.md](CUSTOMIZATION_REGISTER.md) | Every file the fork changes, grouped by concern |
| [IDENTIFIER_EXCEPTION_REGISTER.md](IDENTIFIER_EXCEPTION_REGISTER.md) | Upstream names intentionally kept, with reasons |
| [UPSTREAM_MERGE_PLAYBOOK.md](UPSTREAM_MERGE_PLAYBOOK.md) | How to take future upstream releases |

Baseline and inventory: [UPSTREAM_BASELINE.md](UPSTREAM_BASELINE.md), [REBRAND_INVENTORY.md](REBRAND_INVENTORY.md), [IDENTIFIER_CLASSIFICATION.md](IDENTIFIER_CLASSIFICATION.md).

Brand and design: [BRAND_DECISIONS.md](BRAND_DECISIONS.md), [BRAND_ASSET_INVENTORY.md](BRAND_ASSET_INVENTORY.md), [VISUAL_QA_MATRIX.md](VISUAL_QA_MATRIX.md), [ACCESSIBILITY_REPORT.md](ACCESSIBILITY_REPORT.md).

Localization: [LOCALIZATION_GLOSSARY.md](LOCALIZATION_GLOSSARY.md), [LOCALIZATION_STATUS.md](LOCALIZATION_STATUS.md).

Verification: [BUILD_REPORT.md](BUILD_REPORT.md), [TEST_REPORT.md](TEST_REPORT.md), [RUNTIME_QA_REPORT.md](RUNTIME_QA_REPORT.md), [OUTBOUND_DEPENDENCY_REGISTER.md](OUTBOUND_DEPENDENCY_REGISTER.md), [WORKSPACE_SEED_SPEC.md](WORKSPACE_SEED_SPEC.md).

Surfaces and operations: [OUTBOUND_LINK_AUDIT.md](OUTBOUND_LINK_AUDIT.md), [NETWORK_DESTINATION_AUDIT.md](NETWORK_DESTINATION_AUDIT.md), [EMAIL_NOTIFICATION_AUDIT.md](EMAIL_NOTIFICATION_AUDIT.md), [PWA_DESKTOP_AUDIT.md](PWA_DESKTOP_AUDIT.md), [DEPLOYMENT_CONFIG_AUDIT.md](DEPLOYMENT_CONFIG_AUDIT.md), [SSO_INTEGRATION_NOTES.md](SSO_INTEGRATION_NOTES.md), [SECURITY_REVIEW_NOTES.md](SECURITY_REVIEW_NOTES.md), [LICENSE_ATTRIBUTION_AUDIT.md](LICENSE_ATTRIBUTION_AUDIT.md), [FUNCTIONAL_QA_MATRIX.md](FUNCTIONAL_QA_MATRIX.md), [ROLLBACK_NOTES.md](ROLLBACK_NOTES.md), [FINAL_RESIDUAL_BRAND_REPORT.md](FINAL_RESIDUAL_BRAND_REPORT.md).

## Residual-brand guard

```sh
node scripts/caspel-pm/check-residual-brand.js
```

Runs in CI via `.github/workflows/caspel-pm-brand-guard.yml`. It fails on new user-facing `Huly` text in locale values, upstream Huly web destinations in runtime source, or a non-Caspel first-paint title/manifest. Add a justified entry to `scripts/caspel-pm/residual-brand-allowlist.json` **and** to the exception register when an occurrence is intentional.
