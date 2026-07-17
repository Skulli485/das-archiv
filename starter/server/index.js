// Das Archiv, Lesetisch.
// Eine schlanke Grenze mit Cache-Aside (Redis mit Fallback auf In-Memory-Map).

const PORT = Number(process.env.PORT ?? 3000);
const REDIS_URL = process.env.REDIS_URL ?? "redis://localhost:6380";
const TTL = Number(process.env.CACHE_TTL ?? 60);

// --- Met Museum API als Quelle ---

const MET_BASE = "https://collectionapi.metmuseum.org/public/collection/v1/objects";

// Kuratierte Galerie: geprüfte Met-Objekt-IDs
const GALERIE_IDS = [436535, 436532, 436530, 436528, 436524, 436521, 436518, 436516];

async function holeAusQuelle(id) {
  const res = await fetch(`${MET_BASE}/${id}`);
  if (!res.ok) throw new Error(`Met API ${res.status}`);
  return await res.json();
}

function toKarte(roh, id) {
  return {
    id: roh.objectID ?? id,
    titel: roh.title || "Ohne Titel",
    kuenstler: roh.artistDisplayName || "Unbekannt",
    jahr: roh.objectDate || "",
    bild: roh.primaryImageSmall || "",
    material: roh.medium || "Unbekannt",
    abteilung: roh.department || "Unbekannt",
  };
}

// --- Redis-Verbindung (mit Fallback auf In-Memory-Map) ---

const map = new Map();
let redis = null;

async function verbindeRedis() {
  try {
    const { createClient } = await import("redis");
    redis = createClient({ url: REDIS_URL });
    redis.on("error", (e) => console.error("[cache] Redis-Fehler:", e.message));
    // Zeitlimit: falls Redis nicht erreichbar, nicht hängen bleiben
    await Promise.race([
      redis.connect(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Verbindungstimeout")), 1500)
      ),
    ]);
    console.log(`[cache] Redis @ ${REDIS_URL}`);
  } catch (e) {
    redis = null;
    console.log(`[cache] map (Redis nicht erreichbar: ${e.message})`);
  }
}

async function gedacht(key) {
  if (redis) {
    const roh = await redis.get(key);
    return roh ? JSON.parse(roh) : null;
  }
  // Map-Fallback
  const eintrag = map.get(key);
  if (eintrag && eintrag.expires > Date.now()) return eintrag.data;
  if (eintrag) map.delete(key);
  return null;
}

async function merke(key, data) {
  if (redis) {
    await redis.set(key, JSON.stringify(data), { EX: TTL });
  } else {
    map.set(key, { data, expires: Date.now() + TTL * 1000 });
  }
}

async function cacheTTL(key) {
  if (redis) {
    const t = await redis.ttl(key);
    return t > 0 ? t : TTL;
  }
  const eintrag = map.get(key);
  if (eintrag) {
    const rest = Math.round((eintrag.expires - Date.now()) / 1000);
    return rest > 0 ? rest : 0;
  }
  return 0;
}

// --- Cache-aside: karte(id) ---

async function karte(id, frisch = false) {
  const key = `archiv:objekt:${id}`;

  // 1. Cache-Treffer? (außer bei ?frisch=1)
  if (!frisch) {
    const getroffen = await gedacht(key);
    if (getroffen) {
      const ttl = await cacheTTL(key);
      return { source: "cache", ms: 0.1, ttl, data: getroffen };
    }
  }

  // 2. Nein -> frisch holen
  const t0 = performance.now();
  const roh = await holeAusQuelle(id);
  const data = toKarte(roh, id);
  const ms = +(performance.now() - t0).toFixed(1);

  // 3. Fürs nächste Mal merken
  await merke(key, data);

  return { source: frisch ? "frisch" : "netz", ms, ttl: TTL, data };
}

// --- Hilfsfunktion ---

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json" },
  });

// --- Server starten (Redis zuerst verbinden) ---

verbindeRedis().then(() => {
  Bun.serve({
    port: PORT,
    async fetch(req) {
      const { pathname } = new URL(req.url);

      // Health-Endpunkt mit Cache-Modus
      if (pathname === "/api/health") {
        return json({
          ok: true,
          dienst: "leseraum",
          cache: redis ? "redis" : "map",
          zeit: new Date().toISOString(),
        });
      }

      // Galerie: kuratierte Liste
      if (pathname === "/api/galerie") {
        return json({ ids: GALERIE_IDS });
      }

      // Einzelobjekt: /api/objekt/:id (mit optionalem ?frisch=1 für Cache-Bypass)
      const m = pathname.match(/^\/api\/objekt\/(\d+)$/);
      if (m) {
        try {
          const url = new URL(req.url);
          const frisch = url.searchParams.get("frisch") === "1";
          return json(await karte(Number(m[1]), frisch));
        } catch (e) {
          return json({ error: e.message }, 502);
        }
      }

      // Suche (Capstone): /api/suche?q=...
      const s = pathname.match(/^\/api\/suche$/);
      if (s) {
        const url = new URL(req.url);
        const q = (url.searchParams.get("q") || "").trim();
        if (!q) return json({ query: "", ergebnisse: [] }, 200);
        try {
          const res = await fetch(
            `https://collectionapi.metmuseum.org/public/collection/v1/search?q=${encodeURIComponent(q)}&hasImages=true`
          );
          if (!res.ok) throw new Error(`Met Search ${res.status}`);
          const body = await res.json();
          const ids = (body.objectIDs || []).slice(0, 12);
          // Hole kurze Karten für die ersten Treffer
          const ergebnisse = await Promise.all(
            ids.map(async (id) => {
              try {
                const roh = await holeAusQuelle(id);
                return {
                  id: roh.objectID ?? id,
                  titel: roh.title || "Ohne Titel",
                  kuenstler: roh.artistDisplayName || "Unbekannt",
                  bild: roh.primaryImageSmall || "",
                };
              } catch {
                return { id, titel: "Nicht gefunden", kuenstler: "—", bild: "" };
              }
            })
          );
          return json({ query: q, ergebnisse });
        } catch (e) {
          return json({ error: e.message }, 502);
        }
      }

      return json({ error: "not found", pfad: pathname }, 404);
    },
  });
  console.log(`[archiv] Server auf http://localhost:${PORT}`);
});
