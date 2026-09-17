# Upstream merge playbook

## One-time setup

```sh
git remote add upstream https://github.com/hcengineering/platform.git
git fetch upstream --tags
```

Record the chosen base tag/commit in `UPSTREAM_BASELINE.md`. Prefer production `v*` tags over `develop` (B-001).

## Each upstream release

1. `git checkout -b upgrade/<tag> develop`
2. `git merge <tag>` (don't rebase published history; don't rewrite history for branding)
3. Resolve conflicts using `CUSTOMIZATION_REGISTER.md`. Expected hotspots:
   - `plugins/*-assets/lang/*.json` and `server/account/lang/*.json`: take upstream, then re-apply the locale rebrand (below).
   - `plugins/workbench-resources/src/components/{Workbench,HelpAndSupport,AccountPopup}.svelte`, `plugins/login-resources/src/components/LoginApp.svelte`: keep the Caspel conditional-link and backdrop hunks.
   - `plugins/support/src/index.ts`: keep empty defaults and `safeExternalLink`.
   - `dev/prod/public/branding.json`, `dev/prod/src/index.ejs`.
4. Re-apply locale rebrand to newly added strings. Upstream adds new `Huly` strings regularly. The guard lists them:
   ```sh
   node scripts/caspel-pm/check-residual-brand.js
   ```
   Fix each value by hand following `LOCALIZATION_GLOSSARY.md`. Don't bulk-replace keys.
5. Review upstream migrations (`server/account/src/collections/postgres/migrations.ts`, `models/*/src/migration.ts`) before deploying.
6. Check upstream for new outbound defaults, e.g. `git diff <old>..<new> -- '*.ts' | grep -E 'https?://'`, and update `NETWORK_DESTINATION_AUDIT.md`.
7. Build, test, run the QA matrices on staging with restored representative data.
8. Keep the previous known-good images and a data recovery point until the upgrade is accepted.

## Keeping merges small

- New Caspel files live in dedicated paths: `docs/caspel-pm/`, `scripts/caspel-pm/`, `dev/prod/public/caspel-pm/`, `packages/theme/styles/_caspel-pm.scss`.
- Upstream assets (`dev/prod/public/huly/`, login images) are left in place rather than deleted.
- Theme overrides are one `@use` line in `global.scss` plus one Caspel file.
- Suggested commit families: (1) docs and inventory, (2) branding config + PWA assets + first paint, (3) theme tokens, (4) login and shell, (5) locale values, (6) support/outbound links + mail footers + service pages, (7) brand guard + CI.
