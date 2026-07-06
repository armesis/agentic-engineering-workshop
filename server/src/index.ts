import { fileURLToPath } from "node:url";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { networkInterfaces } from "node:os";
import { createServer } from "node:http";
import express from "express";
import { Server } from "socket.io";
import { joinRoster, reattachPlayer, type Player } from "./roster.js";

function getLanAddress(): string {
  for (const entries of Object.values(networkInterfaces())) {
    for (const entry of entries ?? []) {
      if (entry.family === "IPv4" && !entry.internal) {
        return entry.address;
      }
    }
  }
  return "localhost";
}

try {
  // Optional in production, where HOST_PASSWORD is expected to already be set in the environment.
  process.loadEnvFile();
} catch {}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDistPath = path.resolve(__dirname, "../../client/dist");
const port = Number(process.env.PORT) || 1923;
const hostPassword = process.env.HOST_PASSWORD;

const app = express();
app.use(express.json());

app.get("/api/network-info", (_req, res) => {
  res.json({ host: getLanAddress() });
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

io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);
  socket.emit("roster:update", roster);

  socket.on(
    "player:join",
    (
      candidate: { username: string; avatar: string },
      ack?: (result: ReturnType<typeof joinRoster>) => void,
    ) => {
      const result = joinRoster(roster, { id: randomUUID(), ...candidate });
      if (result.ok) {
        roster = [...roster, result.player];
        io.emit("roster:update", roster);
      }
      ack?.(result);
    },
  );

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
