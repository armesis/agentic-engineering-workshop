# Agentic Engineering Workshop

A Kahoot-style quiz app (`client/` + `server/`) built live during the workshop as a demonstration of the taught grill → PRD → issues → implementation → test → commit & push workflow. See `CONTEXT.md` for domain vocabulary and `docs/adr/` for architectural decisions.

## Checkpoint branches

This repo ships four `checkpoint-*` branches marking macro-phases of the workflow that built it (see [ADR-0004](docs/adr/0004-checkpoint-branches-mark-workflow-phases.md)):

- `checkpoint-1-pre-grilling` — repo before any workshop-specific work
- `checkpoint-2-post-grilling` — domain glossary and ADRs committed, PRD written
- `checkpoint-3-issue-writing` — all issues filed on the tracker
- `checkpoint-4-post-implementation` — final state, fully working app

If you get stuck, recover a checkpoint with:

```
git checkout -f checkpoint-4-post-implementation
```

Only `checkpoint-4-post-implementation` is a runnable app — the earlier three predate the client/server scaffold and exist to show the process, not to recover build progress.

When generating a participant repo from this template via "Use this template," **"Include all branches" must be checked** so every `checkpoint-*` branch is present in the generated repo from the start.
