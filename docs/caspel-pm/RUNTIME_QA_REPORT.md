# Runtime QA report

Local stack, 2026-09-16. Not exposed publicly; local-only credentials (`qa.owner@caspel-pm.test`). Driver: Playwright 1.56.1 with headless Chrome 142, scripts kept outside the repository.

## Stack

| Item | Detail |
| --- | --- |
| Compose | `dev/docker-compose.yaml` + `docker-compose.min.yaml` + local override (MinIO image `quay.io/minio/minio`, since `minio/minio` is no longer publicly pullable) |
| Services started | cockroach, redpanda, minio, jaeger, account, transactor, workspace, collaborator, datalake, rekoni, front |
| Built from this fork | `hardcoreeng/front`, `transactor`, `account`, `workspace`, `collaborator`, `datalake`, `rekoni-service` (tag `<HEAD>-caspel-local`) |
| Front bundle | `NODE_ENV=production webpack` (dev/prod), compiled successfully, 0 errors |
| Not running (min profile / unavailable) | stats :4900, hulypulse :8099, hulylake :8096, preview :4040, link-preview :4041, fulltext, backup-api :4039, mail, print, sign, AI, GitHub, Gmail, Telegram |
| Windows workarounds | Rush `package` / `docker-build` phases call POSIX scripts (`rm -rf`, `docker_build.sh` with CRLF). Equivalent commands were run in Git Bash |

## Startup and log audit (RUNTIME VERIFIED)

- All 11 services reached running state. Workspace creation completed in 15–20 s.
- The account service and workspace service logged branding with `title: 'Caspel PM'`.
- The front served `/branding.json` and `/config.json` with status 200.
- No malformed manifest.
- `/caspel-pm/*` assets (SVG, ICO, 5 PNGs, manifest, logos) all returned 200 with correct content types.
- 4,543 backend log lines contain **no** URL to `huly.io`, `huly.app`, `hulylabs`, `hardcoreeng`, `hc.engineering` or `anticrm.org`.
- Errors observed and classified:

| Error | Class |
| --- | --- |
| `ECONNREFUSED :4900` (stats) repeated | MISSING_EXTERNAL_SERVICE (excluded by min profile) |
| Transactor `ECONNREFUSED :8096` (hulylake) | MISSING_EXTERNAL_SERVICE |
| Transactor Kafka `CreateTopics` error at startup | Startup race while Redpanda was starting; not repeated |
| Redpanda memory below recommended | ENVIRONMENT_CONFIGURATION |
| Account `AccountNotFound` | Expected (deliberate invalid-login test) |
| Transactor `Cannot find social id` | Upstream behaviour, unrelated to branding |
| Browser WebSocket `:8099` failed | MISSING_EXTERNAL_SERVICE (hulypulse) |
| Browser `Data read, but end of buffer not reached` (RPC msgpack), once | Upstream client/server protocol message; no Caspel change touches RPC. NEEDS_REVIEW upstream |

## Runtime network audit (RUNTIME VERIFIED)

Every browser request across all QA scripts was recorded. Hosts other than `huly.local`/`localhost`: **none**.

| Surface checked | Result |
| --- | --- |
| Login, signup, recovery, create-workspace, workbench, tracker, issue detail, documents, inbox, settings (8 pages), help popup, calendar settings, backup page, onboarding route, seeded workspace | 0 external requests |
| `config.json` served to browser | No Huly-hosted URLs; `DESKTOP_UPDATES_URL=""`; `SIGNUP_URL`, `ANALYTICS_COLLECTOR_URL`, `AI_URL` unset |
| Anchors on workbench / tracker / documents / settings | Only internal `huly.local:8087` links; 0 external or upstream domains |

Classification of Huly-hosted dependencies:
- **ACCIDENTAL_PRODUCT_DEPENDENCY:** none remaining in the web edition. The icon fallback to `anticrm.org` was removed.
- **DEVELOPMENT_ONLY:** the `huly.local` dev hostname and `config-huly.json`.
- **NEEDS_CASPEL_REPLACEMENT:** the desktop update feed and default server (out of scope), and upstream `hardcoreeng/*` base images.

## Visual QA (RUNTIME VERIFIED, screenshots reviewed)

| Surface | Light | Dark | Findings |
| --- | --- | --- | --- |
| First paint (raw HTML) | `<title>Caspel PM</title>`, `/caspel-pm/favicon.svg?v=3` | — | ✅ Authentic logo embedded |
| Title / icons after hydration | "Caspel PM", "caspelqa - Caspel PM"; manifest + SVG + ICO + apple-touch links | same | ✅ Derived from logos/ |
| Login | "Sign in to Caspel PM", authentic Caspel geometric mark, NO Sign Up tab/controls | forces dark navy theme | ✅ Sign up removed |
| Invalid login | Readable red error: "Account not found or the provided credentials are incorrect" | — | ✅ |
| Password recovery | Caspel PM identity, back to login action, NO Sign Up link | — | ✅ |
| Guest sign-in | "Continue as a guest" -> selects available workspaces or guides to login | — | ✅ Fixed 404 via auto-provisioning |
| Appearance Settings | Dedicated page under Settings: Theme (System/Light/Dark), Font Size (Compact/Default/Comfortable/Large), Density (Comfortable/Compact), Motion (System/Reduced/Full), Reset button | Live preview in both themes | ✅ Live preview & persistence verified |
| Typography scaling | Proportional rem scaling across lists, details, dialogs, sidebars | — | ✅ |
| Avatar picker | Upload avatar or select colored initials; Gravatar probe completely removed | — | ✅ 0 external requests |
| Workbench / tracker / issue list | Teal-navy primary button, readable | Teal-navy primary button visible on dark | ✅ |
| Issue detail | Status change + comment render; accent on selected nav | — | ✅ |
| Documents / editor | Teamspace + document create, body persists after reload | — | ✅ |
| Inbox | Renders | Renders | ✅ |
| Help & Support popup | Only Settings + Keyboard Shortcuts; no docs/privacy/bug/contact links | same | ✅ |
| Settings → Calendar | Calendar named "Caspel PM" (was "HULY") | same | ✅ |
| Settings → Backup | Download + script actions; **no restore guide** when unconfigured; guide shown when `support.backupRestoreGuideLink` is injected into branding | — | ✅ |
| Account settings (identities) | Email identity only; built-in account identity row is not rendered for this account | — | ✅ |
| Visible "Huly" text scan (all pages above) | 0 hits outside the `huly.local` dev hostname in URLs shown on the Backup page | 0 | ✅ |

## Functional QA (RUNTIME VERIFIED unless noted)

| Workflow | Result |
| --- | --- |
| Normal Sign In | ✅ |
| Public Sign Up UI | ✅ REMOVED (login defaults directly to Sign In, tabs show clean title, /signup redirects) |
| Server-side Sign Up policy | ✅ ENFORCED (`DISABLE_SIGNUP=true` in `operations.ts` rejects registration) |
| Guest Sign-In | ✅ RESOLVED (`readOnlyGuestAccountUuid` auto-provisioning eliminates AccountNotFound 404; RBAC constrained to ReadOnlyGuest) |
| Password recovery page | ✅ (page renders; back to login action; no sign up) |
| Appearance Settings | ✅ (Theme Light/Dark/System with live OS sync, Font Size Compact/Default/Comfortable/Large, Density Compact/Comfortable, Motion System/Reduced/Full, Reset button) |
| Gravatar Privacy | ✅ (Disabled automatic background probes; 0 external avatar requests) |
| Create workspace, workbench load | ✅ |
| Create issue | ✅ |
| Change issue status (In Progress) + comment | ✅ |
| Attachment upload on issue | ✅ (preview service absent, so no thumbnail) |
| Create project (QA Project, QAP) | ✅ |
| Create teamspace + document; collaborative body edit persists after reload | ✅ |
| Inbox, settings pages, calendar settings, backup page (mocked API) | ✅ |
| Logout | ✅ |
| Seed off (default): new workspace has no starter content; log `Init script file not found` | ✅ |
| Seed on (`INIT_REPO_DIR=./caspel-pm-init`, `INIT_WORKSPACE=caspel-pm`): project "Getting started" START-1…4 + teamspace "Caspel PM guide" with document; `IMPORT SUCCESS`; no Huly text | ✅ |
| Full-text search | ⛔ BLOCKED (fulltext service excluded) |
| Notifications / email / push | ⛔ BLOCKED (mail, hulypulse not running) |
| Residual Brand Scan | ✅ 0 unclassified findings |

Test data created: workspaces `caspelqa` and `caspelseed` in the local dev volumes only.
