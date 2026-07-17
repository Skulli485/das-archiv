// Das Archiv, Lesetisch.
// Server-Adapter: Quelle rufen und auf eine Katalogkarte normalisieren.

const PORT = Number(process.env.PORT ?? 3000);

// --- Met Museum API als Quelle ---

const MET_BASE = "https://collectionapi.metmuseum.org/public/collection/v1/objects";

// Kuratierte Galerie: geprüfte Met-Objekt-IDs
const GALERIE_IDS = [436535, 436532, 436530, 436528, 436524, 436521, 436518, 436516];

async function holeAusQuelle(id) {
  const res = await fetch(`${MET_BASE}/${id}`);
  if (!res.ok) throw new Error(`Met API ${res.status}`);
  return await res.json();
}

function toKarte(roh) {
  return {
    id: roh.objectID,
    titel: roh.title || "Ohne Titel",
    kuenstler: roh.artistDisplayName || "Unbekannt",
    jahr: roh.objectDate || "",
    bild: roh.primaryImageSmall || "",
    material: roh.medium || "Unbekannt",
    abteilung: roh.department || "Unbekannt",
  };
}

// --- Hilfsfunktion ---

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

    if (pathname === "/api/galerie") {
      return json({ ids: GALERIE_IDS });
    }

    const m = pathname.match(/^\/api\/objekt\/(\d+)$/);
    if (m) {
      try {
        const t0 = performance.now();
        const roh = await holeAusQuelle(Number(m[1]));
        const data = toKarte(roh);
        const ms = +(performance.now() - t0).toFixed(1);
        return json({ source: "netz", ms, data });
      } catch (e) {
        return json({ error: e.message }, 502);
      }
    }

    return json({ error: "not found", pfad: pathname }, 404);
  },
});

console.log(`[archiv] Server auf http://localhost:${PORT}`);
