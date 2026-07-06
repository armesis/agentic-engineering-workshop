# Kahoot-Clone Quiz App

A real-time multiplayer quiz game (client + server) built live during the workshop, then replicated by participants for their own client.

## Language

**Host**:
The single privileged role for the session, authenticated by a shared password (stored in an env var). Reaches the app at the root URL (no query param). Controls the game (presses Play) and views the Host Screen.
_Avoid_: Presenter, admin, moderator

**Host Screen**:
What the Host sees after logging in: a QR code encoding the Player join URL, a live roster of joined Players, and the Play button.
_Avoid_: Presenter screen, projector view, dashboard

**Player**:
A participant role that joins by scanning the Host Screen's QR code, landing on the app with `?role=player`. Picks a Username and an Avatar before entering the Waiting Room.
_Avoid_: User, participant, client (in the role sense)

**Waiting Room**:
The holding screen a Player sees after submitting their Username and Avatar, until the Host presses Play.
_Avoid_: Lobby, staging screen

**Play**:
The action the Host takes once to start the Game, transitioning every connected Player from the Waiting Room into the Game simultaneously.

**Game**:
The sequence of multiple-choice Questions presented to all Players after Play is pressed. Runs fully automatically end-to-end (no Host pacing/intervention) until Final Results.

**Question**:
One multiple-choice round: 4 shape/color-coded options, a per-question time limit, and a point multiplier, sourced from the Question Bank. The question text and countdown render only on the Host Screen; Players see only the 4 answer buttons (no text, no countdown) and lock in their answer on first tap.

**Reveal**:
The phase immediately after a Question's timer expires: the correct answer is highlighted on the Host Screen, and each Player's device shows whether they personally got it right and their points earned. Lasts a fixed 5 seconds.

**Leaderboard**:
The phase after Reveal: the top 5 standings, animated as ranks reorder, shown on the Host Screen; each Player's device shows their own current rank/score. Lasts a fixed 5 seconds, then the Game auto-advances to the next Question.

**Final Results**:
The screen shown after the last Question's Leaderboard phase instead of advancing further — a dedicated, animated podium of standings. Sits with no timer until the Host does something else.

**Question Bank**:
The set of multiple-choice Questions for the Game, sourced from a CSV file (columns: question, 4 options, correct option, time limit, multiplier).
_Avoid_: Quiz data, question set

**Avatar**:
A cosmetic icon a Player picks (from a designed preset grid, falling back to a preset emoji grid if no designs exist yet) alongside their Username. Not unique — duplicates across Players are allowed.
_Avoid_: Icon, profile picture
