import { fileURLToPath } from "node:url";
import path from "node:path";
import { readFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { createSocket } from "node:dgram";
import { createServer } from "node:http";
import express from "express";
import { Server } from "socket.io";
import { joinRoster, reattachPlayer, type Player } from "./roster.js";
import {
  advanceQuestion,
  beginLeaderboard,
  beginReveal,
  canJoin,
  showFinalResults,
  startGame,
  LEADERBOARD_DURATION_MS,
  REVEAL_DURATION_MS,
  type GamePhase,
} from "./game.js";
import {
  parseQuestionBank,
  toHostQuestionView,
  toHostRevealView,
  toQuestionTimingView,
  type Question,
} from "./questionBank.js";
import {
  buildRevealResult,
  calculateScore,
  submitAnswer,
  GRACE_WINDOW_MS,
  type AnswerSubmission,
} from "./scoring.js";
import { buildLeaderboard, findEntry, topStandings } from "./leaderboard.js";

// A machine can have several non-internal IPv4 interfaces at once (VirtualBox
// host-only adapters, Hyper-V/WSL virtual switches, VPNs, ...), and none of
// those are reachable from a Player's phone on the same Wi-Fi. Rather than
// guess by interface name, ask the OS routing table which local address it
// would use to reach the internet - that's the adapter actually bridged to
// the router, so it resolves to the real Wi-Fi/Ethernet adapter.
// This opens no real connection; UDP "connect" just performs a route lookup.
function getLanAddress(): Promise<string> {
  return new Promise((resolve) => {
    const socket = createSocket("udp4");
    socket.once("error", () => {
      socket.close();
      resolve("localhost");
    });
    socket.connect(80, "8.8.8.8", () => {
      const address = socket.address().address;
      socket.close();
      resolve(address);
    });
  });
}

try {
  // Optional in production, where HOST_PASSWORD is expected to already be set in the environment.
  process.loadEnvFile();
} catch { }

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDistPath = path.resolve(__dirname, "../../client/dist");
const questionsCsvPath = path.resolve(__dirname, "../questions.csv");
const port = Number(process.env.PORT) || 1923;
const hostPassword = process.env.HOST_PASSWORD;

// Loaded once at startup and held for the process's lifetime - no reload mechanism (ADR-0003).
const questionBank = parseQuestionBank(readFileSync(questionsCsvPath, "utf-8"));
console.log(`Loaded ${questionBank.length} questions into the Question Bank`);

const app = express();
app.use(express.json());

app.get("/api/network-info", async (_req, res) => {
  res.json({ host: await getLanAddress() });
});

app.post("/api/host/login", (req, res) => {
  const { password } = req.body ?? {};
  if (hostPassword && password === hostPassword) {
    res.json({ ok: true });
    return;
  }
  res.status(401).json({ ok: false, error: "Incorrect password" });
});

app.use(express.static(clientDistPath));
app.get("*", (_req, res) => {
  res.sendFile(path.join(clientDistPath, "index.html"));
});

const httpServer = createServer(app);
const io = new Server(httpServer);

const HOST_ROOM = "host";

let roster: Player[] = [];
let gamePhase: GamePhase = "waiting";
let currentQuestion: Question | null = null;
let currentQuestionIndex = -1;
let questionStartedAtMs = 0;
let answers: Record<string, AnswerSubmission> = {};

function playerRoom(playerId: string): string {
  return `player:${playerId}`;
}

// Shared by the initial Play press and the auto-advance loop: enters the
// Question phase at the given Question Bank index and schedules Reveal.
function beginQuestion(index: number) {
  currentQuestionIndex = index;
  currentQuestion = questionBank[index] ?? null;
  questionStartedAtMs = Date.now();
  answers = {};
  gamePhase = "question";
  io.emit("game:phase", gamePhase);
  if (currentQuestion) {
    io.to(HOST_ROOM).emit("question:show", toHostQuestionView(currentQuestion, questionStartedAtMs));
    // Timing only (never question text/options/correct answer) so every
    // Player can drive their own post-answer countdown, synced to this clock.
    io.emit("question:timing", toQuestionTimingView(currentQuestion, questionStartedAtMs));
    setTimeout(revealQuestion, currentQuestion.timeLimitSeconds * 1000 + GRACE_WINDOW_MS);
  }
}

// Fires once the Question's timer plus grace window has elapsed - matches the
// same GRACE_WINDOW_MS scoring.ts uses to decide whether a submission is late.
function revealQuestion() {
  if (!currentQuestion) return;
  const result = beginReveal(gamePhase);
  if (!result.ok) return;

  gamePhase = result.phase;
  io.emit("game:phase", gamePhase);
  io.to(HOST_ROOM).emit("question:reveal", toHostRevealView(currentQuestion));
  for (const player of roster) {
    const revealResult = buildRevealResult(
      { question: currentQuestion, questionStartedAtMs },
      answers[player.id] ?? null,
    );
    io.to(playerRoom(player.id)).emit("player:reveal", revealResult);
  }
  setTimeout(showLeaderboard, REVEAL_DURATION_MS);
}

// Fires once Reveal's fixed duration has elapsed.
function showLeaderboard() {
  const result = beginLeaderboard(gamePhase);
  if (!result.ok) return;

  gamePhase = result.phase;
  io.emit("game:phase", gamePhase);
  const standings = buildLeaderboard(roster);
  io.to(HOST_ROOM).emit("leaderboard:show", topStandings(standings));
  for (const player of roster) {
    const entry = findEntry(standings, player.id);
    if (entry) {
      io.to(playerRoom(player.id)).emit("player:leaderboard", entry);
    }
  }
  setTimeout(advanceToNextQuestion, LEADERBOARD_DURATION_MS);
}

// Fires once Leaderboard's fixed duration has elapsed - the entire
// Question -> Reveal -> Leaderboard cycle repeats with no Host action until
// the Question Bank is exhausted, at which point the Game transitions to
// Final Results instead of advancing again.
function advanceToNextQuestion() {
  const nextIndex = currentQuestionIndex + 1;
  const hasNextQuestion = nextIndex < questionBank.length;

  const result = advanceQuestion(gamePhase, hasNextQuestion);
  if (result.ok) {
    beginQuestion(nextIndex);
    return;
  }

  const finalResult = showFinalResults(gamePhase, hasNextQuestion);
  if (!finalResult.ok) return;
  gamePhase = finalResult.phase;
  io.emit("game:phase", gamePhase);
  io.emit("final-results:show", buildLeaderboard(roster));
}

io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);
  socket.emit("roster:update", roster);
  socket.emit("game:phase", gamePhase);
  // Final Results has no timer and sits indefinitely, so unlike Reveal/
  // Leaderboard's brief windows, a (re)connect arriving after the one-shot
  // transition broadcast needs the standings resent or it lands on an empty podium.
  if (gamePhase === "final-results") {
    socket.emit("final-results:show", buildLeaderboard(roster));
  }
  if (gamePhase === "question" && currentQuestion) {
    socket.emit("question:timing", toQuestionTimingView(currentQuestion, questionStartedAtMs));
  }

  // Only the Host Screen shows question text, options, and a countdown -
  // Players never receive Question content at all, only the phase change.
  socket.on("host:connect", () => {
    socket.join(HOST_ROOM);
    // The Host Screen only mounts (and registers its listeners) after the
    // password-login step, well after this socket connected - the roster:update
    // sent from the "connection" handler above is long gone by then. Resend it
    // here since host:connect fires only after those listeners are attached.
    socket.emit("roster:update", roster);
    if (currentQuestion) {
      socket.emit("question:show", toHostQuestionView(currentQuestion, questionStartedAtMs));
    }
  });

  socket.on(
    "player:join",
    (
      candidate: { username: string; avatar: string },
      ack?: (result: ReturnType<typeof joinRoster>) => void,
    ) => {
      const gate = canJoin(gamePhase);
      if (!gate.ok) {
        ack?.(gate);
        return;
      }
      const result = joinRoster(roster, { id: randomUUID(), ...candidate });
      if (result.ok) {
        roster = [...roster, result.player];
        socket.join(playerRoom(result.player.id));
        io.emit("roster:update", roster);
      }
      ack?.(result);
    },
  );

  socket.on("game:play", () => {
    const result = startGame(gamePhase);
    if (!result.ok) {
      return;
    }
    beginQuestion(0);
  });

  socket.on(
    "player:rejoin",
    (
      identity: { id: string },
      ack?: (result: ReturnType<typeof reattachPlayer>) => void,
    ) => {
      const result = reattachPlayer(roster, identity?.id);
      if (result.ok) {
        socket.join(playerRoom(result.player.id));
      }
      ack?.(result);
    },
  );

  socket.on(
    "player:answer",
    (
      candidate: { playerId: string; optionLetter: AnswerSubmission["optionLetter"] },
      ack?: (result: ReturnType<typeof submitAnswer>) => void,
    ) => {
      if (gamePhase !== "question" || !currentQuestion) {
        ack?.({ ok: false, error: "No active Question" });
        return;
      }

      const result = submitAnswer(answers, candidate.playerId, {
        optionLetter: candidate.optionLetter,
        submittedAtMs: Date.now(),
      });
      if (result.ok) {
        answers[candidate.playerId] = result.submission;
        const points = calculateScore(
          { question: currentQuestion, questionStartedAtMs },
          result.submission,
        );
        // The updated roster (cumulative scores) isn't broadcast live here -
        // Reveal sends each Player their own points-earned-this-Question
        // separately (revealQuestion), and Leaderboard is what broadcasts
        // standings again (showLeaderboard).
        roster = roster.map((player) =>
          player.id === candidate.playerId
            ? { ...player, score: player.score + points }
            : player,
        );
      }
      ack?.(result);
    },
  );

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
    // Roster entries persist across disconnects so a refresh can reattach via localStorage.
  });
});

httpServer.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
