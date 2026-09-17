# Caspel PM deep implementation and delivery plan

**Prepared:** 2026-09-17  
**Target:** same-day, testable web-edition delivery candidate  
**Production status:** blocked until the production gates in this document are closed

## 1. Outcome and delivery contract

This plan converts the current uncommitted Caspel PM working tree into a reproducible, reviewable and testable delivery. It covers the requested outcomes explicitly:

| Request | Evidence required at handoff |
| --- | --- |
| Deliver by evening | A frozen release-candidate commit, tag, handoff report and known-issues list before the cutoff |
| Push the work | The pushed branch/tag and their immutable commit SHA |
| Use a private repository | GitHub visibility verified as `PRIVATE` before the first push; collaborator access checked |
| Run it | A locally started Caspel PM web stack, health evidence, logs and the exact startup runbook |
| Create an account | A dedicated QA owner account and workspace created locally; credentials shared outside Git |
| Make it testable | URL, role-based test users, seeded test data and a short tester runbook |
| Test it well first | Static, unit, integration, browser, permission, accessibility and operational evidence attached to the handoff |

There are two independent release gates:

1. **Same-day delivery candidate:** suitable for code review and local/staging evaluation. This is achievable without inventing production configuration.
2. **Production release:** requires Caspel-owned hostnames, URLs, secrets, infrastructure, legal decisions, permission-isolation evidence and a restore rehearsal. It must not be represented as complete while those inputs are missing.

## 2. Current repository state

The implementation must start from the actual state below, not from a clean upstream assumption.

- Base: `develop` at `63e28dc96483967b2fc21c881b3f1023c1de7718` (`s0.7.327-474`).
- Remote: `origin https://github.com/anormalguy96/caspel-pm.git`.
- Remote visibility has **not** been verified from local Git configuration. A GitHub HTTPS URL does not prove that the repository is private.
- The working tree contains a large, uncommitted Caspel PM conversion: 198 tracked files changed plus untracked code, assets, tests and documentation.
- The web-edition rebrand, authentic logo assets, public-signup disablement, guest-login repair, appearance settings, Gravatar removal, optional workspace seed and residual-brand guard are already implemented.
- Previous reports record successful build/type-check and broad unit/runtime QA. Those are historical evidence, not a substitute for a fresh release-candidate CI run.
- `git diff --check` currently reports no whitespace errors; it does report line-ending conversion warnings on several files.
- `AGENTS.md`, `CASPEL_PM_MASTER_AGENT_PROMPT.md`, `output.txt` and preview/generated artifacts require explicit staging decisions. They must not enter a product commit by accident.
- `pods/fulltext/tsconfig.json` is owner-controlled and must remain unchanged unless the owner explicitly authorizes a change.
- `dev/docker-compose.yaml` still references `minio/minio`, which is recorded as no longer pullable in the current environment. The local runtime used an uncommitted override to `quay.io/minio/minio`.
- The fork-specific documentation is useful but internally stale in places. For example, some documents still say the logo is provisional or runtime tests were not executed, while later reports record authentic assets and runtime verification.

## 3. Scope for this delivery

### Included in the same-day candidate

- Existing Caspel PM web rebrand and visual system.
- Login, local account, read-only guest and workspace flows.
- Public sign-up disabled in UI and enforced on the account service.
- Appearance preferences and accessibility-sensitive motion/theme behavior.
- PWA title, icons and manifest.
- Core Projects/Tracker, issue, document, inbox, settings and attachment smoke flows.
- Opt-in Caspel starter workspace.
- Local Docker-based evaluation environment.
- Automated brand guard and release-candidate CI evidence.
- Private Git repository delivery with a clean commit series and handoff documentation.

### Excluded from same-day production claims

- Desktop distribution and desktop updater rebrand.
- Production OIDC/SSO without approved issuer/client/claims.
- Google, GitHub, Telegram, AI, analytics, billing or LiveKit integrations without Caspel-owned configuration and policy approval.
- Azerbaijani locale until all keys are translated and approved.
- Production SMTP/push identity without approved sender/contact details.
- Production deployment before permission isolation and backup restore gates pass.

## 4. Critical path and execution order

### Phase 0 — Freeze and protect the current worktree

**Goal:** prevent accidental loss or inclusion of unrelated/user-owned changes.

1. Record `git status --short`, base SHA, branch, remotes and submodule state in the delivery report.
2. Create a release working branch such as `delivery/caspel-pm-web-rc1` without discarding the dirty worktree.
3. Build a staging manifest that classifies every changed/untracked path as one of:
   - product change;
   - test/CI change;
   - source brand asset;
   - generated production asset;
   - documentation;
   - owner-only instruction;
   - local scratch/generated output.
4. Explicitly exclude owner-only and scratch content from product commits. In particular, do not stage `output.txt` or personal prompt/instruction files merely because `git add -A` is convenient.
5. Preserve `pods/fulltext/tsconfig.json` byte-for-byte and report it as an owner-owned change.
6. Resolve line-ending policy before staging. Do not let Git convert a broad set of files as a side effect of the release commit.

**Exit gate:** every dirty path is classified, no file is deleted, and the intended release set can be reproduced from the manifest.

### Phase 1 — Close delivery-candidate implementation gaps

**Goal:** make local startup deterministic and the candidate internally consistent.

1. Make the MinIO image source deterministic:
   - prefer an environment-overridable image with a pinned, approved tag/digest;
   - use the working Quay source for local development only after verifying the exact tag;
   - do not silently substitute a floating image in production.
2. Confirm both branding sources remain aligned:
   - frontend `dev/prod/public/branding.json`;
   - backend `dev/branding.json` mounted through `BRANDING_PATH`.
3. Keep local host keys (`huly.local:*`) for development compatibility, but do not mistake them for production host configuration.
4. Confirm local admission policy:
   - `DISABLE_SIGNUP=true` in the normal stack;
   - sign-up route redirects to login;
   - account API rejects password and OTP registrations when disabled;
   - guest auto-provisioning remains restricted to `ReadOnlyGuest`.
5. Review the complete release diff for secrets, real credentials, local absolute paths, debug output and accidental generated files.
6. Reconcile stale fork documentation against the current code and latest QA reports:
   - authentic logo and `?v=3`, not provisional `?v=1`;
   - runtime network capture was performed;
   - tests that were executed must not remain labelled “not executed”;
   - unresolved checks must remain visibly unresolved;
   - production readiness must remain “not ready”.

**Exit gate:** local compose has no undocumented override required for the core stack, configuration/documentation agree with the code, and the diff contains no secret or scratch data.

### Phase 2 — Create a reproducible local runtime

**Goal:** satisfy “run it yourself” with repeatable evidence.

#### Environment

- Node version: repository-pinned Node 22 (`.nvmrc`).
- Rush/pnpm: invoke the repository-pinned wrappers under `common/scripts`; do not depend on a developer’s global versions.
- Runtime: Docker Desktop/Compose with enough disk and memory for the selected profile.
- Host mapping: `127.0.0.1 huly.local` and `::1 huly.local`.
- Secrets and test credentials: local ignored environment/secret store only.

#### Startup sequence

1. Install from the unchanged lockfile using the pinned Rush wrapper.
2. Build/package the Caspel-modified frontend and required backend services on a POSIX-capable environment. Linux CI is the source of truth because the package/docker phases contain POSIX shell commands.
3. Build fork images for the minimum evaluation services: front, account, transactor, workspace, collaborator, datalake and rekoni, plus the required storage/message/database infrastructure.
4. Start the min profile with the deterministic MinIO source.
5. Wait on service readiness, not fixed sleeps. At minimum verify:
   - front and branding/config JSON return 200;
   - account endpoint is reachable;
   - workspace creation completes;
   - WebSocket connection is established or any deliberately excluded optional service is documented;
   - all `/caspel-pm/*` PWA assets return the expected content type.
6. Capture compose service state and sanitized logs. Fail the run for crash loops, unclassified exceptions, migration errors or external upstream-domain calls.

**Exit gate:** a clean browser session can reach the Caspel PM login page and create/open a workspace using only documented steps.

### Phase 3 — Provision test accounts and fixtures

**Goal:** make the delivery independently testable without reopening public registration.

Create four identities in a disposable local/staging environment:

| Identity | Purpose | Expected access |
| --- | --- | --- |
| `qa.owner` | Administration and setup | Workspace owner |
| `qa.member` | Normal workflows | Standard member |
| `qa.guest` | Guest/RBAC checks | Read-only guest only |
| `qa.outsider` | Isolation tests | No workspace access |

Account provisioning procedure:

1. Keep public sign-up disabled in the normal configuration.
2. For local bootstrap only, use an isolated override that temporarily enables sign-up, create the owner account and workspace, then remove the override and recreate the account service with `DISABLE_SIGNUP=true`.
3. Create member/guest access through the product’s supported invitation/admission path. Do not seed passwords in source or compose files.
4. Store credentials in a secure handoff channel, never in Git, logs, screenshots or Markdown.
5. Create deterministic fixtures:
   - one public and one private project;
   - issues in multiple statuses, including comments, mention and attachment;
   - public and private teamspaces/documents;
   - a member-only attachment with a direct URL recorded for negative access tests;
   - optional Caspel starter workspace for seed verification.
6. After provisioning, verify direct registration is rejected again at both UI and API levels.

**Exit gate:** owner/member/guest/outsider logins behave as designed and a tester can use the workspace without modifying configuration.

### Phase 4 — Verification pyramid

Tests run against the exact commit that will be tagged and pushed. If a fix is made, rerun the affected layer and every downstream release gate.

#### 4.1 Static and repository integrity

- `git diff --check` with no errors.
- Residual-brand guard with zero unclassified findings.
- JSON/YAML/manifest parsing for changed config and seed files.
- Locale key and placeholder parity.
- Secret scan of staged content and commit history being introduced.
- Generated asset dimensions, alpha channel, MIME type and favicon/manifest linkage.
- Staged-file manifest reviewed against `CUSTOMIZATION_REGISTER.md`.

#### 4.2 Targeted unit/component tests

Rerun tests for every changed package, with special attention to:

- account registration disablement and guest auto-provisioning;
- support-link scheme validation;
- backup guide URL selection;
- init-script explicit selection;
- locale parity;
- Gmail/mail footer configuration;
- notification push subject behavior;
- link-preview and preview identity changes;
- theme/appearance persistence and system preference listeners.

No failed assertion may be deleted or weakened to make the candidate green. Existing upstream failures must be reproduced on the base or clearly isolated with evidence.

#### 4.3 Compile, type and package gates

Run on Linux CI using repository commands:

1. dependency/lockfile check and install;
2. Rush build;
3. Rush validate/type-check;
4. Svelte checks, treating changed-file errors as blocking;
5. production frontend package;
6. minimum Docker image build.

The local Windows `do-svelte-check` false-green behavior is not acceptable evidence. The CI job must fail on tool invocation failure as well as compiler/test failure.

#### 4.4 Integration tests

- Account suite with supported CockroachDB/PostgreSQL versions.
- Telegram suite only if the module remains part of the delivered profile.
- Fulltext suite with Redpanda, Elasticsearch, account and object storage dependencies.
- Storage upload/download and metadata authorization.
- Workspace creation/upgrade and starter-content on/off behavior.
- Email rendering/config tests without sending to real recipients.

#### 4.5 Browser end-to-end smoke suite

Run canonical Playwright sanity tests plus a small Caspel-specific suite covering:

1. first paint/title/favicon before hydration;
2. local sign-in, invalid sign-in and logout;
3. `/signup` redirect and API-side registration rejection;
4. guest sign-in and read-only restrictions;
5. workspace creation/switch;
6. project and issue create/edit/status/comment/attachment;
7. teamspace/document create/edit/reload persistence;
8. inbox/settings/calendar/backup/help pages;
9. Appearance settings theme/font/density/motion persistence and reset;
10. PWA manifest and all Caspel assets;
11. browser console, failed-request and unexpected-host audit.

#### 4.6 Mandatory permission-isolation suite

This is a production hard stop, not an optional smoke test. For member, guest and outsider, test both UI and direct API/resource URLs:

- private projects/issues and activity;
- private teamspaces/documents;
- attachment download/preview/metadata;
- global/fulltext search results;
- mentions and notification previews;
- email notification content;
- export/backup endpoints;
- WebSocket events after access removal;
- cached content after logout or role downgrade.

Expected result is denial without resource-title/content leakage. A 404/403 policy must be consistent with the upstream authorization model.

#### 4.7 Visual and accessibility QA

For login, project list, issue detail, board/list, document editor and settings, cover:

- light/dark/system themes;
- normal, empty, loading, error, disabled and permission-denied states;
- 320 px reflow and 200% zoom;
- keyboard-only traversal and visible focus;
- reduced motion and OS preference changes;
- screen-reader names and status/error announcements;
- long strings in enabled locales;
- automated axe scan with no new serious/critical findings.

#### 4.8 Operational resilience

- Restart account/front/transactor while the client is open and verify recovery.
- Validate logs contain no secrets and no unexplained upstream destinations.
- Create a backup from representative data, restore it into a fresh staging namespace, and reconcile counts/content/attachments/permissions.
- Record measured backup duration, restore duration, recovery point and recovery time.
- Exercise rollback to the previous image digests without changing data formats unexpectedly.

**Exit gate:** the test report identifies commit SHA, environment, exact commands, pass/fail counts, artifacts and every skipped test with a reason/owner.

### Phase 5 — Private Git delivery

**Goal:** push only a reviewed, reproducible candidate to a demonstrably private repository.

1. Verify visibility with the authenticated GitHub API/CLI, for example by querying repository `visibility`, `isPrivate` and default branch. Do this before pushing any uncommitted company work.
2. If the current origin is not private, stop the push, create/choose a private Caspel-owned repository, verify access, and only then repoint or add the delivery remote.
3. Verify `.gitignore` and staged content exclude credentials, local volumes, reports containing tokens, screenshots with private data and scratch output.
4. Split the implementation into reviewable commit families:
   1. fork notice, inventories and decisions;
   2. branding config, PWA assets and first paint;
   3. theme and appearance settings;
   4. authentication, privacy and support-link hardening;
   5. localization/email/service identity;
   6. workspace seed and runtime configuration;
   7. tests, brand guard, CI and final reports.
5. Each commit must preserve a buildable/reviewable boundary where practical. Do not mix owner instructions or local scratch data into these commits.
6. Push the delivery branch first. Open a pull request into `develop`; do not push the dirty worktree directly to the default branch.
7. Require green release-candidate checks and review before merge.
8. Tag the accepted immutable SHA, for example `caspel-pm-web-rc.20260917.1`, and record the tag-to-SHA mapping.
9. Protect the default branch: pull requests required, force-push disabled, review required, status checks required and repository visibility still private.

**Exit gate:** a second authorized tester can clone the private repository, check out the recorded tag and follow the runbook without receiving untracked local files.

### Phase 6 — Handoff package

The handoff must contain:

- private repository URL and verified visibility;
- branch, tag and immutable commit SHA;
- exact base/upstream SHA;
- local/staging URL and service profile;
- secure credential-delivery location, not the credentials themselves;
- startup, shutdown and reset commands;
- passed test matrix and artifacts;
- screenshots for representative light/dark states;
- known issues and production hard stops;
- rollback procedure and previous image digests;
- ownership list for product, design, security, operations and legal decisions.

## 5. Same-day timebox

The exact wall-clock duration depends on Docker cache and CI capacity. Preserve the order even if the deadline compresses.

| Window | Work | Deliverable |
| --- | --- | --- |
| T+0–30 min | Freeze state, classify files, verify private remote | Safe branch and staging manifest |
| T+30–90 min | Close deterministic-startup/doc gaps, diff/security review | Reviewable candidate diff |
| T+90–180 min | Targeted tests, Linux build/type/package CI | Automated evidence |
| T+180–270 min | Start stack, provision accounts/data, browser smoke | Testable local candidate |
| T+270–330 min | Permission checks, visual/a11y pass, defect retest | QA report and blockers |
| T+330–360 min | Commit series, push branch, tag accepted SHA, handoff | Private-repo delivery |

If a mandatory gate cannot finish by cutoff, push an explicitly labelled **release candidate** with the failed/skipped gate and owner recorded. Do not relabel it production-ready to meet the clock.

## 6. Production gates and required owner inputs

The following must be closed after or alongside the same-day candidate before production rollout:

| Gate | Required input/evidence | Owner |
| --- | --- | --- |
| Public hostname | Final frontend/account host keys in both branding files | Operations |
| Support/legal URLs | Approved docs, support, privacy and bug-report HTTPS destinations | Product/Legal |
| Identity | OIDC issuer/client/claims, admission, offboarding and break-glass procedure | IAM/Security |
| Email/push | SMTP sender/reply-to and VAPID `PUSH_SUBJECT` | Operations/Legal |
| Registry | Caspel-owned registry, Linux image pipeline, immutable digests | Platform |
| Deployment repo | Audited self-host/compose/ingress configuration | Platform |
| Secrets/TLS | Secret manager, Cockroach TLS, restricted ports, HTTPS/WSS | Security/Operations |
| Permission isolation | All cross-role leakage tests pass | QA/Security |
| Backup/restore | Fresh-environment restore and RPO/RTO evidence | Operations |
| Accessibility | Keyboard, zoom/reflow, screen reader and axe checks | QA/Design |
| Design approval | Final logo/theme/appearance sign-off | Brand/Design |
| Legal/license | Email/Google copy, EPL/OFL/third-party notices | Legal |
| Integrations | Caspel-owned credentials and explicit enablement policy | Product/Security |

## 7. Defect policy

- **Block delivery:** secret exposure, repository not private, data loss, auth bypass, private-content leak, broken login/workspace creation, failed changed-code tests, unusable core UI.
- **Block production but allow labelled RC:** missing production URL/SMTP/SSO/registry, unexecuted restore rehearsal, incomplete accessibility evidence, optional service unavailable.
- **Document as upstream/environmental:** only after reproducing or isolating it with command/log evidence. Never hide it behind broad retries, skipped assertions or green exit codes.
- Every defect record includes severity, reproduction, expected/actual result, logs/screenshots, owner, fix SHA and retest result.

## 8. Definition of done

### Same-day delivery candidate is done when

- the repository is verified private;
- staged contents are intentional and secret-free;
- the release-candidate branch is pushed and identified by SHA;
- Linux build/type/package checks and changed-package tests pass;
- the local stack starts from documented configuration;
- a QA account/workspace exists and public signup is disabled again;
- core browser smoke flows pass;
- known failures/skips are explicit;
- another authorized user can clone, run and test it.

### Production conversion is done when

- all production gates in section 6 are closed;
- permission isolation and backup restore are verified;
- production images come from this fork and are pinned by digest;
- production configuration contains no upstream service dependency unless approved;
- monitoring, rollback and ownership are operational;
- the final delivery report accurately says production-ready.

