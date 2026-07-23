# Guided Grill Script — Kahoot-Clone Quiz App

**This is the script the agent runs during Phase 1 (Grill).** Ask the participant
these questions — the real human you're pairing with — *one at a time, in order*,
for a fully guided grilling session. Don't hand them the answers: ask, let them
reason it out, then record what they land on.

Each question names the glossary term(s) or ADR it should crystallise. As
answers land, capture them with the **grill-with-docs** skill, which writes
`CONTEXT.md` (the domain glossary) and `docs/adr/` entries. The "Capture" note
under each question is your target — what should exist in the docs once that
question is resolved.

This is a **shortened, guided** grill (4 questions, not an exhaustive interview),
chosen so the session lands on a handful of real glossary entries and one ADR.
In a live participant run, follow it beat by beat; go deeper if the participant
does, but always cover these four.

## Starting premise (state this to the participant to open the session)

"We're building a live, in-room, Kahoot-style multiplayer quiz game for the
workshop. One person runs it from the front of the room, everyone else joins
on their phones and answers multiple-choice questions for points."

## Question script

**Q1 — Roles: does the person running the show also play?**
Probe whether the room-runner answers questions alongside everyone else, or
is a purely privileged, non-playing role.
→ Capture glossary terms: **Host**, **Player**.

**Q2 — Joining: how does a phone get into the game?**
Probe the join mechanic — typed URL, room code, or scan-based.
→ Capture glossary term: **Player** join mechanic (QR code → `?role=player`).
(Refines the Q1 Player entry rather than adding a new one.)

**Q3 — Between joining and playing: is there a holding state?**
Probe what a joined-but-not-yet-playing participant sees, and who releases
them into the game.
→ Capture glossary term: **Waiting Room**, and the **Play** action.

**Q4 — Meta: participants will get stuck mid-build during the workshop. How does
a stuck participant recover without losing everyone's individual progress?**
Probe recovery mechanics for a room full of people building the same app in
parallel — surfaces the checkpoint-branch mechanic this very workshop uses.
→ Capture as an ADR: **checkpoint branches (not tags) for the teleport
mechanic** (this decision later evolved into ADR-0004, which frames checkpoints
as workflow-phase milestones).

## Target end state (what a good grill produces here)

- `CONTEXT.md` with **Host**, **Player**, **Waiting Room**, **Play** (a fuller
  glossary also covers Host Screen, Game, Question, Reveal, Leaderboard, Final
  Results, Question Bank, Avatar — draw those out if the participant goes deeper).
- At least one ADR in `docs/adr/` capturing the checkpoint/teleport decision.

This mirrors the real workshop history at `checkpoint-2-post-grilling` — a useful
reference for what "done with the grill" looks like, not a script to copy verbatim.
