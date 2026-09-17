# Upstream baseline

Recorded 2026-09-16, before any Caspel PM change.

| Item | Value |
| --- | --- |
| Working directory | `D:\github_repos\platform` (Windows 11, Git Bash) |
| Branch | `develop` |
| HEAD | `63e28dc96483967b2fc21c881b3f1023c1de7718` — `feat(tracker): Gantt chart for the issue tracker (#10992)` |
| `git describe --tags --always --dirty` | `s0.7.327-474-g63e28dc96-dirty` |
| Tags at HEAD | none |
| Remotes | `origin https://github.com/anormalguy96/caspel-pm.git` (fetch/push). **No `upstream` remote.** |
| Submodules | none |
| Git LFS | 3.6.0 installed |
| Node | v22.11.0 (`.nvmrc`: `v22`) |
| Rush (rush.json) | 5.158.1; `rush` CLI not on PATH |
| pnpm (rush.json) | 10.15.1; locally installed pnpm is 10.26.2 |
| Node range (rush.json) | `>=20.0.0 <25.0.0` |
| Free disk on D: | 102 GB |

## Pre-existing working-tree state

Before this work the tree already contained owner changes, which were left untouched:

- `M AGENTS.md` — owner added ~2,090 lines of general agent instructions.
- `?? CASPEL_PM_MASTER_AGENT_PROMPT.md` — the execution prompt for this conversion.

During execution, `pods/fulltext/tsconfig.json` (and briefly `pods/fulltext/.eslintrc.js`) were modified by another process. The change rewrites `@hcengineering/platform-rig` to `@caspel/platform-rig`. It is **not** part of this conversion; see BLOCKERS.md B-000.

## Effective baseline

The fork tracks the moving upstream `develop` branch (474 commits after dev tag `s0.7.327`), not a production `v*` tag. The prompt notes upstream production release `v0.7.426` (2026-07-05, `ccefccd8d0361d3c8612d508071b777aa833826d`); that was not re-verified because no upstream remote is configured and no network fetch was performed.

**Recommendation:** pin the fork to a production `v*` tag before deeper customization, or record explicit acceptance of branch volatility (BLOCKERS.md B-001).

## Baseline build and runtime

**Update 2026-09-16:** the owner authorized builds for the continuation; results in BUILD_REPORT.md, TEST_REPORT.md, RUNTIME_QA_REPORT.md. A separate unchanged-upstream baseline build was still not produced.

Original first pass: not executed. The repository's `AGENTS.md` says: *"Do not run build commands automatically for verification."* This overrides the prompt's Phase 1 build step. No `rush install`, `rush build`, Docker stack, screenshots or HAR capture were produced. Upstream failures therefore cannot yet be told apart from Caspel changes. Run the baseline manually on a clean checkout of `63e28dc96` (see FINAL_DELIVERY_REPORT.md "Next actions").

## Adding the upstream remote (not done automatically)

```sh
git remote add upstream https://github.com/hcengineering/platform.git
git fetch upstream --tags
git describe --tags --abbrev=0 upstream/develop
```
