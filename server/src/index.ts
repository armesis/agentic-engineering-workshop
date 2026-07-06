import { fileURLToPath } from "node:url";
import path from "node:path";
import { createServer } from "node:http";
import express from "express";
import { Server } from "socket.io";
import { joinRoster, type Player } from "./roster.js";

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
      const result = joinRoster(roster, { id: socket.id, ...candidate });
      if (result.ok) {
        roster = [...roster, result.player];
        io.emit("roster:update", roster);
      }
      ack?.(result);
    },
  );

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
    const remaining = roster.filter((p) => p.id !== socket.id);
    if (remaining.length !== roster.length) {
      roster = remaining;
      io.emit("roster:update", roster);
    }
  });
});

httpServer.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
