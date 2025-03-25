// backend/src/index.ts
import express from "express";
import cors from "cors";
import { Server, WebSocket } from "ws";
import { v4 as uuidv4 } from "uuid";
import Counter from "./Counter";

// Extend WebSocket type to include our custom properties
interface CustomWebSocket extends WebSocket {
  isAlive: boolean;
  connectionId: string;
}

const app = express();
const port = 3001;

app.use(cors());

const counter = Counter.getInstance();
const server = app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// WebSocket server with proper typing
const wss = new Server({ server });

wss.on("connection", (ws: WebSocket) => {
  const customWs = ws as CustomWebSocket;
  const connectionId = uuidv4();
  customWs.isAlive = true;
  customWs.connectionId = connectionId;

  console.log(`New client connected: ${connectionId}`);

  // Increment counter for new connection
  counter
    .increment(connectionId)
    .then(() => broadcastCount())
    .catch((err) => console.error("Increment error:", err));

  // Send initial count
  counter
    .getCount()
    .then((count) => {
      customWs.send(JSON.stringify({ count, connectionId }));
    })
    .catch((err) => {
      console.error("Error sending initial count:", err);
    });

  // Handle pong responses
  customWs.on("pong", () => {
    customWs.isAlive = true;
  });

  // Handle client disconnection
  customWs.on("close", async () => {
    console.log(`Client disconnected: ${connectionId}`);
    await counter.decrement(connectionId);
    broadcastCount();
  });
});

// Ping clients periodically to detect dead connections
setInterval(() => {
  wss.clients.forEach((ws) => {
    const customWs = ws as CustomWebSocket;
    if (!customWs.isAlive) {
      console.log(`Terminating dead connection: ${customWs.connectionId}`);
      return customWs.terminate();
    }
    customWs.isAlive = false;
    customWs.ping(null, false);
  });
}, 30000);

// Broadcast current count to all clients
function broadcastCount() {
  counter
    .getCount()
    .then((count) => {
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ count }));
        }
      });
    })
    .catch((err) => {
      console.error("Error broadcasting count:", err);
    });
}

// Optional HTTP endpoints
app.get("/api/counter", async (req, res) => {
  try {
    const count = await counter.getCount();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: "Failed to get count" });
  }
});
