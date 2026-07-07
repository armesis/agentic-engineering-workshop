import { fileURLToPath } from "node:url";
import path from "node:path";
import { readFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { createSocket } from "node:dgram";
import { createServer } from "node:http";
import express from "express";
import { Server } from "socket.io";
import { joinRoster, reattachPlayer, type Player } from "./roster.js";
import { canJoin, startGame, type GamePhase } from "./game.js";
import { parseQuestionBank } from "./questionBank.js";

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
} catch {}

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

let roster: Player[] = [];
let gamePhase: GamePhase = "waiting";

io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);
  socket.emit("roster:update", roster);
  socket.emit("game:phase", gamePhase);

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
        io.emit("roster:update", roster);
      }
      ack?.(result);
    },
  );

  socket.on("game:play", () => {
    const result = startGame(gamePhase);
    if (result.ok) {
      gamePhase = result.phase;
      io.emit("game:phase", gamePhase);
    }
  });

  socket.on(
    "player:rejoin",
    (
      identity: { id: string },
      ack?: (result: ReturnType<typeof reattachPlayer>) => void,
    ) => {
      ack?.(reattachPlayer(roster, identity?.id));
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
