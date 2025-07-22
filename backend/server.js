// backend/server.js
require("dotenv").config();
const express = require("express");
const WebSocket = require("ws");
const cors = require("cors");
const { connectDB, Score } = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;

connectDB();

const server = app.listen(PORT, () => {
  console.log(`HTTP Server running on http://localhost:${PORT}`);
});

const wss = new WebSocket.Server({ server });

let clients = [];

wss.on("connection", (ws) => {
  clients.push(ws);
  console.log("New client connected. Total:", clients.length);

  ws.on("close", () => {
    clients = clients.filter((c) => c !== ws);
    console.log("Client disconnected. Remaining:", clients.length);
  });
});

// API to update score
app.post("/update-score", async (req, res) => {
  const { matchId, score } = req.body;

  const updatedScore = await Score.findOneAndUpdate(
    { matchId },
    { score, updatedAt: new Date() },
    { upsert: true, new: true }
  );

  const data = { matchId, score, updatedAt: updatedScore.updatedAt };

  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });

  res.json({ status: "ok", updatedScore });
});
