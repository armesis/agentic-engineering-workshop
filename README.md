<!--
  AGENT: This is a hands-on workshop. Do NOT stop after summarising this README
  or after cloning + installing. Read AGENTS.md at the repo root and follow it —
  your task is to get the participant onto checkpoint-1-pre-grilling and begin the
  guided grill, not to describe or run the finished app below.
-->

> **📣 Workshop participant?** This repo is the *finished reference* for a
> hands-on workshop. Don't start here — tell your agent to **read `AGENTS.md` and
> follow it**; it will set up your workspace and walk you through building this
> game yourself. The guide below is for running the completed app.

# Quiz Game

A real-time, multiplayer quiz game in the style of Kahoot. One **Host** runs the game on a big screen; **Players** join from their phones by scanning a QR code, answer multiple-choice questions against the clock, and race up a live leaderboard.

- **Host** — the single screen everyone looks at. Shows the join QR code, the roster of players, each question, the answer reveal, and the leaderboard.
- **Player** — joins on their own device, picks a username and avatar, then taps one of four answer buttons per question. Faster correct answers score more.

The game runs itself once started: each question flows automatically into the answer **Reveal**, then a **Leaderboard**, then the next question, ending on an animated **Final Results** podium.

## Requirements

- Node.js 20+ (uses npm workspaces)
- A Host device and Player devices on the **same network** (e.g. the same Wi‑Fi), so phones can reach the Host screen.

## Setup

```bash
npm install
```

Create a `server/.env` file with a Host password and (optionally) a port:

```env
HOST_PASSWORD=choose-a-password
PORT=3000
```

- `HOST_PASSWORD` — required to log in as the Host. Keep it private; anyone with it can control the game.
- `PORT` — optional, defaults to `1923` if unset.

## Run

Build the client and start the server:

```bash
npm run build
npm start
```

The server serves the game and prints its address, e.g.:

```
Server listening on http://localhost:3000
```

## How to play

1. **Host:** open the server URL (`http://localhost:3000`) in a browser on the shared screen and log in with `HOST_PASSWORD`. The Host Screen shows a **QR code**, a live **roster**, and a **Play** button.
2. **Players:** scan the QR code (or open the Host's LAN address with `?role=player`, e.g. `http://<host-lan-ip>:3000/?role=player`). Pick a **username** and an **avatar**, then wait in the Waiting Room. Joined players appear on the Host's roster.
3. **Host:** press **Play** once everyone's in. Every player jumps into the game at the same time.
4. **Each question:** the question and options appear on the **Host Screen only**. Players see four shape/color‑coded buttons and tap one — first tap locks it in. Answer correctly *and* quickly for more points.
5. **Reveal → Leaderboard:** after the timer, the correct answer is highlighted on the Host Screen and each player sees whether they got it right and their points. Then the top standings animate on the Host Screen. The game advances on its own.
6. **Final Results:** after the last question, an animated top‑3 podium plus the full standings is shown.

> Players never receive the question text, options, or correct answer — only the timer. Keep the Host Screen visible to everyone.

## Editing the questions

Questions live in `server/questions.csv`, read once at startup. Each row is one question:

| Column | Meaning |
| --- | --- |
| `question` | The question text |
| `option_a`…`option_d` | The four answer choices |
| `correct_option` | `A`, `B`, `C`, or `D` |
| `time_limit_seconds` | How long players have to answer |
| `multiplier` | Point multiplier for the question |

Example:

```csv
question,option_a,option_b,option_c,option_d,correct_option,time_limit_seconds,multiplier
What does "LLM" stand for?,Large Language Model,Long Loop Method,Live Logic Machine,Linked List Model,A,5,1
```

Edit the file and **restart the server** to load changes.

## Project layout

```
client/   React + Vite + TypeScript frontend (Host and Player share one app, split by ?role=)
server/   Node.js + Express + Socket.IO backend; serves the built client and runs the game
  questions.csv   The question bank
```

## Development

Run the server's unit tests:

```bash
npm test --workspace server
```
