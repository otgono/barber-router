// index.js
// ─────────────────────────────────────────────────────────────
// BarberBot UB — Webhook Router
//
// This tiny server sits between Facebook and all barber servers.
// Facebook sends ALL messages here → router forwards to the
// correct barber's Render service based on Page ID.
//
// You NEVER change the Facebook webhook URL again.
// To add a new client: just add them to clients.js
// ─────────────────────────────────────────────────────────────

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const clients = require("./clients");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Build a lookup map: { pageId → serverUrl }
const pageRoutes = {};
clients.forEach(client => {
  pageRoutes[client.pageId] = client.serverUrl;
  console.log(`✅ Registered: ${client.name} (${client.pageId}) → ${client.serverUrl}`);
});

// ── Health Check ───────────────────────────────────────────────
app.get("/", (req, res) => {
  res.send(`
    <h2>💈 BarberBot UB — Router</h2>
    <p>Active clients: ${clients.length}</p>
    <ul>${clients.map(c => `<li>${c.name} → ${c.serverUrl}</li>`).join("")}</ul>
  `);
});

// ── Facebook Webhook Verification ─────────────────────────────
app.get("/webhook", (req, res) => {
  const mode      = req.query["hub.mode"];
  const token     = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === process.env.VERIFY_TOKEN) {
    console.log("✅ Router webhook verified by Facebook!");
    res.status(200).send(challenge);
  } else {
    console.warn("❌ Webhook verification failed.");
    res.sendStatus(403);
  }
});

// ── Webhook Receiver & Router ──────────────────────────────────
app.post("/webhook", async (req, res) => {
  // Always respond 200 immediately so Facebook doesn't retry
  res.sendStatus(200);

  const body = req.body;
  if (body.object !== "page") return;

  // Process each entry
  for (const entry of body.entry || []) {
    const pageId = entry.id;
    const targetUrl = pageRoutes[pageId];

    if (!targetUrl) {
      console.warn(`⚠️  Unknown Page ID: ${pageId} — not in clients.js`);
      continue;
    }

    // Forward the entire webhook payload to the correct barber server
    try {
      await axios.post(`${targetUrl}/webhook`, body, {
        headers: { "Content-Type": "application/json" },
        timeout: 5000,
      });
      console.log(`📨 Forwarded Page ${pageId} → ${targetUrl}`);
    } catch (err) {
      console.error(`❌ Forward failed for ${pageId}:`, err.message);
    }
  }
});

// ── Start ──────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════╗
  ║   💈 BarberBot Router — STARTED          ║
  ║   Port: ${PORT}                              ║
  ║   Clients: ${clients.length}                             ║
  ╚══════════════════════════════════════════╝
  `);
});