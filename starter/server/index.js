// Das Archiv, Lesetisch.
// Zwei-Prozess-Geruest: der Server antwortet zunaechst nur auf den Gesundheits-Aufruf.

const PORT = Number(process.env.PORT ?? 3000);

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json" },
  });

Bun.serve({
  port: PORT,
  async fetch(req) {
    const { pathname } = new URL(req.url);

    if (pathname === "/api/health") {
      return json({ ok: true, dienst: "leseraum" });
    }

    return json({ error: "not found", pfad: pathname }, 404);
  },
});

console.log(`[archiv] Server auf http://localhost:${PORT}`);
