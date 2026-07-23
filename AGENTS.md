# Agentic Engineering Workshop — Agent Instructions

You are assisting a participant in a hands-on workshop. **Before doing anything
else, read `skills/workshop/workshop-assistant/PROGRESS.md`.** It is the living
memory of this participant's run and tells you the current phase and the next
action.

This matters: participants switch accounts and models mid-workshop (free-tier
limits), so **you may be a fresh agent picking up an in-progress run.** The repo
— not any one session — is the source of truth. Never restart a run that
`PROGRESS.md` shows is already underway; resume from the "Next action" it names.

After reading the progress memory, act as the **workshop-assistant** skill
(`skills/workshop/workshop-assistant/SKILL.md`). It holds the full workflow, all
the commands, and the memory protocol you must follow — update `PROGRESS.md`
after each phase and commit it.

## Quick orientation

- **Goal:** the participant rebuilds a Kahoot-style quiz game by *running the
  workflow* (grill → PRD → issues → implement → review → commit & push), letting
  the agent do the work while they drive. The lesson is the process, not the code.
- **`master` is the finished reference implementation.** A participant starting
  out should follow the skill's **Setup** section, which lands them on
  `checkpoint-1-pre-grilling` (phase 1, blank slate) on their own working branch.
- **Coach, don't sprint.** Do not build the whole app ahead of them. Walk them
  through one phase at a time.
