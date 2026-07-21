# Grilling Demo Script — Kahoot-Clone Quiz App

Scripted walkthrough for demonstrating the grill-with-docs skill live. This is a
**shortened** demo (4 questions, not an exhaustive interview) chosen to land on
a handful of real CONTEXT.md glossary entries and one real ADR from the actual
workshop history (checkpoint-2-post-grilling). Not committed — discard with
`git checkout -f` when the demo ends.

## Premise fed to the "participant"

"We're building a live, in-room, Kahoot-style multiplayer quiz game for the
workshop. One person runs it from the front of the room, everyone else joins
on their phones and answers multiple-choice questions for points."

## Question script

**Q1 — Roles: does the person running the show also play?**
Probe whether the room-runner answers questions alongside everyone else, or
is a purely privileged, non-playing role.
→ Resolves glossary terms: **Host**, **Player**.

**Q2 — Joining: how does a phone get into the game?**
Probe the join mechanic — typed URL, room code, or scan-based.
→ Resolves glossary term: **Player** join mechanic (QR code → `?role=player`).
(Refines the Q1 Player entry rather than adding a new one.)

**Q3 — Between joining and playing: is there a holding state?**
Probe what a joined-but-not-yet-playing participant sees, and who releases
them into the game.
→ Resolves glossary term: **Waiting Room**, and the **Play** action.

**Q4 — Meta: pairs will get stuck mid-build during the workshop. How does a
stuck pair recover without losing everyone's individual progress?**
Probe recovery mechanics for a room full of participants building the same
app in parallel — surfaces the checkpoint-branch mechanic this very demo is
using.
→ Triggers ADR: **0001 - Checkpoint branches (not tags) for the teleport
mechanic**.

## Target end state (what checkpoint-2 actually contains)

- CONTEXT.md with Host, Player, Waiting Room, Play (partial glossary — full
  version also has Host Screen, Game, Question, Reveal, Leaderboard, Final
  Results, Question Bank, Avatar)
- docs/adr/0001-checkpoint-branches-for-teleport.md (full version also has
  0002-react-via-cdn-vite.md and 0003-drop-live-callback-questions.md)
