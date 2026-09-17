# Workspace seed (starter content) specification

## Behaviour in this fork

| Situation | Upstream | Caspel PM |
| --- | --- | --- |
| `INIT_WORKSPACE` and branding `initWorkspace` both unset, init repo present | Seeds the script marked `default: true` (upstream `hcengineering/init`: "Welcome to Huly! 🌟" onboarding issues) | **No seeding.** Workspace starts empty; log `No init script selected; workspace starts empty` |
| Name set but not found in `script.yaml` | Falls back to the default script | **No seeding** |
| Name set and found | Runs it | Runs it |
| `script.yaml` missing | No seeding (warning) | Same |

Implemented in `server/tool/src/initScript.ts` (`selectInitScript`) and used by `initializeWorkspace` in `server/tool/src/index.ts`. Unit test: `server/tool/src/__tests__/initScript.test.ts`.

Where values come from:

| Setting | Consumer | Default |
| --- | --- | --- |
| `INIT_REPO_DIR` | `server/workspace-service/src/index.ts` → `toolPlugin.metadata.InitRepoDir` | `./init-scripts` |
| `INIT_WORKSPACE` | same → `toolPlugin.metadata.InitWorkspace` | unset |
| Backend branding `initWorkspace` (per host, `BRANDING_PATH`) | `initializeWorkspace` (takes precedence over env) | unset (dev `example.localhost` uses `init`) |

Upstream image pipeline: `.github/workflows/main.yml` and `pods/workspace/download-init-scripts.sh` download `github.com/hcengineering/init` into `pods/workspace/init/`. The Dockerfile copies that to `./init-scripts/`. **A Caspel image build must not run that download step.** Even if it does, the content stays inert unless someone names one of its scripts explicitly.

## Caspel PM starter set (in this repository)

Location: `pods/workspace/caspel-pm-init/`. The Dockerfile copies it to `/usr/src/app/caspel-pm-init/`.

```
caspel-pm-init/
  script.yaml                         # one script: name caspel-pm, default: false, step: import ./workspace
  workspace/
    Getting started.yaml              # tracker:class:Project, identifier START
    Getting started/
      1.Welcome to Caspel PM.md
      2.Create your first project.md
      3.Invite your team.md
      4.Configure project workflow.md
    Caspel PM guide.yaml              # document:class:Teamspace
    Caspel PM guide/
      Getting started.md
```

Content is generic product guidance. No company names, people, emails or sample business data. Owners and members are omitted, so the importer assigns none and the workspace creator has access through the public, auto-join spaces.

### Enable it (opt-in)

Workspace service environment:

```
INIT_REPO_DIR=./caspel-pm-init
INIT_WORKSPACE=caspel-pm
```

Or per host in the backend branding file: `"initWorkspace": "caspel-pm"` (still requires `INIT_REPO_DIR`).

### Rules for editing or replacing the seed

1. Format: the unified YAML/Markdown import format (`packages/importer/src/huly`, examples in `dev/import-tool/docs/huly`).
2. Issue statuses must exist in the default classic project type: `Backlog`, `Todo`, `In Progress`, `Done`, `Canceled`.
3. Don't reference people (`owners`, `members`, `assignee`, comment `author`) unless those accounts exist at workspace creation.
4. Keep `default: false`. Seeding must stay an explicit choice.
5. Seeding runs once, at workspace creation. Changes don't affect existing workspaces.
6. An external seed repository can replace this folder by mounting it and pointing `INIT_REPO_DIR` at it. The same rules apply.

### Validation

- Static: YAML front matter parses, and statuses/classes are from the allowed set (checked 2026-09-16, see BUILD_REPORT.md).
- Runtime: create a workspace with the variables above. Expect the project **Getting started** (START-1…START-4) and teamspace **Caspel PM guide**, and no "Huly" text. Create another without them and expect an empty workspace. Results are in FUNCTIONAL_QA_MATRIX.md.
