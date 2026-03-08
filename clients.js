// clients.js
// ─────────────────────────────────────────────────────────────
// This is the ONLY file you edit when adding a new client.
// Add their Facebook Page ID and their Render service URL.
//
// How to find Page ID:
//   Facebook Developer Console → Messenger API Settings
//   → Generate access tokens → the number under the page name
// ─────────────────────────────────────────────────────────────

const clients = [
  {
    name: "SHMF",                                    // Client name (for your reference)
    pageId: "110407757165436",                        // Facebook Page ID
    serverUrl: "https://barber-bot-vqfi.onrender.com" // Their Render service URL
  },
  {
    name: "Anar-salon",                                    // change to real name
    pageId: "61585027208240",
    serverUrl: "https://barber-bot-1-7maq.onrender.com"  // change to real URL
  },

  // ── Add new clients below ──────────────────────────────────
  // {
  //   name: "Otgono Barber",
  //   pageId: "their_page_id_here",
  //   serverUrl: "https://barber-client2.onrender.com"
  // },
];

module.exports = clients;