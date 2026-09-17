# Build report

Continuation run on 2026-09-16, authorized by the repository owner (overrides the `AGENTS.md` no-build rule for this task only).

## Environment

| Item | Value |
| --- | --- |
| Host | Windows 11, Git Bash, 8 CPU, 15.8 GB RAM (≈2.5–3 GB free during builds) |
| Node | v22.11.0 (`.nvmrc` v22) |
| Rush | 5.158.1 via `common/scripts/install-run-rush.js` (pinned; no global rush) |
| pnpm | 10.15.1 via Rush (pinned; global pnpm 10.26.2 not used) |
| Registry | `registry.npmjs.org`. No GitHub Packages references in `pnpm-lock.yaml`, so no token was needed |
| Docker | Docker Desktop 29.7.2 (WSL2 VM, 8 GB, 8 CPU) |
| Lockfile | Unchanged; no dependency upgrades |

## Results

| Command | Result | Duration | Notes |
| --- | --- | --- | --- |
| `node common/scripts/install-run-rush.js install` | ✅ exit 0 | 10 m 38 s | Peer-dependency warnings only (`@types/dom-mediacapture-*`, `electron-builder-squirrel-windows` in desktop packages). Upstream; not addressed |
| `… rush build --parallelism 4` | ✅ exit 0 | 7 m 6 s | 474 SUCCESS, 7 NO OP. The `_phase:build` phase **transpiles only** (`compile transpile` / `compile ui`); it does not type-check |
| `… rush validate --parallelism 4` | ✅ exit 0, **0 `error TS`** | 34 m 33 s | 871 SUCCESS, 12 NO OP, 79 FROM CACHE (all cached operations were `build` dependencies; every changed package ran `validate`). Includes the user-owned `pods/fulltext` |
| `svelte-check` in 6 changed frontend packages | See below | — | Run directly via each package's `node_modules/.bin/svelte-check` |
| `… rush bundle -p 3 --to pod-server,pod-account,pod-workspace,pod-collaborator,rekoni-service,pod-datalake,pod-front` | ✅ exit 0 | 3 m 35 s | 11 SUCCESS, 431 FROM CACHE, 426 NO OP |
| Production webpack (`dev/prod`), `NODE_ENV=production webpack` | ✅ exit 0, 0 `ERROR in` | 10 m 53 s | Run manually because Rush `package` scripts use `rm -rf`/`cp -r` (fail under Windows `cmd`). Built `index.html` title `Caspel PM` |
| Docker images (`docker build -t hardcoreeng/<svc>`): front, transactor, account, workspace, collaborator, datalake, rekoni-service | ✅ all exit 0 | — | Run manually because `_phase:docker-build` calls `docker_build.sh` through `cmd` (CRLF script). Workspace image contains `caspel-pm-init` and no `init-scripts` |
| Second `rush install` | ✅ exit 0 | 8 m 48 s | `common/temp` (pnpm virtual store) was emptied at 18:31 by a process outside this work; reinstalled from the unchanged lockfile |
| Final `rush build --parallelism 6` | ✅ exit 0 | 68 s | 3 SUCCESS, 471 FROM CACHE, 7 NO OP |

### svelte-check

| Package | Errors | Warnings | Errors/warnings in files changed by Caspel PM |
| --- | ---: | ---: | --- |
| plugins/workbench-resources | 0 | 49 | none |
| plugins/view-resources | 0 | 32 | none |
| plugins/setting-resources | 0 | 64 | `Backup.svelte` unused `.file-link` selector: identical at HEAD (upstream) |
| plugins/calendar-resources | 0 | 65 | none |
| plugins/login-resources | 1 | 68 | Error in unchanged `ConfirmationSend.svelte:41` (`Timeout` vs `number`). `LoginApp.svelte:250` `-webkit-mask` warning is an unchanged upstream line |
| plugins/onboard-resources | 5 | 73 | All errors in unchanged files (`Auth.svelte` ×2, `Form.svelte`, `OnboardUserForm.svelte`, shared `ConfirmationSend.svelte`). `OnboardApp.svelte:178` `-webkit-mask` warning is an unchanged upstream line |

`login-resources` and `onboard-resources` have no `svelte-check` script, so upstream CI does not check them. Their errors are classified **EXISTING_UPSTREAM_FAILURE**.

**Tooling defect found:** the rig's `do-svelte-check` (via `rushx svelte-check`) fails on Windows with `spawn svelte-check ENOENT` but still exits 0. A "green" `rushx svelte-check` on Windows is not evidence. Use `node_modules/.bin/svelte-check` directly.

## Failure classification

| Failure | Class | Action |
| --- | --- | --- |
| `svelte-check` errors in unchanged login/onboard files | EXISTING_UPSTREAM_FAILURE | None (out of rebrand scope) |
| `do-svelte-check` ENOENT on Windows | TOOLCHAIN_FAILURE (Windows) | Worked around by calling svelte-check directly |
| Rush `package` / `docker-build` phases on Windows | ENVIRONMENT_CONFIGURATION (POSIX shell scripts) | Equivalent commands run in Git Bash; production images should be built on Linux CI |
| Integration tests needing CockroachDB/PostgreSQL/Kafka | MISSING_EXTERNAL_SERVICE | See TEST_REPORT.md |
| `minio/minio` image no longer publicly pullable | ENVIRONMENT_CONFIGURATION (upstream registry change) | Local override to `quay.io/minio/minio`; dev compose needs an owner decision |
| `hardcoreeng/hulylake`, `events-processor`, `worker` `:latest` not on Docker Hub | ENVIRONMENT_CONFIGURATION | Not needed for the web QA subset; noted |
| USER_OWNED_CONFIGURATION_BLOCKER | none observed | `pods/fulltext` built and validated with the owner's current configuration |
| CASPEL_REBRAND_REGRESSION | **none found** by build/validate/svelte-check | — |

Logs are kept outside the repository (session scratchpad) and are not committed.
