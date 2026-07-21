---
name: backup
description: On-demand crash course on a concept, grounded in this codebase. Only reachable via /backup <concept> — e.g. "/backup Socket.IO", "/backup React state", "/backup TDD". Use when the user is lost on a concept mid-build and wants a explanation without derailing into a workflow.
disable-model-invocation: true
---

# Backup

You got called in because the user hit a concept they don't have solid footing on and need a straight explanation before they can keep moving. This is a pit stop, not a detour — answer the question, then get out of the way.

## What this is not

- Not a grilling session — don't interview the user about their design.
- Not `domain-modeling` — don't write to `CONTEXT.md` or an ADR. Nothing here is a project decision.
- Not a workflow step — don't route them to another skill unless they ask what's next.

This skill **reads**, **explains**, and **stops**. It never edits files.

## Input

The argument after `/backup` is the concept: a technology, pattern, protocol, or piece of jargon (`Socket.IO`, `WebSockets`, `optimistic UI`, `React reconciliation`, `FLIP animation`, `TDD`, `Vitest mocking`, whatever). If no concept was given, ask what they're stuck on before doing anything else.

## Process

1. **Search this codebase for the concept first.** Grep for the term, the library name, the relevant files. A crash course that ignores how the concept is actually used here is generic filler — the whole value of this skill over a search engine is that it's grounded in code the user can go read immediately after.
2. **Explain in three layers, in order:**
   - **What it is** — the one- or two-sentence plain definition. Assume no prior knowledge of this specific concept, but don't over-explain adjacent things they didn't ask about.
   - **How it works, mechanically** — the core mechanism, not an exhaustive feature tour. Pick the 3-5 facts that matter for understanding what's in front of them, not everything the concept can do.
   - **How it works *here*** — map the mechanism onto this repo with concrete file:line references. This is the layer that makes it a crash course instead of a Wikipedia summary. If the concept isn't used in this codebase yet, say so and explain how it *would* plug in given the existing architecture.
3. **Surface real gaps, don't invent hypotheticals.** If, while grounding the explanation in code, you notice the concept is used incompletely or inconsistently with what the user seems to be about to do (a missing config, a protocol mismatch, a partially-wired feature), say so plainly — that's often the actual reason they got lost. Don't pad this with speculative "you might also want to consider..." tangents.
4. **Stop.** Don't propose next steps, don't ask "want me to implement this?" unless the user asks. If fixing a surfaced gap is tempting, name it and let them decide whether to pursue it in this skill's turn or move on.

## Tone

Direct and concrete over thorough and abstract. A crash course is short enough to read in one sitting and specific enough to immediately unblock. If the honest answer to "how does X work here" is "it doesn't, yet" — say that in one line and move to what would need to change, rather than padding with generic theory.
