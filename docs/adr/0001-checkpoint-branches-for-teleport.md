---
status: superseded by ADR-0004
---

# Checkpoint branches (not tags) for the teleport mechanic, generated via "Include all branches"

Stuck pairs need to jump to a fully working client at any build stage. We considered git tags in a cloned repo, but participants get their repo via GitHub's "Use this template" button, which does not preserve commit history or tags from the source — confirmed via GitHub's docs, even with "Include all branches" checked, every branch in a generated repo starts as an unrelated single-commit snapshot.

Decision: build the template repo with one branch per checkpoint (`checkpoint-1`, `checkpoint-2`, ..., `checkpoint-final`), each a complete snapshot of the client at that stage. Generate participant repos with "Include all branches" checked, so every pair's repo already contains all checkpoint branches. Shared history isn't needed — `git checkout <branch>` only needs to swap the working tree, not merge or diff against ancestry.

Recovery instructions tell stuck pairs to run `git checkout -f <branch>`, discarding local changes rather than stashing — they're stuck/broken already, so there's nothing worth preserving, and it keeps the recovery doc to one command.
