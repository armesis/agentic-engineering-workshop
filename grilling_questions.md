# Guided Grill Script — Designing the Kahoot-Style Quiz Game

**This is the script the agent runs during Phase 1 (Grill).** It walks the
participant — the real human you're pairing with — through the **design decisions**
that shape the game, one scenario at a time. The grill *simulates the design
process that produced this app*: the stack and end goal are already fixed, so the
interesting work is the product and experience calls, not the technology.

## How to run it

- **One question at a time, in order.** Each is a real fork in how the game plays.
  Pose it as the little scenario written below, in plain language — a story about
  the room, not a spec sheet.
- **The participant owns the decision; you carry the load.** Many participants are
  non-technical. If they hesitate or ask, explain the trade-off simply, then offer
  the sensible default (each question's **This app chose** line is that default)
  and let them confirm. It's completely fine to just extract the main spec from how
  they describe what they want — don't make them produce jargon.
- **The host may help** a participant phrase things or ask you to "explain that
  simpler" or "just pick the good default." That's expected.
- **Capture each decision as it lands** with the **grill-with-docs** skill, which
  writes the `CONTEXT.md` glossary and, for the meatier calls, an ADR in
  `docs/adr/`. The **Capture** line is your target for each question.

Cover all six. Go deeper if the participant is engaged; keep it moving if they're not.

## Starting premise (open the session by painting this picture)

"We're building a live, in-room, Kahoot-style multiplayer quiz game. One person
runs it from a big shared screen at the front of the room; everyone else joins on
their phones and answers multiple-choice questions for points. Let's make a few
decisions about how it should feel to play."

## Question script

**Q1 — The shared screen vs. the phones: where does the question appear?**
Scenario: "A question comes up. The room has one big screen at the front and
everyone's holding a phone. Where do the question and its four answers show — on
every phone, or *only* on the big screen (so phones just show four answer
buttons)?"
Why it matters: this is the game's signature choice — keeping the question on the
shared screen makes the room look up together instead of down at phones.
→ *This app chose:* the **question text and options render only on the Host
Screen**. Phones show just four shape/colour-coded buttons and the timer — never
the question, options, or correct answer.
→ Capture: **Host Screen**, **Player**, and the **Question** definition (players
receive only timing + buttons).

**Q2 — Who runs it, and do they play too?**
Scenario: "One person drives the game from the front. Are they also a contestant
answering questions, or purely the operator running the show?"
→ *This app chose:* a single non-playing **Host**, authenticated by a shared
password; everyone else is a **Player**.
→ Capture: **Host** (privileged, non-playing), **Player**.

**Q3 — Getting a phone into the game, and who you are once you're in.**
Scenario: "A player walks in with their phone. How do they join — type a web
address, punch in a room code, or scan something on the big screen? And once
they're in, what do they set up before the game starts?"
→ *This app chose:* **scan a QR code** on the Host Screen (opens the app as a
Player); then pick a **Username** and an **Avatar**, and wait in a **Waiting
Room** until the Host presses **Play**, which drops everyone into the game at once.
→ Capture: **Player** join (QR → player role), **Avatar**, **Waiting Room**, **Play**.

**Q4 — What makes someone win: accuracy, speed, or both?**
Scenario: "Two players both answer correctly. One taps in 2 seconds, the other in
8. Same points, or should being fast earn more?"
Why it matters: this single call sets the whole feel — pure-accuracy is calmer,
speed-weighted is tense and Kahoot-like.
→ *This app chose:* **correct *and* fast scores more** (speed-weighted), with a
per-question point multiplier; first tap locks the answer in.
→ Capture: an ADR on **scoring = accuracy + speed, with a per-question
multiplier and first-tap lock-in**.

**Q5 — The rhythm between questions.**
Scenario: "A question's timer hits zero. Before the next question, what does the
room see — the right answer? the standings? for how long? And who moves it
along — does the Host click Next each time, or does it run itself?"
→ *This app chose:* an automatic rhythm — a **Reveal** (correct answer on the
screen, each player's own result on their phone; ~5s), then a **Leaderboard** (top
standings animate; ~5s), then it **auto-advances** with no Host pacing, ending on
an animated **Final Results** podium.
→ Capture: **Reveal**, **Leaderboard**, **Final Results**, and the **Game**
running fully automatically end-to-end.

**Q6 — Where questions come from, and a feature worth cutting.**
Scenario: "The quiz questions live in a simple spreadsheet file. Tempting idea:
let the Host add a fresh question mid-game — an inside joke during the break —
without restarting anything. Worth building, or worth cutting?"
Why it matters: this is where the participant practises *scope discipline* — a
grill's best outcome is often deciding what **not** to build.
→ *This app chose:* **cut it.** The **Question Bank** (a CSV) is read once at
startup; no live reload of any kind — dodging a whole class of edge cases for a
low-value feature.
→ Capture: **Question Bank**, and an ADR on **loading questions once at startup /
dropping live-injected questions** (mirrors the real `docs/adr/0003`).

## Target end state (what a good grill produces here)

- `CONTEXT.md` with the glossary drawn out through the questions: **Host**, **Host
  Screen**, **Player**, **Waiting Room**, **Play**, **Game**, **Question**,
  **Reveal**, **Leaderboard**, **Final Results**, **Question Bank**, **Avatar**.
- One or two ADRs in `docs/adr/` for the meatier calls — scoring (Q4) and the
  cut live-reload feature (Q6).

This mirrors the real workshop history at `checkpoint-2-post-grilling` — a
reference for what "done with the grill" looks like, not a script to copy verbatim.
The participant's own wording and any extra decisions they make are theirs to keep.
