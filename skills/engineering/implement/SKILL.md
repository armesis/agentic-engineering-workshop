---
name: implement
description: Implement a GitHub issue end-to-end - fetch it, ground the approach in existing PRD/ADR/glossary docs, build the change, verify it by actually running it, then commit/push/close only with explicit user go-ahead at each step, proposing a skill refinement afterward if a better way surfaced.
disable-model-invocation: true
---

# Implement

Take a single issue from the tracker to a verified, committed change.

## Process

### 1. Fetch the issue

`gh issue view <number>` for title, body, acceptance criteria, and any "Parent" / "Blocked by" links.

### 2. Ground the approach in existing docs

If the issue references a parent issue or PRD, fetch that too (`gh issue view <parent>`). Also check for a domain glossary (e.g. `CONTEXT.md`) and ADRs (e.g. `docs/adr/*.md`). Decisions already made there (naming, architecture, specific ports/libraries/constraints) are not yours to re-litigate — implement to match them rather than inventing new conventions.

### 3. Check repo state before touching anything

Confirm it's a git repo, run `git status` / `git remote -v`, and look at what already exists on disk. Don't scaffold over or clobber existing work.

### 4. Plan

Map each acceptance criterion in the issue to concrete file/directory changes.

### 5. Implement

Write the code / scaffold the tools / wire the config per the plan, following the constraints surfaced in step 2. Use /tdd where possible, at pre-agreed seams. Run typechecking regularly and single test files regularly.

### 6. Verify end-to-end by actually running it

Typechecking and unit tests confirm correctness, not that the feature works. Build it, run it, and exercise the real path: start the server, hit it, drive the actual protocol/flow (e.g. open a real socket connection, not just assert a handler exists). Run the full test suite once. Clean up any throwaway verification scripts/processes afterward.

### 7. Review

Use /code-review to review the work before considering it done.

### 8. Confirm before committing

Committing touches shared repo state — use AskUserQuestion (or equivalent) to confirm the user wants to commit now. Don't assume permission carries across turns.

Commit with a message referencing the issue number, using the repo's normal format (heredoc-style multiline message, trailers as conventionally used in this repo).

### 9. Push and close only when explicitly asked

Pushing and closing the issue are separate checkpoints from committing, not bundled into the same step. When the user asks for either:

- Push: `git push`.
- Close: `gh issue close <number> --comment "..."`, referencing the commit SHA and summarizing what was implemented against the acceptance criteria.

### 10. Propose a skill refinement, if warranted

After pushing, reflect on whether anything in steps 1-9 turned out to be wrong, missing, or clumsy for this repo/issue — a step that didn't fit, a better sequencing, a gap the docs didn't cover. If so, propose a concrete edit to this SKILL.md to the user before ending the turn. Don't propose a refinement just to have one; skip this step if nothing genuinely better surfaced.
