---
status: accepted
---

# Checkpoint branches mark workflow-phase milestones, not per-issue app state

Supersedes ADR-0001.

ADR-0001 planned one `checkpoint-N` branch per completed issue (#2-#12), so a stuck pair could recover the exact client build stage they needed. In practice, this repo's checkpoint mechanic is being repurposed: the PRD's "Further Notes" frame the whole app as a single live-build pass of the taught workflow (grill → PRD → issues → implementation → test → commit & push), and the value of checkpoint branches for this repo's own purposes is showing that workflow's macro-stages, not recovering fine-grained client progress.

Decision: replace the per-issue checkpoint branches with four branches marking the macro-phases of the one grill → PRD → issues → implementation pass that built this app:

- `checkpoint-1-pre-grilling` — repo before any workshop-specific work (`69a5dce`)
- `checkpoint-2-post-grilling` — domain glossary and ADRs committed, PRD (#1) written (`5a4d7da`)
- `checkpoint-3-issue-writing` — issues #2-#13 filed on the tracker; same tree as checkpoint-2 since filing issues doesn't touch the working tree
- `checkpoint-4-post-implementation` — final state, all issues implemented

Recovery is still `git checkout -f <branch>`; participant repos are still generated with "Include all branches" checked (see ADR-0001).

Consequences: participants lose the ability to recover to an exact mid-build feature state (e.g. "right after QR code join was added") — `checkpoint-1` through `checkpoint-3` predate the client/server scaffold entirely (added in #2) and contain no runnable app at all. Only `checkpoint-4-post-implementation` is a working, runnable snapshot. This trades per-feature recovery granularity for a repo that can visibly demonstrate its own build process.
