# Kahoot-Clone Quiz App

A real-time multiplayer quiz game (client + server) built live during the workshop, then replicated by participants for their own client.

> **Note:** The repository root (this file's directory) sits one level below the session's working directory, at `@"Agentic Engineering Workshop\"`.

## Structure

```
CONTEXT.md              Domain glossary (this file)
docs/adr/                Architecture Decision Records
client/                  React + Vite + TypeScript frontend; Host and Player share one app, split by ?role= query param
  src/
    App.tsx                Role switch: Host login/screen vs Player join/waiting/Game flow
    HostLogin.tsx          Host password form
    HostScreen.tsx         Authenticated Host shell showing the live roster of joined Players and the Play button
    PlayerJoin.tsx         Player join form: Username + preset Avatar grid
    WaitingRoom.tsx        Screen shown to a Player after a successful join, before Play
    Game.tsx               Screen shown to a Player once Play has been pressed; branches on GamePhase (Question round so far)
    QuestionRound.tsx      Player-facing Question UI: 4 shape/color-coded answer buttons, first-tap lock-in
    answerShapes.ts        A/B/C/D -> shape/color/label map for the answer buttons (Kahoot-style)
    socket.ts              Shared Socket.IO client connection
    useSocketEvent.ts      Hook subscribing a state setter to a Socket.IO event for the component's lifetime
    types.ts               Shared client-side types (e.g. Player, GamePhase, HostQuestionView)
    playerIdentity.ts      localStorage persistence of a Player's identity for reconnect
  public/                Static assets served as-is (favicon, icon sprite)
server/                  Node.js + Express + TypeScript + Socket.IO backend
  questions.csv           Question Bank source data, read once at server startup
  src/
    index.ts               Express app, static client serving, Socket.IO wiring, in-memory roster and game phase
    roster.ts              Pure join-validation logic (unit tested)
    roster.test.ts         Vitest unit tests for roster.ts
    game.ts                Pure game-phase transition and join-gating logic (unit tested)
    game.test.ts           Vitest unit tests for game.ts
    questionBank.ts        Pure CSV-to-Question Bank parsing logic (unit tested)
    questionBank.test.ts   Vitest unit tests for questionBank.ts
    scoring.ts             Pure Question-round scoring and first-tap lock-in logic (unit tested)
    scoring.test.ts        Vitest unit tests for scoring.ts
skills/                  Claude Code skills used to build this project (not part of the shipped app)
```

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
